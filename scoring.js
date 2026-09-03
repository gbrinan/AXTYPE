// 채점. 브라우저(app.js)와 검증 스크립트(scripts/check.mjs)가 같은 함수를 쓴다.
import { TYPES, QUESTIONS, SCORING } from './data.js';

// answers: 문항별로 고른 선택지 인덱스 배열 (길이 = QUESTIONS.length)
// 반환: { main, sub, ranked } — ranked 는 총점 내림차순, 동점은 tie-break 규칙 적용.
export function score(answers) {
  const order = TYPES.map((t) => t.id);
  const acc = Object.fromEntries(order.map((id) => [id, { total: 0, primaries: 0, last: -1 }]));

  answers.forEach((choice, qi) => {
    const opt = QUESTIONS[qi].options[choice];
    acc[opt.primary].total += SCORING.primary;
    acc[opt.primary].primaries += 1;
    acc[opt.primary].last = qi;
    acc[opt.secondary].total += SCORING.secondary;
  });

  // 동점 규칙 (순서대로): 총점 → primary로 고른 횟수 → 더 나중 문항에서 primary로 고른 쪽 → 수명주기 순서
  const ranked = order
    .map((id) => ({ id, ...acc[id] }))
    .sort(
      (a, b) =>
        b.total - a.total ||
        b.primaries - a.primaries ||
        b.last - a.last ||
        order.indexOf(a.id) - order.indexOf(b.id),
    );

  const byId = Object.fromEntries(TYPES.map((t) => [t.id, t]));
  return { main: byId[ranked[0].id], sub: byId[ranked[1].id], ranked };
}

// 한 문항마다 primary+secondary 3점이 배분되므로 총점은 항상 30. 다섯 타입 비율의 합이 100% 가 된다.
export const TOTAL_POINTS = QUESTIONS.length * (SCORING.primary + SCORING.secondary);
