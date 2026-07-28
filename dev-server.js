#!/usr/bin/env node
/**
 * 의존성 없는 로컬 개발 서버 + 라이브 리로드.
 *   node dev-server.js         → http://localhost:5173
 *   PORT=8080 node dev-server.js
 *
 * 파일이 저장되면 SSE(/__reload)로 브라우저에 알려 자동 새로고침한다.
 * 리로드 스크립트는 응답할 때만 주입하므로 index.html 원본은 건드리지 않는다.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5173;
const POLL_MS = 300;
const IGNORE = new Set(['.git', 'node_modules', '.vscode']);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
};

// window load 이후에 연결한다 — 로드 중에 열면 탭이 계속 "로딩 중"으로 남는다.
const RELOAD_SNIPPET = `
<script>window.addEventListener('load', function(){
  var es = new EventSource('/__reload');
  es.onmessage = function(){ location.reload(); };
  es.onerror = function(){ /* 서버 재시작 시 브라우저가 알아서 재연결 */ };
});</script>
`;

/** @type {http.ServerResponse[]} */
const clients = [];

function snapshot(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.vscode') continue;
    if (IGNORE.has(e.name)) continue;
    if (e.isFile() && /\.tmp\.|~$|\.swp$/.test(e.name)) continue; // 에디터 임시 파일
    const full = path.join(dir, e.name);
    if (e.isDirectory()) snapshot(full, out);
    else {
      try {
        out[full] = fs.statSync(full).mtimeMs;
      } catch {
        /* 삭제된 파일 무시 */
      }
    }
  }
  return out;
}

let prev = snapshot(ROOT, {});
setInterval(() => {
  const next = snapshot(ROOT, {});
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  let changed = null;
  for (const k of keys) {
    if (prev[k] !== next[k]) {
      changed = k;
      break;
    }
  }
  prev = next;
  if (changed) {
    console.log(`  ↻ ${path.relative(ROOT, changed)} → reload (${clients.length} client)`);
    for (const res of clients) res.write('data: reload\n\n');
  }
}, POLL_MS).unref?.();

function send(res, code, type, body) {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store, max-age=0',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  if (url === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 500\n\n');
    clients.push(res);
    req.on('close', () => {
      const i = clients.indexOf(res);
      if (i !== -1) clients.splice(i, 1);
    });
    return;
  }

  let filePath = path.join(ROOT, url);
  // 디렉터리 탈출 방지
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'text/plain', 'Forbidden');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    return send(res, 404, 'text/html; charset=utf-8', `<h1>404</h1><p>${url}</p>`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  if (ext === '.html') {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.includes('</body>')
      ? html.replace('</body>', `${RELOAD_SNIPPET}</body>`)
      : html + RELOAD_SNIPPET;
    return send(res, 200, type, html);
  }
  send(res, 200, type, fs.readFileSync(filePath));
});

// 포트가 이미 쓰이고 있으면 다음 번호로 자동 이동 (최대 +20)
let attempt = PORT;
server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err;
  if (attempt - PORT >= 20) {
    console.error(`\n  ✗ ${PORT}~${attempt} 포트가 모두 사용 중입니다.`);
    console.error(`    PORT=9000 node dev-server.js  처럼 직접 지정해 주세요.\n`);
    process.exit(1);
  }
  console.log(`  · ${attempt} 포트 사용 중 → ${attempt + 1} 로 이동`);
  attempt += 1;
  server.listen(attempt);
});

server.on('listening', () => {
  console.log(`\n  seungsukam.github.io dev server`);
  console.log(`  ▸ http://localhost:${attempt}`);
  console.log(`  ▸ watching ${ROOT} (live reload on save)`);
  console.log(`  ▸ 종료하려면 Ctrl+C\n`);
});

server.listen(attempt);
