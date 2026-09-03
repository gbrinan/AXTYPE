// data.js 에서 r/<type>/index.html (OG 태그 페이지) 과 og/<type>.png 를 생성한다.
// 실행: npm run build  — 생성물은 손으로 고치지 않는다. 항상 data.js 를 고치고 다시 만든다.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { SITE, TYPES } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 1. r/<type>/index.html — 크롤러가 읽는 OG 태그 + 사람은 본편으로 이동 */
for (const t of TYPES) {
  const title = `나의 AX 타입: ${t.emoji} ${t.ko}`;
  const desc = `"${t.headline}" · ${SITE.tagline} 10문항 1분.`;
  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE.url}/og/${t.id}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${SITE.url}/r/${t.id}/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${SITE.url}/r/${t.id}/">
  <script>location.replace('../../?r=${t.id}');</script>
</head>
<body>
  <p>${t.emoji} ${esc(t.ko)} · ${esc(t.headline)} — <a href="../../?r=${t.id}">결과 보기</a></p>
</body>
</html>
`;
  const dir = join(root, 'r', t.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`r/${t.id}/index.html`);
}

/* 2. og/<type>.png — 1200×630 */
function ogHtml({ color, ink, emoji, ko, en, headline, label, cta, emojiSize = 260, stacked = false }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap">
<style>
  html,body{margin:0}
  body{width:1200px;height:630px;background:${color};color:${ink};font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;display:flex;${stacked ? 'flex-direction:column;align-items:flex-start;justify-content:center;gap:36px' : 'align-items:center;justify-content:space-between'};padding:0 96px;box-sizing:border-box}
  .l{display:flex;flex-direction:column;gap:10px;max-width:${stacked ? '1000px' : '760px'}}
  .label{font-size:30px;font-weight:700;opacity:.85}
  .name{font-size:${stacked ? 84 : 96}px;font-weight:900;letter-spacing:-.03em;line-height:1.05}
  .name small{font-size:34px;font-weight:700;opacity:.8;margin-left:16px}
  .headline{font-size:44px;font-weight:700;margin-top:6px;word-break:keep-all}
  .cta{font-size:26px;font-weight:700;opacity:.8;margin-top:28px}
  .emoji{font-size:${emojiSize}px;line-height:1;flex-shrink:0;letter-spacing:.06em}
  .name small{display:block;margin:6px 0 0}
</style></head><body>
<div class="l">
  <div class="label">${esc(label)}</div>
  <div class="name">${esc(ko)}${en ? `<small>${esc(en)}</small>` : ''}</div>
  <div class="headline">${esc(headline)}</div>
  <div class="cta">${esc(cta)}</div>
</div>
<div class="emoji">${emoji}</div>
</body></html>`;
}

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright'); } catch {}
  try { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } catch {}
  return null;
}

const pw = loadPlaywright();
if (!pw) {
  console.error('playwright 를 찾지 못해 OG 이미지를 만들지 못했습니다. `npm i -D playwright && npx playwright install chromium` 후 다시 실행하세요.');
  process.exit(1);
}

const cta = `${SITE.tagline} 10문항 1분`;
const cards = [
  ...TYPES.map((t) => ({ file: t.id, label: '나의 AX 타입', cta, ...t })),
  {
    file: 'default', label: 'AX = AI Transformation', color: '#16161a', ink: '#ffffff',
    emoji: TYPES.map((t) => t.emoji).join(''), emojiSize: 104, stacked: true,
    ko: SITE.name, en: '', headline: TYPES.map((t) => t.ko).join(' · ') + ' 중 나는?', cta,
  },
];

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await pw.chromium.launch({ proxy });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
mkdirSync(join(root, 'og'), { recursive: true });
for (const c of cards) {
  await page.setContent(ogHtml(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(root, 'og', `${c.file}.png`), type: 'png' });
  console.log(`og/${c.file}.png`);
}
await browser.close();
