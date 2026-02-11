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

http.createServer(function (request, response) {

    // --- 1. AKILLI KAYIT SÄ°STEMÄ° (SERVER-SIDE EDIT) ---
    if (request.method === 'POST' && request.url === '/update-data') {
        let body = '';
        request.on('data', chunk => body += chunk.toString());
        request.on('end', () => {
            try {
                const postData = JSON.parse(body); // { filename, varName, data }
                const filePath = path.join(__dirname, path.basename(postData.filename));

                // 1. DosyayÄ± Diskten Oku (Cache derdi yok!)
                fs.readFile(filePath, 'utf8', (err, fileContent) => {
                    if (err) {
                        console.error("âŒ Okuma HatasÄ±:", err);
                        response.writeHead(500); response.end('Read Error'); return;
                    }

                    // 2. Find and Replace Variable (Robust Bracket-Counting)
                    const varName = postData.varName;
                    console.log(`[UPDATE] Request: ${varName} in ${postData.filename}`);
                    console.log(`[UPDATE] Target File: ${filePath}`);

                    const newDataJSON = JSON.stringify(postData.data, null, 2);

                    // Find "var varName =" or "let varName ="
                    const patterns = [`var ${varName} =`, `let ${varName} =`, `var ${varName}=`, `let ${varName}=`];
                    let declStart = -1;
                    let declPrefix = '';
                    for (const pat of patterns) {
                        const idx = fileContent.indexOf(pat);
                        if (idx !== -1) {
                            declStart = idx;
                            declPrefix = pat.endsWith('=') ? pat + ' ' : pat;
                            break;
                        }
                    }

                    let newContent;
                    if (declStart === -1) {
                        console.log(`[UPDATE] Variable "${varName}" NOT FOUND. Appending.`);
                        newContent = fileContent + `\n\nvar ${varName} = ${newDataJSON};\n`;
                    } else {
                        // Find the start of the value (after "=")
                        let eqPos = fileContent.indexOf('=', declStart);
                        let valueStart = eqPos + 1;
                        // Skip whitespace after =
                        while (valueStart < fileContent.length && /\s/.test(fileContent[valueStart])) valueStart++;

                        // Count brackets to find end of value
                        let depth = 0;
                        let i = valueStart;
                        let started = false;
                        const openBrackets = new Set(['{', '[']);
                        const closeBrackets = new Set(['}', ']']);
                        let inString = false;
                        let strChar = '';
                        let escaped = false;

                        while (i < fileContent.length) {
                            const ch = fileContent[i];

                            if (escaped) { escaped = false; i++; continue; }
                            if (ch === '\\') { escaped = true; i++; continue; }

                            if (inString) {
                                if (ch === strChar) inString = false;
                                i++; continue;
                            }

                            if (ch === '"' || ch === "'") {
                                inString = true; strChar = ch; i++; continue;
                            }

                            if (openBrackets.has(ch)) { depth++; started = true; }
                            if (closeBrackets.has(ch)) { depth--; }

                            if (started && depth === 0) {
                                // Found the closing bracket
                                i++; // include the closing bracket
                                // Skip optional semicolon
                                while (i < fileContent.length && /[\s;]/.test(fileContent[i]) && fileContent[i] !== '\n' && fileContent[i] !== '\r') i++;
                                if (i < fileContent.length && fileContent[i] === ';') i++;
                                break;
                            }
                            i++;
                        }

                        let valueEnd = i;
                        let before = fileContent.substring(0, declStart);
                        let after = fileContent.substring(valueEnd);

                        newContent = before + `var ${varName} = ${newDataJSON};` + after;
                        console.log(`[UPDATE] Variable found at pos ${declStart}, value ends at ${valueEnd}. Replaced.`);
                    }

                    // 3. Write File Back
                    fs.writeFile(filePath, newContent, (writeErr) => {
                        if (writeErr) {
                            console.error("Write Error:", writeErr);
                            response.writeHead(500); response.end('Write Error');
                        } else {
                            console.log(`✅ [DISK UPDATED] File: ${postData.filename} | Var: ${varName}`);
                            response.writeHead(200); response.end('Success');
                        }
                    });
                });

            } catch (e) {
                console.error("JSON Parse HatasÄ±:", e);
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