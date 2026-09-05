// 실제 브라우저로 한 바퀴: 랜딩 → 문항(되돌아가기 포함) → 결과 → 공유 문구 → 공유받은 화면 → OG 페이지 리다이렉트 → 카드 저장.
// 실행: npm run smoke  (playwright 가 로컬 또는 전역에 설치되어 있어야 한다)
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { TYPES } from '../data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }

const PORT = 3123;
const BASE = `http://localhost:${PORT}/`;
const out = mkdtempSync(join(tmpdir(), 'axtype-smoke-'));
const failures = [];
const expect = (cond, msg) => { if (!cond) failures.push(msg); };

const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: root, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const browser = await pw.chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_CONNECTION|net::/.test(m.text())) errors.push('console: ' + m.text()); });

  // 랜딩
  await page.goto(BASE);
  await page.waitForSelector('#start');
  expect((await page.$$('.figure img')).length === TYPES.length, '랜딩에 타입 수만큼 피규어가 없다');

  // 문항: 되돌아가기
  await page.click('#start');
  await page.waitForSelector('.option');
  await page.click('.option >> nth=0');
  await page.waitForSelector('#back');
  await page.click('#back');
  expect((await page.textContent('.progress span')).trim().startsWith('1 /'), '이전 버튼이 1번 문항으로 돌아가지 않는다');
  expect(await page.$('.option.selected'), '이전으로 돌아왔을 때 고른 답이 표시되지 않는다');

  // 1번 선택지만 10번 → 프로토타이퍼
  for (let i = 0; i < 10; i++) { await page.waitForSelector('.option'); await page.click('.option >> nth=0'); }
  await page.waitForSelector('.result-card');
  const first = TYPES[0];
  expect((await page.textContent('.result-card .name')).includes(first.ko), '1번만 고르면 첫 타입이 나와야 한다');
  const code = (await page.textContent('.result-card .code')).trim();
  expect(/^[A-Z]{4}-[A-Z]$/.test(code), `결과 코드 형식이 아니다: ${code}`);
  const threads = await page.getAttribute('a.threads', 'href');
  const text = decodeURIComponent(threads.split('text=')[1]);
  expect(text.startsWith(`나의 AX 타입은 ${code}`), '공유 문구가 결과 코드로 시작하지 않는다');
  expect(text.includes(`${BASE}r/${first.id}/`), '공유 문구에 결과 페이지 링크가 없다');
  expect((await page.$$('.bars .row')).length === TYPES.length, '막대가 타입 수와 다르다');
  const pcts = await page.$$eval('.bars .pct', (els) => els.map((e) => parseInt(e.textContent, 10)));
  const sum = pcts.reduce((a, b) => a + b, 0);
  expect(sum >= 98 && sum <= 102, `막대 합이 100% 가 아니다: ${sum}`);

  // 카드 저장
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#save')]);
  expect(dl.suggestedFilename() === `axtype-${first.id}.png`, '저장 파일명이 다르다');
  await dl.saveAs(join(out, dl.suggestedFilename()));

  // 공유받은 화면
  await page.goto(`${BASE}?r=${TYPES[2].id}`);
  await page.waitForSelector('#start');
  expect((await page.title()).startsWith(TYPES[2].code), '공유받은 화면 제목이 코드로 시작하지 않는다');
  expect(!(await page.$('a.threads')), '공유받은 화면에는 공유 버튼이 없어야 한다');

  // 이상한 r 값은 랜딩으로
  await page.goto(`${BASE}?r=constructor`);
  await page.waitForSelector('#start');
  expect(!(await page.$('.result-card')), '?r=constructor 가 결과 화면을 띄운다');

  // OG 페이지 리다이렉트
  await page.goto(`${BASE}r/${TYPES[3].id}/`);
  await page.waitForSelector('.result-card');
  expect(page.url().endsWith(`?r=${TYPES[3].id}`), 'r/<type>/ 가 본편으로 보내지 않는다');

  // 섞어서 → 서브 타입 표시
  await page.goto(BASE);
  await page.click('#start');
  for (const k of [1, 2, 0, 2, 1, 0, 1, 2, 0, 1]) { await page.waitForSelector('.option'); await page.click(`.option >> nth=${k}`); }
  await page.waitForSelector('.bars');
  expect(await page.$('.result-card .sub'), '섞어 답했는데 서브 타입이 없다');

  // 매니페스트·서비스 워커 파일이 응답하는지
  for (const p of ['manifest.webmanifest', 'sw.js', 'icons/favicon.svg', 'og/default.png']) {
    const res = await page.request.get(BASE + p);
    expect(res.ok(), `${p} 가 ${res.status()} 로 응답`);
  }

  expect(errors.length === 0, '브라우저 오류: ' + errors.join(' / '));
} finally {
  await browser.close();
  srv.kill();
}

if (failures.length) {
  console.error(`✗ ${failures.length}개 실패:`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('✓ 브라우저 한 바퀴 통과 (랜딩, 되돌아가기, 결과, 공유 문구, 카드 저장, 공유받은 화면, OG 리다이렉트, 서브 타입, PWA 파일)');
