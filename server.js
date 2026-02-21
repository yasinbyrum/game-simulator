const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080; // Render için PORT env var

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg'
};

console.log(`ðŸš€ AKILLI SUNUCU BAÅžLATILDI: http://localhost:${PORT}`);

// --- FILE WRITE QUEUE (prevents race conditions) ---
const fileQueues = new Map(); // filePath -> Promise chain

function processUpdate(filePath, varName, newData) {
    // Chain this update after any pending updates for the same file
    const prev = fileQueues.get(filePath) || Promise.resolve();
    const next = prev.then(() => new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, fileContent) => {
            if (err) { reject(err); return; }

            const newDataJSON = JSON.stringify(newData, null, 2);

            // Find "var varName =" or "let varName ="
            const patterns = ['var ' + varName + ' =', 'let ' + varName + ' =', 'var ' + varName + '=', 'let ' + varName + '=', 'window.' + varName + ' =', 'window.' + varName + '='];
            let declStart = -1;
            let matchedPrefix = 'var ' + varName + ' = '; // default
            for (const pat of patterns) {
                const idx = fileContent.indexOf(pat);
                if (idx !== -1) { declStart = idx; matchedPrefix = pat.replace(/=$/, '= '); break; }
            }

            let newContent;
            if (declStart === -1) {
                console.log(`[UPDATE] Variable "${varName}" NOT FOUND. Appending.`);
                newContent = fileContent + '\n\nvar ' + varName + ' = ' + newDataJSON + ';\n';
            } else {
                let eqPos = fileContent.indexOf('=', declStart);
                let valueStart = eqPos + 1;
                while (valueStart < fileContent.length && /\s/.test(fileContent[valueStart])) valueStart++;

                let depth = 0, i = valueStart, started = false;
                let inString = false, strChar = '', escaped = false;

                while (i < fileContent.length) {
                    const ch = fileContent[i];
                    if (escaped) { escaped = false; i++; continue; }
                    if (ch === '\\') { escaped = true; i++; continue; }
                    if (inString) { if (ch === strChar) inString = false; i++; continue; }
                    if (ch === '"' || ch === "'") { inString = true; strChar = ch; i++; continue; }
                    if (ch === '{' || ch === '[') { depth++; started = true; }
                    if (ch === '}' || ch === ']') { depth--; }
                    if (started && depth === 0) {
                        i++;
                        while (i < fileContent.length && /[\s;]/.test(fileContent[i]) && fileContent[i] !== '\n' && fileContent[i] !== '\r') i++;
                        if (i < fileContent.length && fileContent[i] === ';') i++;
                        break;
                    }
                    i++;
                }

                let before = fileContent.substring(0, declStart);
                let after = fileContent.substring(i);
                newContent = before + matchedPrefix + newDataJSON + ';' + after;
                console.log(`[UPDATE] ${varName}: found at ${declStart}, ends at ${i}. Replaced.`);
            }

            fs.writeFile(filePath, newContent, (writeErr) => {
                if (writeErr) { reject(writeErr); return; }
                console.log('[DISK UPDATED] ' + varName);
                resolve();
            });
        });
    }));
    fileQueues.set(filePath, next.catch(() => { })); // Don't let errors break the chain
    return next;
}

http.createServer(function (request, response) {

    // --- 1. SAVE SYSTEM (QUEUED) ---
    if (request.method === 'POST' && request.url === '/update-data') {
        let body = '';
        request.on('data', chunk => body += chunk.toString());
        request.on('end', () => {
            try {
                const postData = JSON.parse(body);
                const filePath = path.join(__dirname, path.basename(postData.filename));
                const varName = postData.varName;
                console.log(`[QUEUE] ${varName} -> ${filePath}`);

                processUpdate(filePath, varName, postData.data)
                    .then(() => {
                        response.writeHead(200); response.end('Success');
                    })
                    .catch((err) => {
                        console.error('Save Error:', err);
                        response.writeHead(500); response.end('Error');
                    });
            } catch (e) {
                console.error("JSON Parse Error:", e);
                response.writeHead(400); response.end('Invalid Data');
            }
        });
        return;
    }

    // --- 2. DOSYA SUNUMU (GET) ---
    let safeUrl = request.url.split('?')[0];
    let filePath = '.' + safeUrl;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            response.writeHead(error.code == 'ENOENT' ? 404 : 500);
            response.end(error.code);
        } else {
            // Görseller için aggressive cache, diğerleri için no-cache
            const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(extname);
            const cacheHeaders = isImage
                ? {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable', // 1 yıl cache
                    'Expires': new Date(Date.now() + 31536000000).toUTCString()
                }
                : {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Expires': '0'
                };

            response.writeHead(200, cacheHeaders);
            response.end(content, 'utf-8');
        }
    });

}).listen(PORT);