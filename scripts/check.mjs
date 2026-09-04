// 문항·타입 데이터의 구조, 균형, 결과 분포, 생성물 동기화를 검증한다.
// 실행: npm run check   (실패 시 종료 코드 1)
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPES, QUESTIONS, SITE } from '../data.js';
import { score } from '../scoring.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ids = TYPES.map((t) => t.id);
const problems = [];
const fail = (msg) => problems.push(msg);

/* 1. 구조 */
if (TYPES.length !== 5) fail(`타입은 5개여야 합니다 (현재 ${TYPES.length})`);
if (QUESTIONS.length !== 10) fail(`문항은 10개여야 합니다 (현재 ${QUESTIONS.length})`);
for (const t of TYPES) {
  for (const key of ['id', 'en', 'ko', 'emoji', 'color', 'ink', 'headline', 'tagline', 'weapon', 'shadow', 'share']) {
    if (!t[key]) fail(`${t.id}: '${key}' 누락`);
  }
  if (!Array.isArray(t.traits) || t.traits.length !== 3) fail(`${t.id}: traits 는 3개`);
  if (t.headline.length > 16) fail(`${t.id}: headline 은 16자 이내 (현재 ${t.headline.length}자) — 카드와 OG 에서 잘림`);
  if (!/^[A-Z]{4}$/.test(t.code || '')) fail(`${t.id}: code 는 대문자 4글자 (현재 '${t.code}')`);
  if (!t.nick || t.nick.length > 4) fail(`${t.id}: nick 은 1~4자 별명`);
  if (!Array.isArray(t.tags) || t.tags.length !== 3) fail(`${t.id}: tags 는 3개`);
  for (const rel of ['best', 'clash']) {
    if (!ids.includes(t[rel]?.id)) fail(`${t.id}: ${rel}.id 가 존재하지 않는 타입`);
    if (t[rel]?.id === t.id) fail(`${t.id}: ${rel} 가 자기 자신`);
  }
}
QUESTIONS.forEach((q, qi) => {
  if (!q.text) fail(`Q${qi + 1}: text 누락`);
  if (q.options.length !== 3) fail(`Q${qi + 1}: 선택지는 3개`);
  const primaries = new Set();
  q.options.forEach((o, oi) => {
    if (!o.text) fail(`Q${qi + 1}-${oi + 1}: text 누락`);
    if (!ids.includes(o.primary)) fail(`Q${qi + 1}-${oi + 1}: primary '${o.primary}' 없음`);
    if (!ids.includes(o.secondary)) fail(`Q${qi + 1}-${oi + 1}: secondary '${o.secondary}' 없음`);
    if (o.primary === o.secondary) fail(`Q${qi + 1}-${oi + 1}: primary 와 secondary 가 같음`);
    if (primaries.has(o.primary)) fail(`Q${qi + 1}: primary '${o.primary}' 가 한 문항에 두 번`);
    primaries.add(o.primary);
  });
});

if (new Set(TYPES.map((t) => (t.code || '')[0])).size !== TYPES.length) fail('code 첫 글자가 타입마다 달라야 서브 코드(PRTO-G)가 구분된다');

/* 2. 균형: 모든 타입이 primary/secondary 로 같은 횟수 등장 */
const count = { primary: {}, secondary: {} };
for (const id of ids) { count.primary[id] = 0; count.secondary[id] = 0; }
for (const q of QUESTIONS) for (const o of q.options) { count.primary[o.primary]++; count.secondary[o.secondary]++; }
for (const kind of ['primary', 'secondary']) {
  const values = Object.values(count[kind]);
  if (new Set(values).size !== 1) fail(`${kind} 등장 횟수 불균형: ${JSON.stringify(count[kind])}`);
}

/* 3. 결과 분포: 모든 답 조합(3^10)에서 각 타입이 나올 비율 */
const total = 3 ** QUESTIONS.length;
const wins = Object.fromEntries(ids.map((id) => [id, 0]));
const answers = new Array(QUESTIONS.length).fill(0);
for (let n = 0; n < total; n++) {
  let m = n;
  for (let i = 0; i < answers.length; i++) { answers[i] = m % 3; m = Math.floor(m / 3); }
  wins[score(answers).main.id]++;
}
const MIN_SHARE = 0.12; // 어떤 타입도 전체 조합의 12% 아래로 내려가면 실패
const shares = Object.fromEntries(ids.map((id) => [id, wins[id] / total]));
for (const id of ids) if (shares[id] < MIN_SHARE) fail(`'${id}' 가 나올 확률이 너무 낮음: ${(shares[id] * 100).toFixed(1)}%`);

/* 4. 생성물 동기화: r/<id>/index.html 과 og/<id>.png 가 data.js 와 맞는지 */
for (const t of TYPES) {
  const page = resolve(root, 'r', t.id, 'index.html');
  if (!existsSync(page)) { fail(`${page} 없음 — npm run build`); continue; }
  const html = readFileSync(page, 'utf8');
  for (const needle of [t.headline, `${SITE.url}/og/${t.id}.png`, `?r=${t.id}`]) {
    if (!html.includes(needle)) fail(`r/${t.id}/index.html 이 data.js 와 어긋남: '${needle}' 없음 — npm run build`);
  }
  if (!existsSync(resolve(root, 'og', `${t.id}.png`))) fail(`og/${t.id}.png 없음 — npm run build`);
  if (!existsSync(resolve(root, 'assets', `${t.id}.webp`))) fail(`assets/${t.id}.webp 없음 — 타입별 캐릭터 아트 (findings.md 의 생성 프롬프트로 다시 만든다)`);
}
if (!existsSync(resolve(root, 'og', 'default.png'))) fail('og/default.png 없음 — npm run build');
const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8');
if (!indexHtml.includes(`${SITE.url}/og/default.png`)) fail('index.html 의 og:image 가 data.js 의 SITE.url 과 다름');
if (!indexHtml.includes(SITE.description)) fail('index.html 의 description 이 data.js 의 SITE.description 과 다름');
if (!indexHtml.includes(SITE.length)) fail('index.html 의 og:description 에 SITE.length 가 없음');
const readme = readFileSync(resolve(root, 'README.md'), 'utf8');
for (const t of TYPES) if (!readme.includes(t.headline)) fail(`README 타입 표가 data.js 와 어긋남: '${t.headline}' 없음`);

/* 5. PWA: 매니페스트 아이콘과 서비스 워커 프리캐시 목록이 실제 파일을 가리키는지 */
const manifest = JSON.parse(readFileSync(resolve(root, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons) if (!existsSync(resolve(root, icon.src))) fail(`manifest 아이콘 없음: ${icon.src} — npm run build`);
const sw = readFileSync(resolve(root, 'sw.js'), 'utf8');
const shell = [...sw.matchAll(/^\s*'([^']+)',/gm)].map((m) => m[1]).filter((p) => p !== './');
for (const p of shell) if (!existsSync(resolve(root, p))) fail(`sw.js 프리캐시 대상 없음: ${p}`);
for (const must of ['index.html', 'app.js', 'data.js', 'scoring.js', 'style.css', ...TYPES.map((t) => `assets/${t.id}.webp`)]) {
  if (!shell.includes(must)) fail(`sw.js 프리캐시에 ${must} 가 빠짐`);
}
for (const must of ['icons/favicon.svg', 'manifest.webmanifest', 'icons/apple-touch-icon.png']) {
  if (!indexHtml.includes(must)) fail(`index.html 에 ${must} 링크가 없음`);
}

/* 보고 */
console.log('타입별 등장 횟수 (primary / secondary):');
for (const id of ids) console.log(`  ${id.padEnd(11)} ${count.primary[id]} / ${count.secondary[id]}`);
console.log(`\n전체 ${total.toLocaleString()} 조합에서 메인 타입 분포:`);
for (const id of ids) console.log(`  ${id.padEnd(11)} ${(shares[id] * 100).toFixed(1)}%`);

if (problems.length) {
  console.error(`\n✗ ${problems.length}개 문제:`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('\n✓ 구조, 균형, 분포, 생성물 동기화 모두 통과');
