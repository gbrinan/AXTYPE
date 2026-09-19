// 채점. 브라우저(app.js)와 검증 스크립트(scripts/check.mjs)가 같은 함수를 쓴다.
import { TYPES, QUESTIONS, SCORING } from './data.js';

// answers: 문항별로 고른 선택지 인덱스 배열 (길이 = QUESTIONS.length)
// 반환: { main, sub, ranked } — ranked 는 총점 내림차순, 동점은 아래 규칙으로 푼다.
export function score(answers) {
  const order = TYPES.map((t) => t.id);
  const acc = Object.fromEntries(order.map((id) => [id, { total: 0, last: -1 }]));

  // 문항 하나에 1점. 같은 문항을 다시 답해도 answers 가 덮어써지므로 중복으로 쌓이지 않는다.
  answers.forEach((choice, qi) => {
    const { type } = QUESTIONS[qi].options[choice];
    acc[type].total += SCORING.point;
    acc[type].last = qi;
  });

  // 동점 규칙 (순서대로): 총점 → 더 나중 문항에서 고른 쪽(최근 선택) → 수명주기 순서(data.js 배열 순)
  const ranked = order
    .map((id) => ({ id, ...acc[id] }))
    .sort((a, b) => b.total - a.total || b.last - a.last || order.indexOf(a.id) - order.indexOf(b.id));

  const byId = Object.fromEntries(TYPES.map((t) => [t.id, t]));
  return { main: byId[ranked[0].id], sub: byId[ranked[1].id], ranked };
}

// 문항마다 1점씩만 나가므로 총점은 항상 문항 수(10). 다섯 타입 비율의 합이 정확히 100% 가 된다.
export const TOTAL_POINTS = QUESTIONS.length * SCORING.point;
