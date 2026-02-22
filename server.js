const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080; // Render için PORT env var

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg'
};

console.log(`🚀 AKILLI SUNUCU BAŞLATILDI: http://localhost:${PORT}`);

// --- FILE WRITE QUEUE (prevents race conditions) ---
const fileQueues = new Map(); // filePath -> Promise chain

// --- AUTO GIT PUSH (debounced to batch rapid saves) ---
let gitPushTimer = null;
const GIT_PUSH_DELAY = 5000; // 5 seconds debounce
let lastPushedVar = '';

function scheduleGitPush(varName) {
    lastPushedVar = varName;
    if (gitPushTimer) clearTimeout(gitPushTimer);
    gitPushTimer = setTimeout(() => {
        doGitPush(lastPushedVar);
    }, GIT_PUSH_DELAY);
}

function doGitPush(label, callback) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        const msg = '[GIT] No GITHUB_TOKEN env var set — skipping auto-push. Changes saved to disk only.';
        console.log(msg);
        if (callback) callback(msg);
        return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const commitMsg = `Auto-save config: ${label} (${timestamp})`;
    console.log(`[GIT] Starting commit+push: "${commitMsg}"`);
    console.log(`[GIT] Token length: ${token.length}, starts with: ${token.substring(0, 4)}...`);

    // Add remote if missing (Render strips it), then set URL
    const repoUrl = `https://${token}@github.com/yasinbyrum/game-simulator.git`;
    const cmds = [
        'git config user.email "auto-save@render.com"',
        'git config user.name "Auto-Save Bot"',
        `git remote add origin ${repoUrl} 2>/dev/null; git remote set-url origin ${repoUrl}`,
        'git add -A',
        `git commit -m "${commitMsg}"`,
        'git push origin main'
    ].join(' && ');

    exec(cmds, { cwd: __dirname, timeout: 30000 }, (err, stdout, stderr) => {
        let result = '';
        if (err) {
            if ((stdout + stderr).includes('nothing to commit')) {
                result = '[GIT] Nothing to commit, working tree clean.';
                console.log(result);
            } else {
                result = `[GIT ERROR] code=${err.code} signal=${err.signal}\n` +
                    `[GIT STDOUT] ${stdout}\n[GIT STDERR] ${stderr}`;
                console.error(result);
            }
        } else {
            result = '[GIT] ✅ Push successful! ' + stdout.trim();
            console.log(result);
        }
        if (callback) callback(result);
    });
}

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
                scheduleGitPush(varName);
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

    // --- 2. GIT DIAGNOSTIC ENDPOINT ---
    if (request.method === 'GET' && request.url === '/git-test') {
        const results = [];
        const token = process.env.GITHUB_TOKEN;
        results.push(`GITHUB_TOKEN set: ${!!token}`);
        if (token) results.push(`Token length: ${token.length}, prefix: ${token.substring(0, 4)}...`);

        // Check if .git exists
        const gitDir = path.join(__dirname, '.git');
        results.push(`.git exists: ${fs.existsSync(gitDir)}`);
        results.push(`__dirname: ${__dirname}`);

        // Check if git command works
        exec('git status --short && git remote -v && git log -1 --oneline', { cwd: __dirname, timeout: 10000 }, (err, stdout, stderr) => {
            if (err) {
                results.push(`git status ERROR: ${err.message}`);
                results.push(`stderr: ${stderr}`);
            } else {
                results.push(`git output:\n${stdout}`);
            }

            // Try a test push
            results.push('\n--- Attempting test push ---');
            doGitPush('git-test-endpoint', (pushResult) => {
                results.push(pushResult);
                response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end(results.join('\n'));
            });
        });
        return;
    }

    // --- 3. DOSYA SUNUMU (GET) ---
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