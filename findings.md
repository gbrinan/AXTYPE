# Findings & Decisions

> 조사 결과와 기술 결정을 알게 된 즉시 여기에 적는다. 기각한 대안도 지우지 않는다.

## Requirements

- [x] 다섯 타입(Prototyper, Builder, Sweeper, Grower, Maintainer) 중 하나를 알려주는 테스트
- [x] Threads 등 SNS 에 올리기 좋은 결과 (링크 미리보기, 미리 채워진 문구, 저장용 카드)
- [x] 바이럴 퀴즈 모범 사례 반영
- [x] File-based Planning Workflow (tasks / findings / progress) 로 작업 기록
- [x] paperthin 스킬 설치, 그 철학으로 설계

## Research Findings

### 다섯 아키타입 (1차 출처)

Boris Cherny (Head of Claude Code, Anthropic) 가 X 에 올린 글. 요지: 엔지니어링·프로덕트·디자인·DS 가 한 종류의 역할로 녹아드는 중이고, Claude Code 팀을 보면 다섯 아키타입이 보인다.

1. Prototyper — 완전히 새로운 아이디어를 낸다. 많이 만들고 대부분 출시되지 않는다
2. Builder — 프로토타입/아이디어를 빠르게 프로덕션급 제품·인프라로
3. Sweeper — UI 정리, 코드·시스템 단순화, 기능 내리기, 성능 최적화
4. Grower — 만들어진 제품을 반복 개선해 PMF 를 높인다
5. Maintainer — 성숙한 시스템을 맡아 규모가 커져도 안전·안정·빠름·효율 유지

덧붙임: 많은 사람이 2개, 때로 3개에 걸친다. 직군과 무관하다 (디자이너·엔지니어·PM·DS 모두 각 타입에 흩어져 있다).

- 원문: https://x.com/bcherny/status/2071379474277613732
- 2차 해설 (제품 성숙도에 따라 필요한 조합이 바뀐다는 관찰): https://www.thetoolnerd.com/p/the-claude-code-founder-and-openais-defining-tech-roles , https://aakashgupta.medium.com/anthropics-claude-code-team-has-5-roles-and-zero-job-titles-bf4860a389fc

### 바이럴 퀴즈 모범 사례

검색 결과 요약 (원문 페이지 다수는 이 환경에서 접근이 막혀 검색 스니펫 기준):

- 결과는 스크롤 없이 보여야 하고, CTA·이메일은 결과 **뒤에**. 사전 이메일 게이트는 공유를 죽인다
- **정체성 언어**가 공유된다: "당신은 여행이 무너지지 않게 붙드는 플래너" 처럼. 평가 언어는 공유되지 않는다
- 공유 버튼은 스크롤 없이, 공유 문구는 결과 이름으로 **미리 채워서**
- 세 가지 정체성 훅: 열망(그 결과이고 싶다) · 인정(나를 알아봤다) · 소속(같은 결과인 사람을 찾고 싶다). 강한 퀴즈는 둘 이상을 친다
- 긍정적이고 칭찬하는 문구, 눈에 띄는 공유용 이미지
- 문항 수: 7~12 가 권장 범위. 한 자료는 8문항 완주 68% vs 12문항 42% 를 인용. 6~8 이 완주를 최대화한다는 자료도 있음. 반면 심리측정 신뢰도엔 20~60 문항이 필요 → 이 테스트는 재미용임을 명시
- BuzzFeed 퀴즈 트래픽의 75% 이상이 소셜 공유에서 온다는 인용
- 국내 유형 테스트 사례: 3축 × 3문항 = 9문항 구조가 흔함. "케이크로 알아보는 성격 유형" 33만 플레이·11만 공유 사례

출처: https://woobox.com/articles/quiz-result-page-best-practices , https://woobox.com/articles/viral-quiz-mechanics , https://outgrow.co/blog/viral-quiz-copywriting-tactics-that-work , https://help.tryinteract.com/en/articles/10752954-how-many-questions-should-my-quiz-have-to-maximize-conversions , https://jobcannon.io/answers/how-many-questions-personality-test , https://www.i-boss.co.kr/ab-6141-57536 , https://brunch.co.kr/@theciriz/13

### Threads 공유

- 웹 인텐트: `https://www.threads.com/intent/post?text=<URL 인코딩 문자열>`. Threads 엔지니어가 직접 공지. `url` 파라미터도 언급되나 본문에 링크를 넣는 쪽이 확실
- 인텐트로 이미지는 못 붙인다. 이미지는 사용자가 저장해서 직접 올려야 함 → "카드 저장" 버튼
- 링크 미리보기는 OG 태그를 읽는다. 크롤러는 JS 를 실행하지 않으므로 타입별 정적 HTML 이 필요

출처: https://www.threads.com/@0xjessel/post/C2isZ9eP-yB , https://werd.io/seeking-share-urls-for-every-platform/

### paperthin 에서 가져온 것

28개 스킬과 CLAUDE.md·README 를 정독. 이 프로젝트에 적용한 원칙:

| 원칙 | 적용 |
|---|---|
| Trust the artifact, not the author | 배포 전 `shower` 콜드 리드. 문서가 세션 없이 읽히는지 |
| SSOT + self-contained | `data.js` 한 곳. 생성물은 `check` 로 동기화 강제 (paperthin 이 카탈로그 복사본을 CI 로 지키는 방식과 같음) |
| Restraint / anti-slop | 의존성 0, 프레임워크 0, 파일 최소. 고칠 게 없으면 안 바꾼다 |
| Generic examples, not instances | 문서에 실제 날짜·핸들·PR 번호 안 박음 |
| factchk / mandela | 근거 없는 통계 금지. 채점 검증이 자기확인이 되지 않게 전수 조합 분포 게이트 |
| negatives-as-corpus | 기각한 대안을 아래에 보존 |
| detool | 설계 문서는 메커니즘으로 쓰고, 배포 안내(runbook)만 도구 이름을 쓴다 |
| re0 | 문서는 패치가 아니라 깨끗한 v0 로 다시 쓴다 |

## Technical Decisions

| Decision | Rationale |
|---|---|
| ES 모듈 정적 파일 (`index.html` + `app.js` + `data.js` + `scoring.js`) | 빌드 없이 브라우저와 Node 가 같은 데이터·채점 코드를 import |
| `r/<type>/index.html` 정적 생성 | 타입별 OG 미리보기. 크롤러용 |
| `og/*.png` 를 Playwright 로 렌더해 커밋 | 서버리스 이미지 생성 없이 정적 호스팅만으로 미리보기 |
| 채점 +2/+1, 동점은 총점 → primary 횟수 → 마지막 primary 문항 → 수명주기 순 | 결정적이고 설명 가능. 마지막 문항이 열망 문항이라 동점에서 열망이 이김 |
| 결과 카드 1080×1350 캔버스 | Threads 피드에서 가장 큰 4:5 |
| 공유 URL 은 런타임 `location` 기준, OG 는 빌드 시 `SITE.url` 기준 | 어느 호스트에서도 동작하면서 크롤러엔 절대 경로 |

## 기각한 대안 (지우지 않음)

| 대안 | 기각 이유 |
|---|---|
| React/Next 등 프레임워크 | 파일 여섯 개짜리 앱에 빌드 체인은 슬롭. 5년 뒤에도 열리는 쪽을 택함 |
| 서버리스 OG 이미지 동적 생성 | 호스팅을 특정 플랫폼에 묶는다. 정적 PNG 5장이면 충분 |
| 5지선다 (타입당 하나) | 답이 뻔해진다. 사용자가 타입을 역산해 고르게 됨 |
| 20+ 문항으로 신뢰도 확보 | 완주율이 무너진다. 이건 심리검사가 아니라 공유용 콘텐츠 |
| "상위 N% 희소 타입" 문구 | 데이터가 없다. 지어내면 정직성 게이트 위반 |
| 이메일 수집 / 결과 저장 / 로그인 | 사전 게이트는 공유율을 죽인다. 지금 목표는 확산 |
| 분석 스크립트(GA 등) 기본 탑재 | 필요해지면 그때 한 줄. 지금은 의존성 0 |
| 5×5 = 25 조합 타입 (메인×서브를 하나의 타입으로) | OG 이미지 25장, 문구 25벌. 카드 5장 + 서브 표기로 같은 효과 |
| 한글 번역 타입명 (발명가·건축가·정리자…) | 원문과 연결이 끊긴다. 음차 + 영문 병기 |

## Issues Encountered

### 1. Playwright 모듈을 프로젝트에서 못 찾음

**문제**: `require('playwright')` 실패. 전역에만 설치돼 있음
**해결**: `npm root -g` 경로로 폴백 (`scripts/build.mjs` 의 `loadPlaywright`)
**결과**: 성공. 로컬 설치가 있으면 그쪽을 우선

### 2. OG 렌더 시 Google Fonts 가 안 실려도 됨

**문제**: 이 환경의 Chromium 이 웹폰트를 못 받음
**해결**: 시스템 CJK 폴백으로도 한글이 깨지지 않음을 확인. 사용자 환경에선 Noto Sans KR 이 실림
**결과**: 이미지 생성 성공

## Resources

- File-based Planning Workflow: https://github.com/ahastudio/til/blob/main/ai/file-based-planning-workflow.md
- paperthin: https://github.com/LilMGenius/paperthin
- Threads 웹 인텐트 공지: https://www.threads.com/@0xjessel/post/C2isZ9eP-yB

## Learnings

### 문항 균형 잡기

10문항 × 3지선다 = 30 슬롯. 5타입에 primary 6 / secondary 6 을 정확히 배분하려면 문항을 쓴 뒤 표로 세어봐야 한다. 처음 초안은 프로토타이퍼 primary 가 8이었고 두 문항의 선택지를 다른 타입으로 다시 썼다. `check.mjs` 가 이걸 자동으로 잡으니 문항을 바꿀 땐 반드시 돌린다.

### 결과 분포

전수 조합(59,049)에서 메인 타입 분포는 18.9% ~ 21.0%. 균형 배분만으로도 거의 고르다. 동점 규칙이 특정 타입에 유리하게 기울지 않았다는 뜻.

### 콜드 리드가 잡은 것 (세션 밖 리뷰어)

작성자는 못 보는 종류의 결함이 한 번의 콜드 리드에서 나왔다. 패턴별로:

- **문서가 데이터를 배신.** 설계 문서는 "절반의 문항이 AI 를 건드린다"고 썼는데 실제는 2/10. "만점 20"이라 썼는데 한 타입이 도달 가능한 최대는 14였고, 그 분모로 그린 막대는 1위도 70% 에서 멈췄다. → 총점 30 을 다섯 타입이 나누는 비율(합 100%)로 바꾸고 문서를 데이터에 맞춤. 교훈: 문서의 수치는 데이터에서 계산해 적거나, 검증 스크립트가 대조하게 한다.
- **스스로 세운 규칙 위반.** "정답 없음" 원칙을 세워놓고 "+2,000줄 PR" 같은 뻔히 열등해 보이는 선택지를 뒀다. "형용사 금지"라 해놓고 "진가가 드러난다"를 썼다. → 선택지·문구 재작성. 교훈: 분포 게이트는 채점 기울기만 잡고 사회적 바람직성 편향은 못 잡는다. 문구 규칙은 사람이 읽어야 한다.
- **의미가 뒤집힌 문장.** "당신은 가장 위험해집니다. 좋은 의미로요" — 해명이 붙는 문장은 실패한 문장. → 재작성.
- **UI 라벨과 동작 불일치.** "링크 복사"가 실제로는 문구 전체를 복사. "다섯 타입 분포"가 응답자 분포로 읽힘. → 라벨을 동작에 맞춤.
- **입력 경계.** `?r=constructor` 처럼 프로토타입 체인 이름이 타입으로 통과. → `Object.hasOwn` 으로 막음.

기각한 지적: 브라우저 히스토리 연동(뒤로가기·새로고침 시 결과 유지)은 상태를 URL 에 싣는 설계 변경이라 이번 범위 밖. 필요해지면 `?a=<답 인코딩>` 으로 결과를 재현하는 방식이 SSOT 를 지킨다.
