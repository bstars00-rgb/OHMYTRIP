/** GitHub Pages 프로젝트 경로(/OHMYTRIP)를 흉내내는 로컬 정적 서버 (검증용) */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const BASE = '/OHMYTRIP';
const OUT = path.resolve(process.cwd(), 'out');
const PORT = Number(process.env.PORT ?? 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
};

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404).end('outside base path');
    return;
  }
  let rel = decodeURIComponent(url.pathname.slice(BASE.length)) || '/';
  let file = path.join(OUT, rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file)) {
    const htmlAlt = `${file}.html`;
    if (existsSync(htmlAlt)) file = htmlAlt;
    else {
      res.writeHead(404).end('not found: ' + rel);
      return;
    }
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`pages preview at http://localhost:${PORT}${BASE}/`));
