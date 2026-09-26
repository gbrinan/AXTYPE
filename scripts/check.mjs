// 문항·타입 데이터의 구조, 균형, 결과 분포, 생성물 동기화를 검증한다.
// 실행: npm run check   (실패 시 종료 코드 1)
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPES, QUESTIONS, SITE } from '../data.js';
import { score, rankIndices, percentages } from '../scoring.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ids = TYPES.map((t) => t.id);
const problems = [];
const fail = (msg) => problems.push(msg);

/* 1. 구조 */
if (TYPES.length !== 5) fail(`타입은 5개여야 합니다 (현재 ${TYPES.length})`);
if (QUESTIONS.length !== 15) fail(`문항은 15개여야 합니다 (현재 ${QUESTIONS.length})`);
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
  const seen = new Set();
  q.options.forEach((o, oi) => {
    if (!o.text) fail(`Q${qi + 1}-${oi + 1}: text 누락`);
    if (!ids.includes(o.type)) fail(`Q${qi + 1}-${oi + 1}: type '${o.type}' 없음`);
    if (seen.has(o.type)) fail(`Q${qi + 1}: type '${o.type}' 가 한 문항에 두 번 — 선택지끼리 구분이 안 된다`);
    seen.add(o.type);
    // 화면에 타입 이름·코드가 새어 나가면 답을 역산하게 된다.
    for (const t of TYPES) {
      for (const word of [t.ko, t.en, t.code, t.nick]) {
        if (o.text.includes(word)) fail(`Q${qi + 1}-${oi + 1}: 선택지에 타입 이름 '${word}' 가 보인다`);
      }
    }
  });
});

if (new Set(TYPES.map((t) => (t.code || '')[0])).size !== TYPES.length) fail('code 첫 글자가 타입마다 달라야 서브 코드(PRTO-G)가 구분된다');

/* 2. 균형: 45개 선택지에서 모든 타입이 같은 횟수(9번) 등장 */
const count = Object.fromEntries(ids.map((id) => [id, 0]));
for (const q of QUESTIONS) for (const o of q.options) count[o.type]++;
const per = (QUESTIONS.length * 3) / ids.length;
if (!Number.isInteger(per)) fail(`선택지 ${QUESTIONS.length * 3}개를 타입 ${ids.length}개로 나눌 수 없다 — 문항 수를 조정할 것`);
for (const id of ids) if (count[id] !== per) fail(`'${id}' 등장 횟수가 ${count[id]} — 타입마다 ${per}번이어야 한다: ${JSON.stringify(count)}`);

/* 2-1. 짝 균형: 두 타입이 한 문항에서 맞붙는 횟수.
   동점을 '정면 대결'로 풀기 때문에(scoring.js), 모든 짝이 고르게 맞붙어야 그 규칙에 근거가 생긴다.
   특정 짝만 몰리면 그 둘의 구분만 세밀해지고 나머지는 최근 선택으로 떨어진다. */
const pairKey = (a, b) => (a < b ? `${a}·${b}` : `${b}·${a}`);
const duels = {};
for (const a of ids) for (const b of ids) if (a < b) duels[pairKey(a, b)] = 0;
for (const q of QUESTIONS) {
  const ts = q.options.map((o) => o.type);
  for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) duels[pairKey(ts[i], ts[j])]++;
}
const DUEL_MIN = 3; // 이 밑으로 내려가면 그 두 타입 사이의 동점을 풀 근거가 사실상 없다
const duelSpread = 2; // 가장 많이 맞붙는 짝과 가장 적은 짝의 차이 한도
const duelValues = Object.values(duels);
for (const [k, v] of Object.entries(duels)) if (v < DUEL_MIN) fail(`'${k}' 가 ${v}번만 맞붙는다 — 최소 ${DUEL_MIN}번`);
if (Math.max(...duelValues) - Math.min(...duelValues) > duelSpread) {
  fail(`짝별 맞붙는 횟수가 ${Math.min(...duelValues)}~${Math.max(...duelValues)} 로 벌어졌다 (허용 차이 ${duelSpread}): ${JSON.stringify(duels)}`);
}

/* 3. 결과 분포와 판별력: 모든 답 조합(3^15 = 14,348,907)을 전수로 돌린다.
   - 어떤 타입도 12% 아래로 내려가지 않는다
   - 총점 1위 동점이 정면 대결로도 풀리지 않는 비율에 상한을 둔다 (그 아래는 최근 선택이 정한다) */
const total = 3 ** QUESTIONS.length;
const winIdx = new Int32Array(ids.length);
const mainScoreHist = new Int32Array(QUESTIONS.length + 1);
let tieTotal = 0;
let tieUnresolved = 0;
const answers = new Array(QUESTIONS.length).fill(0);
for (let n = 0; n < total; n++) {
  let m = n;
  for (let i = 0; i < answers.length; i++) { answers[i] = m % 3; m = Math.floor(m / 3); }
  const { rank, total: tot, duel } = rankIndices(answers);
  const top = rank[0];
  const second = rank[1];
  winIdx[top]++;
  mainScoreHist[tot[top]]++;
  if (tot[top] === tot[second]) {
    tieTotal++;
    if (duel[top] === duel[second]) tieUnresolved++;
  }
}
const MIN_SHARE = 0.12; // 어떤 타입도 전체 조합의 12% 아래로 내려가면 실패
const MAX_UNRESOLVED_TIE = 0.15; // 1위가 총점·정면 대결 모두 같아 최근 선택으로 갈리는 비율
const shares = Object.fromEntries(ids.map((id, i) => [id, winIdx[i] / total]));
for (const id of ids) if (shares[id] < MIN_SHARE) fail(`'${id}' 가 나올 확률이 너무 낮음: ${(shares[id] * 100).toFixed(1)}%`);
const unresolved = tieUnresolved / total;
if (unresolved > MAX_UNRESOLVED_TIE) {
  fail(`1위 동점이 정면 대결로도 안 풀리는 비율 ${(unresolved * 100).toFixed(1)}% — 상한 ${(MAX_UNRESOLVED_TIE * 100).toFixed(0)}%`);
}

/* 3-1. 막대 퍼센트는 항상 정확히 100% 여야 한다 (최대 잔여법) */
for (let trial = 0; trial < 2000; trial++) {
  const a = Array.from({ length: QUESTIONS.length }, () => Math.floor(Math.random() * 3));
  const pct = percentages(score(a).ranked);
  const sum = pct.reduce((x, y) => x + y, 0);
  if (sum !== 100) { fail(`막대 퍼센트 합이 ${sum}% (답: ${a.join('')})`); break; }
}

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
console.log(`타입별 선택지 등장 횟수 (전체 ${QUESTIONS.length * 3}개):`);
for (const id of ids) console.log(`  ${id.padEnd(11)} ${count[id]}회`);
console.log('\n짝별로 한 문항에서 맞붙는 횟수:');
for (const [k, v] of Object.entries(duels)) console.log(`  ${k.padEnd(24)} ${v}번`);
console.log(`\n전체 ${total.toLocaleString()} 조합에서 메인 타입 분포:`);
for (const id of ids) console.log(`  ${id.padEnd(11)} ${(shares[id] * 100).toFixed(1)}%`);
console.log('\n판별력:');
console.log(`  총점 1위 동점                 ${(tieTotal / total * 100).toFixed(1)}%`);
console.log(`  그중 정면 대결로도 안 풀림    ${(unresolved * 100).toFixed(1)}% (상한 ${(MAX_UNRESOLVED_TIE * 100).toFixed(0)}%)`);
console.log(`  메인 타입 점수 (/${QUESTIONS.length}):`);
mainScoreHist.forEach((c, sc) => { if (c) console.log(`    ${String(sc).padStart(2)}점  ${(c / total * 100).toFixed(1)}%`); });

if (problems.length) {
  console.error(`\n✗ ${problems.length}개 문제:`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('\n✓ 구조, 균형, 분포, 생성물 동기화 모두 통과');
