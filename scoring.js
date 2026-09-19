// 채점. 브라우저(app.js)와 검증 스크립트(scripts/check.mjs)가 같은 함수를 쓴다.
import { TYPES, QUESTIONS, SCORING } from './data.js';

const ORDER = TYPES.map((t) => t.id);
const N = ORDER.length;
// 문항·선택지 → 타입 인덱스. 채점 때마다 문자열을 찾지 않는다.
const OPTION_TYPE = QUESTIONS.map((q) => q.options.map((o) => ORDER.indexOf(o.type)));

// rankIndices 가 매번 다시 채우는 공용 버퍼. 채점은 동기·단일 호출이라 겹치지 않는다.
const _total = new Int32Array(N);
const _last = new Int32Array(N);
const _head = new Int32Array(N * N); // _head[i*N+j] = i 와 j 가 함께 나온 문항에서 i 를 고른 횟수
const _duel = new Int32Array(N);     // 같은 총점인 상대들과의 정면 대결 승패 합계
const _rank = new Int32Array(N);

// 동점 규칙 (순서대로):
//   1. 총점
//   2. 정면 대결 — 두 타입이 함께 선택지로 나온 문항에서 누구를 더 골랐나.
//      한 문항 안의 짝이 4~6번씩 맞붙도록 문항을 짰기 때문에(check.mjs 가 검증) 근거가 있다.
//      총점이 같은 상대에게만 적용하고, 이긴 상대 수 - 진 상대 수를 점수로 쓴다(Copeland).
//   3. 더 나중 문항에서 고른 쪽 (최근 선택)
//   4. 수명주기 순서 (data.js 배열 순)
// 2번은 비교 전에 타입마다 하나의 숫자로 정해지므로, 2·3·4를 차례로 보는 이 순서는 완전한 순서다.
const better = (a, b) =>
  _total[a] !== _total[b] ? _total[a] > _total[b]
  : _duel[a] !== _duel[b] ? _duel[a] > _duel[b]
  : _last[a] !== _last[b] ? _last[a] > _last[b]
  : a < b;

// answers: 문항별로 고른 선택지 인덱스 배열 (길이 = QUESTIONS.length)
// 타입 인덱스를 순위대로 담은 _rank 와 점수 버퍼를 돌려준다. 객체를 만들지 않아서
// 전수 검증(3^15 = 14,348,907 조합)에서도 몇 초 안에 끝난다.
// 반환값은 다음 호출 전까지만 유효하다 — 보관하려면 복사할 것.
export function rankIndices(answers) {
  for (let i = 0; i < N; i++) { _total[i] = 0; _last[i] = -1; _duel[i] = 0; _rank[i] = i; }
  _head.fill(0);

  // 문항 하나에 1점. 같은 문항을 다시 답해도 answers 가 덮어써지므로 중복으로 쌓이지 않는다.
  // 동시에, 그 문항에서 같이 놓였던 다른 타입들을 상대로 한 판씩 이긴 것으로 기록한다.
  for (let q = 0; q < answers.length; q++) {
    const opts = OPTION_TYPE[q];
    const chosen = opts[answers[q]];
    _total[chosen] += SCORING.point;
    _last[chosen] = q;
    for (let k = 0; k < opts.length; k++) if (opts[k] !== chosen) _head[chosen * N + opts[k]]++;
  }

  // 총점이 같은 상대하고만 정면 대결을 따진다.
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i === j || _total[i] !== _total[j]) continue;
      const d = _head[i * N + j] - _head[j * N + i];
      if (d > 0) _duel[i]++; else if (d < 0) _duel[i]--;
    }
  }

  // 다섯 개뿐이라 삽입 정렬. better 가 완전한 순서라 결과가 하나로 정해진다.
  for (let i = 1; i < N; i++) {
    const v = _rank[i];
    let j = i - 1;
    while (j >= 0 && better(v, _rank[j])) { _rank[j + 1] = _rank[j]; j--; }
    _rank[j + 1] = v;
  }
  return { rank: _rank, total: _total, last: _last, duel: _duel };
}

// 반환: { main, sub, ranked } — ranked 는 총점 내림차순(동점은 위 규칙).
export function score(answers) {
  const { rank, total, last } = rankIndices(answers);
  const ranked = Array.from(rank, (t) => ({ id: ORDER[t], total: total[t], last: last[t] }));
  return { main: TYPES[rank[0]], sub: TYPES[rank[1]], ranked };
}

// 문항마다 1점씩만 나가므로 총점은 항상 문항 수.
export const TOTAL_POINTS = QUESTIONS.length * SCORING.point;

// 막대에 쓰는 정수 퍼센트. 그냥 반올림하면 합이 98~102% 로 흔들리므로
// 최대 잔여법(largest remainder)으로 나눠 합이 항상 정확히 100 이 되게 한다.
export function percentages(ranked) {
  const raw = ranked.map((r) => (r.total / TOTAL_POINTS) * 100);
  const pct = raw.map(Math.floor);
  let rest = 100 - pct.reduce((a, b) => a + b, 0);
  // 잔여가 큰 순서로 1%씩. 잔여까지 같으면 ranked 순서(=순위)가 앞선 쪽이 가져간다.
  const byRemainder = raw.map((v, i) => i).sort((a, b) => (raw[b] - pct[b]) - (raw[a] - pct[a]) || a - b);
  for (let k = 0; rest > 0; k++, rest--) pct[byRemainder[k % pct.length]]++;
  return pct;
}
