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

                    // 2. DeÄŸiÅŸkeni Bul ve DeÄŸiÅŸtir (Regex)
                    const varName = postData.varName;
                    const newDataJSON = JSON.stringify(postData.data, null, 2);

                    // Regex: "let/var degisken = ... ;" ya da dosya sonuna kadar olan kismi bulur
                    const regex = new RegExp(`((?:let|var)\\s+${varName}\\s*=\\s*)([\\s\\S]*?)(\\n\\s*(?:let|const|var|\\/\\/)|$)`);

                    let newContent;
                    if (regex.test(fileContent)) {
                        // DeÄŸiÅŸken varsa deÄŸiÅŸtir
                        newContent = fileContent.replace(regex, `$1${newDataJSON};\n$3`);
                    } else {
                        // DeÄŸiÅŸken yoksa dosyanÄ±n sonuna ekle
                        newContent = fileContent + `\n\nlet ${varName} = ${newDataJSON};`;
                    }

                    // 3. DosyayÄ± Geri Yaz
                    fs.writeFile(filePath, newContent, (writeErr) => {
                        if (writeErr) {
                            console.error("âŒ Yazma HatasÄ±:", writeErr);
                            response.writeHead(500); response.end('Write Error');
                        } else {
                            console.log(`âœ… [DÄ°SK GÃœNCELLENDÄ°] Dosya: ${postData.filename} | DeÄŸiÅŸken: ${varName}`);
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