// 로컬 테스트용 정적 파일 서버 (게임 로직 없음 — GitHub Pages에 올리면 이 파일은 필요 없어요)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = Number(process.env.PORT) || 8080;
const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
function lanIP() {
  const out = [];
  for (const l of Object.values(os.networkInterfaces())) for (const n of l || []) if (n.family === 'IPv4' && !n.internal) out.push(n.address);
  return out.sort((a, b) => /^192\.168\./.test(b) - /^192\.168\./.test(a))[0] || 'localhost';
}
http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/__lan.json') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ip: lanIP(), port: PORT })); }
  let f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  if (p.endsWith('/')) f = path.join(f, 'index.html');
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('\n  EIGHT 성수 게임센터 — 로컬 테스트 서버');
  console.log('  대시보드 : http://localhost:' + PORT + '/');
  console.log('  같은 와이파이 폰: http://' + lanIP() + ':' + PORT + '/');
  console.log('\n  * GitHub에 public 폴더를 올리면 이 서버 없이, LTE 폰에서도 동작합니다.\n');
});
