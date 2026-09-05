// AX 타입 테스트의 단일 진실 원천(SSOT).
// 타입, 문항, 공유 문구는 이 파일에만 산다. r/ 와 og/ 는 여기서 생성된다 (scripts/build.mjs).
// 문항을 바꾸면 반드시 `npm run check` 로 균형을 다시 확인한다.

export const SITE = {
  name: 'AX 타입 테스트',
  tagline: 'AI 시대, 당신은 어떤 일꾼 동물입니까?',
  length: '10문항, 1분',
  description: '고양이·강아지·토끼·곰·부엉이. Boris Cherny가 말한 5가지 아키타입을 동물로. 10문항, 1분.',
  // 배포 주소. r/<type>/ 의 OG 태그가 절대 경로로 이 값을 쓴다. 다른 곳에 배포하면 여기만 바꾼다.
  url: 'https://axtype.vercel.app',
  hashtag: '#AX타입테스트',
  source: {
    label: 'Boris Cherny, X (2026-06)',
    url: 'https://x.com/bcherny/status/2071379474277613732',
  },
};

// 순서는 제품 수명주기 순: 아이디어 → 출시 → 정리 → 성장 → 운영.
// 다섯 타입은 각각 하나의 동물이다. nick 이 동물 이름이고, 모든 문구가 그 동물의 목소리로 쓰인다.
// code 는 4글자 대문자, 첫 글자는 타입마다 달라야 한다. 결과 코드는 `<메인 code>-<서브 code 첫 글자>` (예: PRTO-G).
// color 는 assets/<id>.webp 의 배경색과 같아야 카드와 캐릭터가 한 장처럼 보인다. 아트를 다시 만들면 여기도 맞춘다.
export const TYPES = [
  {
    id: 'prototyper',
    en: 'Prototyper',
    ko: '프로토타이퍼',
    code: 'PRTO',
    nick: '고양이',
    tags: ['호기심폭발', '일단건드려봄', '데모중독'],
    emoji: '🐱',
    color: '#D48C18',
    ink: '#1a1200',
    headline: '먼저 건드려 보는 고양이',
    tagline: '호기심이 앞발보다 빠릅니다. 궁금하면 일단 건드려 보는 쪽이죠.',
    traits: [
      '회의가 끝나기도 전에 앞발로 데모를 만들고 있다',
      '"이거 되나?"가 입버릇. 건드려 보기 전엔 못 참는다',
      '건드린 것 대부분이 출시되지 않아도 괜찮다. 하나가 판을 바꾸니까',
    ],
    weapon:
      'AI가 시도 비용을 크게 낮춘 지금, 건드려 본 횟수가 곧 실력입니다. 당신이 아이디어를 뽑는 속도가 무리 전체가 탐색하는 범위를 정합니다.',
    shadow: '건드린 것은 많고 끝낸 것은 적습니다. 열에 하나는 직접 출시까지 물고 가 보세요.',
    best: { id: 'builder', why: '당신이 굴려 놓은 공을 끝까지 물어오니까요' },
    clash: { id: 'maintainer', why: '당신이 열어둔 실험을 그 부엉이는 닫고 싶어 하거든요' },
    share: '회의가 끝나기도 전에 데모를 만들고 있는 고양이',
  },
  {
    id: 'builder',
    en: 'Builder',
    ko: '빌더',
    code: 'BLDR',
    nick: '강아지',
    tags: ['물어오면끝', '출시본능', '날짜로답함'],
    emoji: '🐶',
    color: '#467DEC',
    ink: '#ffffff',
    headline: '끝까지 물어오는 강아지',
    tagline: '한 번 문 공은 놓지 않습니다. 데모와 제품 사이의 거리를 당신이 가장 빨리 지웁니다.',
    traits: [
      '"언제 쓸 수 있어?"에 날짜로 답한다',
      '데모와 진짜 제품의 차이를 몸으로 안다. 예외, 실패, 출시',
      '말로 설명하느니 만들어서 물어다 놓는다',
    ],
    weapon:
      'AI가 보일러플레이트를 대신 쓰는 지금, 당신은 혼자서도 끝까지 물고 갑니다. 판단이 필요한 곳에만 시간을 쓰세요.',
    shadow: '물어오는 것 자체가 목표가 되면, 무엇을 물어오는지 잊기 쉽습니다.',
    best: { id: 'prototyper', why: '당신에게 끊임없이 다음 공을 굴려주니까요' },
    clash: { id: 'sweeper', why: '당신이 물어다 놓은 걸 그 토끼는 쓸어내고 싶어 하거든요' },
    share: '"언제 쓸 수 있어?"에 날짜로 답하는 강아지',
  },
  {
    id: 'sweeper',
    en: 'Sweeper',
    ko: '스위퍼',
    code: 'SWPR',
    nick: '토끼',
    tags: ['깔끔주의', '덜어내기장인', '단순할수록좋다'],
    emoji: '🐰',
    color: '#1A924F',
    ink: '#ffffff',
    headline: '군더더기를 쓸어내는 토끼',
    tagline: '지나간 자리가 깨끗합니다. 좋은 결과물은 더한 것보다 뺀 것이 많죠.',
    traits: [
      '버튼 세 개를 보면 하나로 줄일 방법부터 떠오른다',
      '안 쓰는 기능을 쓸어내는 게 새 기능을 붙이는 것보다 짜릿하다',
      '느린 화면을 보면 어디서 느려지는지부터 잰다',
    ],
    weapon:
      '누구나 뭐든 만들 수 있는 시대엔 제품이 순식간에 비대해집니다. 당신은 무리의 면역 체계입니다. 쓸어내는 쪽이 있어야 제품이 삽니다.',
    shadow: "쓸어내는 기준이 '내 취향'이 되지 않도록, 데이터와 사용자를 옆에 두세요.",
    best: { id: 'grower', why: '무엇을 남길지 데이터로 알려주니까요' },
    clash: { id: 'builder', why: '그 강아지가 물어오는 속도가 당신이 쓸어내는 속도보다 빠르거든요' },
    share: '더한 것보다 뺀 것이 많은 작업을 사랑하는 토끼',
  },
  {
    id: 'grower',
    en: 'Grower',
    ko: '그로워',
    code: 'GRWR',
    nick: '곰',
    tags: ['물주기담당', '지표덕후', '사용자편'],
    emoji: '🐻',
    color: '#EF5A7F',
    ink: '#ffffff',
    headline: '돌봐서 키우는 곰',
    tagline: '출시는 끝이 아니라, 당신이 물을 주기 시작하는 날입니다.',
    traits: [
      '배포 버튼보다 대시보드를 먼저 연다',
      '사용자가 어디서 멈추는지 보이면 앞발이 근질거린다',
      '세 줄 바꿔서 전환율 올린 이야기를 가장 좋아한다',
    ],
    weapon:
      "만드는 비용이 낮아질수록 '무엇을 만들지'가 전부가 됩니다. 사용자와 제품 사이의 간극을 읽는 당신의 눈이 무리의 방향입니다.",
    shadow: '지표가 오르는 것과 제품이 좋아지는 것은 가끔 다릅니다.',
    best: { id: 'sweeper', why: '당신이 찾은 간극을 가장 단순하게 쓸어서 메워주니까요' },
    clash: { id: 'prototyper', why: '그 고양이는 다음 걸 건드리고 싶고, 당신은 지금 것을 키우고 싶거든요' },
    share: '배포 버튼보다 대시보드를 먼저 여는 곰',
  },
  {
    id: 'maintainer',
    en: 'Maintainer',
    ko: '메인테이너',
    code: 'MNTR',
    nick: '부엉이',
    tags: ['밤눈밝음', '무사고', '알림보다빠름'],
    emoji: '🦉',
    color: '#735DEC',
    ink: '#ffffff',
    headline: '밤새 지켜보는 부엉이',
    tagline: '아무 일도 일어나지 않은 밤이, 당신이 가장 잘한 밤입니다.',
    traits: [
      '알림이 울리기 전에 이미 로그를 보고 있다',
      '"왜 느려?"와 "왜 터졌어?"의 답을 항상 가지고 있다',
      '트래픽이 열 배가 됐는데 아무도 눈치 못 챈 밤이 있다',
    ],
    weapon:
      'AI 에이전트가 운영 작업을 대신하는 지금, 당신은 시스템을 더 안전하고, 더 빠르고, 더 싸게 만드는 데 집중합니다. 신뢰는 자동화되지 않습니다.',
    shadow: '지키는 데 익숙해질수록 바꾸는 일이 무거워집니다. 가끔은 실험에 자리를 내주세요.',
    best: { id: 'builder', why: '당신이 지킬 가치가 있는 것을 물어다 주니까요' },
    clash: { id: 'prototyper', why: '그 고양이가 열어두는 실험을 당신은 닫고 싶어 하거든요' },
    share: '아무 일도 일어나지 않은 밤이 가장 잘한 밤인 부엉이',
  },
];

// 10문항 × 3지선다. 선택지 하나는 타입 하나를 가리키고 그 타입에 1점.
// 균형 규칙: 30개 선택지에서 모든 타입이 정확히 6번. 한 문항 안에 같은 타입이 두 번 나오지 않는다.
// (scripts/check.mjs 가 검증)
export const QUESTIONS = [
  {
    text: '갑자기 "이거 가능해?"라는 요청이 들어왔다. 가장 먼저 하는 일은?',
    options: [
      { text: '30분 안에 가장 작은 데모를 만들어 반응을 본다', type: 'prototyper' },
      { text: '사용자가 실제로 쓸 수 있는 범위와 완료 기준부터 정한다', type: 'builder' },
      { text: '비슷한 기능의 사용자 반응과 데이터를 찾아 어떤 가설부터 확인할지 정한다', type: 'grower' },
    ],
  },
  {
    text: '동료가 새 기능 데모를 보여줬다. 다음 단계로 가장 먼저 제안할 것은?',
    options: [
      { text: '같은 아이디어의 다른 버전 2~3개를 빠르게 만들어 비교한다', type: 'prototyper' },
      { text: '어느 사용자가 어떤 상황에서 쓰고, 성공을 무엇으로 판단할지 정한다', type: 'grower' },
      { text: '지금 기능에서 없어도 되는 단계나 버튼부터 찾는다', type: 'sweeper' },
    ],
  },
  {
    text: '출시를 3일 앞두고 아직 불확실한 부분이 많다. 어떻게 움직이나?',
    options: [
      { text: '핵심 기능만 남기고 정해진 날짜에 출시한다', type: 'builder' },
      { text: '장애가 날 수 있는 지점과 복구 방법부터 점검한다', type: 'maintainer' },
      { text: '소수의 사용자에게 먼저 공개해 반응을 확인한다', type: 'grower' },
    ],
  },
  {
    text: '사용률이 낮은 기능을 발견했다. 다음 행동은?',
    options: [
      { text: '핵심 흐름을 방해하는지 보고 제거 후보로 분류한다', type: 'sweeper' },
      { text: '제거했을 때 장애나 의존성 문제가 없는지 점검한다', type: 'maintainer' },
      { text: '어떤 사용자만 쓰는지 확인하고 개선 또는 유지 여부를 실험한다', type: 'grower' },
    ],
  },
  {
    text: 'AI를 활용하면서 가장 자주 달라진 행동은?',
    options: [
      { text: '아이디어를 짧은 시간 안에 여러 버전으로 시험한다', type: 'prototyper' },
      { text: '기능을 실제 사용 가능한 상태까지 직접 마무리한다', type: 'builder' },
      { text: '반복 작업과 운영 점검을 자동화해 시스템을 안정적으로 유지한다', type: 'maintainer' },
    ],
  },
  {
    text: '출시 후 예상보다 문제가 많다. 가장 먼저 확인할 것은?',
    options: [
      { text: '오류율, 지연 시간, 모니터링 상태를 확인한다', type: 'maintainer' },
      { text: '급하게 추가한 기능과 복잡한 흐름을 줄인다', type: 'sweeper' },
      { text: '어떤 사용자군에서 이탈하거나 반응이 달라졌는지 확인한다', type: 'grower' },
    ],
  },
  {
    text: '일정이 이틀 밀렸다. 무엇을 선택하나?',
    options: [
      { text: '범위를 줄이고 사용 가능한 핵심 버전을 먼저 출시한다', type: 'builder' },
      { text: '방향이 맞는지 확인하기 위한 짧은 실험용 버전을 만든다', type: 'prototyper' },
      { text: '가치가 낮은 기존 작업을 덜어내 일정과 집중력을 확보한다', type: 'sweeper' },
    ],
  },
  {
    text: '핵심 지표가 갑자기 떨어졌다. 가장 먼저 하는 일은?',
    options: [
      { text: '어느 사용자군과 단계에서 변화가 생겼는지 쪼개서 본다', type: 'grower' },
      { text: '오류, 속도, 배포 상태부터 확인한다', type: 'maintainer' },
      { text: '영향이 큰 문제를 우선 고쳐 빠르게 배포한다', type: 'builder' },
    ],
  },
  {
    text: '제품이 너무 복잡해졌다. 당신의 해결책은?',
    options: [
      { text: '기능과 단계를 덜어내고 핵심 흐름만 남긴다', type: 'sweeper' },
      { text: '더 단순한 구조를 작은 프로토타입으로 먼저 비교한다', type: 'prototyper' },
      { text: '기존 사용자를 깨뜨리지 않도록 경계를 나누고 구조를 안정화한다', type: 'maintainer' },
    ],
  },
  {
    text: '새 기능을 검토할 때 가장 중요하게 보는 것은?',
    options: [
      { text: '아직 아무도 시도하지 않은 가능성을 빠르게 확인하는 것', type: 'prototyper' },
      { text: '정한 날짜에 실제 사용 가능한 상태로 만드는 것', type: 'builder' },
      { text: '필요한 것만 남겨 누구나 쉽게 사용할 수 있게 만드는 것', type: 'sweeper' },
    ],
  },
];

export const SCORING = { point: 1 };

// MBTI 처럼 읽히는 결과 코드. 서브가 없으면 메인 코드만.
export const resultCode = (main, sub) => (sub ? `${main.code}-${sub.code[0]}` : main.code);

// Threads/X 공유 문구. url 은 결과 페이지의 절대 주소.
export function shareText(main, sub, url) {
  const lines = [
    `나의 AX 타입은 ${resultCode(main, sub)} ${main.emoji} ${main.nick} (${main.ko})`,
    `"${main.headline}"`,
    main.tags.map((x) => `#${x}`).join(' '),
  ];
  if (sub) lines.push(`서브 타입: ${sub.emoji} ${sub.nick}`);
  lines.push('', `${SITE.tagline} (${SITE.length})`, `${url} ${SITE.hashtag}`);
  return lines.join('\n');
}
