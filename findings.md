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
- 문항 수: 자료마다 다르다. Outgrow 는 7문항 부근을 정점으로 보고 8문항을 넘기면 문항당 완주율이 약 15% 씩 떨어진다고 본다. Interact 는 성격 유형 퀴즈에 13문항을 권한다. 10 은 그 사이. 표준 성격검사는 대개 수십 문항 규모(HEXACO 60·100문항판 등)이고 문항이 늘수록 신뢰도가 오르는 건 고전검사이론의 기본 → 이 테스트는 재미용임을 명시
- BuzzFeed 퀴즈 트래픽의 75% 이상이 소셜 공유에서 온다는 인용 (2014년경 Mashable 수치의 2차 인용)
- 국내 유형 테스트 가이드는 12문항 안팎, MBTI 형은 4축 × 5문항 = 20문항을 예로 든다. "케이크로 알아보는 성격 유형" 33만 플레이·11만 공유 사례

출처: https://woobox.com/articles/quiz-result-page-best-practices , https://woobox.com/articles/viral-quiz-mechanics , https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates , https://help.tryinteract.com/en/articles/10752954-how-many-questions-should-my-quiz-have-to-maximize-conversions , https://www.socialmediatoday.com/social-business/how-use-buzzfeed-style-quizzes-social-media-marketing , https://guide.metavv.com/studio-guide/case/basic , https://brunch.co.kr/@theciriz/13

### Threads 공유

- 웹 인텐트: `https://www.threads.com/intent/post?text=<URL 인코딩 문자열>`. Meta 공식 문서에 `text` 와 `url`(링크 첨부 전용) 두 파라미터가 있고, 본문에 링크를 넣는 예시도 공식 문서에 있다. 이 프로젝트는 후자. 공식 문서 표기는 `threads.net` 이지만 도메인은 `threads.com` 으로 옮겨 정착했다
- 인텐트로 이미지는 못 붙인다. 이미지는 사용자가 저장해서 직접 올려야 함 → "이미지로 저장" 버튼. 이미지·동영상을 같이 올리면 링크 미리보기는 붙지 않는다
- 링크 미리보기는 OG 태그를 읽는다. 크롤러는 JS 를 실행하지 않으므로 타입별 정적 HTML 이 필요

출처: https://developers.facebook.com/docs/threads/threads-web-intents/ , https://www.threads.com/@0xjessel/post/C2isZ9eP-yB , https://opengraphplus.com/consumers/threads/crawling

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

### 캐릭터 아트 (이미지 생성)

이미지 생성 모델(Higgsfield 경유 `nano_banana_pro`, 2k, 1:1)로 타입별 피규어 다섯 장을 만들었다. 공통 프롬프트 뼈대:

> Glossy 3D chibi blind-box collectible vinyl figurine, big round head, tiny body, smooth PVC material with soft specular highlights, soft studio lighting, centered full body, designer art toy aesthetic trending on Douyin, high detail 3D render, no text, no watermark. Character: <타입 설명>. Background: flat solid <타입 색>, nothing else.

타입별 설명: 프로토타이퍼 = 전구 달린 노란 후드, 고글, 만들다 만 장치 셋을 저글링 / 빌더 = 흰 안전모, 로켓 제트팩, 체크 표시 태블릿 / 스위퍼 = 흰·민트 옷, 큰 빗자루, 회색 큐브가 반짝이로 쓸려 나감 / 그로워 = 물뿌리개, 잎이 상승 막대그래프인 화분, 하트 꽃 / 메인테이너 = 헤드셋, 유틸리티 조끼, 어깨에 렌치, 방패 배지.

- 결과 원본은 2048×2048 PNG. 저장소에는 640×640 WebP(각 12~19KB)만 둔다. 웹·OG·저장 카드 모두 이 크기로 충분하다
- `data.js` 의 타입 색은 생성된 이미지의 배경색을 모서리에서 샘플링한 값이다 (프롬프트의 색과 몇 단계 다르게 나온다). 카드와 이미지가 한 장으로 이어지려면 이미지 쪽에 맞춰야 한다
- 다섯 캐릭터가 한 줄로 선 라인업 이미지도 만들었지만 쓰지 않았다. 다섯 장을 CSS 로 나란히 놓으면 같은 효과이고, 한 캐릭터를 바꿔도 라인업을 다시 만들 필요가 없다 (SSOT)
- 이 환경에서는 생성 결과 CDN 이 프록시에 막혀 있어, 생성 서비스의 샌드박스에서 축소·인코딩한 텍스트를 받아 파일로 복원했다. 체크섬으로 다섯 장 모두 원본과 일치함을 확인했다

### 링크 미리보기·아이콘·PWA

- 링크 미리보기는 붙여넣는 곳마다 읽는 태그가 조금씩 다르다. Threads·카카오톡·슬랙은 og:*, X 는 twitter:* 를 우선한다. 둘 다 넣는다. `og:image:alt` 와 `og:locale` 은 있으면 좋고 없어도 된다
- 파비콘은 SVG 하나를 원본으로 두고 PNG(32, 192, 512, 애플 180, 마스커블 512)를 빌드에서 렌더한다. 마스커블 아이콘은 가운데 68% 안에 그림을 둔다
- PWA 는 매니페스트 + 서비스 워커. 서비스 워커는 앱 셸(HTML, JS, CSS, 캐릭터 5장, 아이콘)을 설치 시 미리 캐시하고, 같은 출처 GET 은 캐시 우선. 폰트 같은 다른 출처는 건드리지 않는다. HTTPS 에서만 등록되므로 로컬 확인은 배포 후
- 캐시 이름에 버전을 넣고 activate 에서 옛 캐시를 지운다. 정적 파일을 바꾸면 VERSION 을 올려야 옛 캐시를 쓰는 사람이 새 파일을 받는다 (`check` 가 목록만 대조하고 버전 올림은 사람이 한다)

## Technical Decisions

| Decision | Rationale |
|---|---|
| ES 모듈 정적 파일 (`index.html` + `app.js` + `data.js` + `scoring.js`) | 빌드 없이 브라우저와 Node 가 같은 데이터·채점 코드를 import |
| `r/<type>/index.html` 정적 생성 | 타입별 OG 미리보기. 크롤러용 |
| `og/*.png` 를 Playwright 로 렌더해 커밋 | 서버리스 이미지 생성 없이 정적 호스팅만으로 미리보기 |
| 채점 +2/+1, 동점 규칙은 `docs/DESIGN.md` 채점 절이 원본 | 결정적이고 설명 가능. 같은 답이면 항상 같은 결과 |
| 결과 카드 1080×1350 캔버스 | Threads 피드에서 가장 큰 4:5 |
| MBTI 문법: 4글자 코드 + 서브 접미 + 별명 + 태그 | 프로필에 적을 수 있는 코드가 "너는 뭐야?"를 만든다 (`docs/DESIGN.md` MBTI 절) |
| 타입별 3D 피규어 아트, 이모지는 보조 | 중국 숏폼의 아트토이 문법. 피드 점유·수집 욕구·굿즈 감각 (`docs/DESIGN.md` 비주얼 절) |
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
| 다섯 캐릭터 라인업 이미지 한 장 | 캐릭터 하나만 바꿔도 다시 만들어야 한다. 다섯 장을 CSS 로 놓는 쪽이 SSOT |
| MBTI 처럼 4축 × 2 = 16타입으로 재설계 | 원문은 다섯 패턴이지 네 축이 아니다. 축을 지어내면 출처와의 연결이 끊긴다. 코드·접미·별명·태그만 빌린다 |
| 타입별 유명인 예시 | 실제 인물의 타입을 단정할 근거가 없다 |
| 캐릭터를 투명 배경으로 잘라내기 | 배경색을 카드 색과 맞추면 잘라낼 필요가 없고, 광택 그림자가 그대로 살아 더 굿즈처럼 보인다 |

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

### `factchk` 가 잡은 것 (양방향 사실 확인)

아키타입 다섯 정의·부연·저자·게시 시점, Threads 인텐트 라우트, 크롤러가 JS 를 안 돌린다는 것, 4:5 카드, 케이크 테스트 수치는 모두 출처로 확인됐다. 틀린 것은 문항 수 근거 세 문장이었다. "8문항 68% vs 12문항 42%" 는 어떤 출처에서도 못 찾았고(스스로 세운 "근거 없는 통계 금지" 게이트 위반), "7~12 권장"과 "12 넘기면 완주 하락"은 인용한 자료가 실제로는 13문항을 권하거나 변곡점을 7~8 로 보고 있었으며, "국내 3축×3문항" 은 인용한 글이 12·20문항을 말하고 있었다. 세 문장 모두 출처가 실제로 말하는 내용으로 고쳤다. 교훈: 검색 스니펫으로 쓴 수치는 원문을 못 열었으면 수치 없이 방향만 적는다.

### 콜드 리드가 잡은 것 (세션 밖 리뷰어)

작성자는 못 보는 종류의 결함이 한 번의 콜드 리드에서 나왔다. 패턴별로:

- **문서가 데이터를 배신.** 설계 문서는 "절반의 문항이 AI 를 건드린다"고 썼는데 실제는 2/10. "만점 20"이라 썼는데 한 타입이 도달 가능한 최대는 14였고, 그 분모로 그린 막대는 1위도 70% 에서 멈췄다. → 총점 30 을 다섯 타입이 나누는 비율(합 100%)로 바꾸고 문서를 데이터에 맞춤. 교훈: 문서의 수치는 데이터에서 계산해 적거나, 검증 스크립트가 대조하게 한다.
- **스스로 세운 규칙 위반.** "정답 없음" 원칙을 세워놓고 "+2,000줄 PR" 같은 뻔히 열등해 보이는 선택지를 뒀다. "형용사 금지"라 해놓고 "진가가 드러난다"를 썼다. → 선택지·문구 재작성. 교훈: 분포 게이트는 채점 기울기만 잡고 사회적 바람직성 편향은 못 잡는다. 문구 규칙은 사람이 읽어야 한다.
- **의미가 뒤집힌 문장.** "당신은 가장 위험해집니다. 좋은 의미로요" — 해명이 붙는 문장은 실패한 문장. → 재작성.
- **UI 라벨과 동작 불일치.** "링크 복사"가 실제로는 문구 전체를 복사. "다섯 타입 분포"가 응답자 분포로 읽힘. → 라벨을 동작에 맞춤.
- **입력 경계.** `?r=constructor` 처럼 프로토타입 체인 이름이 타입으로 통과. → `Object.hasOwn` 으로 막음.

기각한 지적: 브라우저 히스토리 연동(뒤로가기·새로고침 시 결과 유지)은 상태를 URL 에 싣는 설계 변경이라 이번 범위 밖. 필요해지면 `?a=<답 인코딩>` 으로 결과를 재현하는 방식이 SSOT 를 지킨다.

### `hate` 가 잡은 것 (계획을 죽일 한 가지 반론)

**root.** 설계 전체가 "정체성 한 줄이 떨어지면 사람들은 올린다"를 검증된 사실처럼 깔고, 그 아래 전부(OG, 인텐트, 카드, 배분 게이트)를 *올리기까지의 마찰 제거* 에만 쓴다. 완주 → 실제 게시 전환율은 가정이다. 그런데 문항과 결과 문구가 개발자 인그룹 어휘(PR, 코드베이스, 프로파일러, 에러율)로 차 있어, 팔로워가 섞인 한국 Threads 일반 피드에서는 인그룹 밖 독자에게 뜻이 안 통하고 게시의 사회적 보상이 음수가 되기 쉽다. "직군 무관"을 뼈대로 써놓고 구현이 그 반대였다. 게다가 분석을 뺐으므로 이 가정이 깨져도 관측되지 않는다.

**first nail.** 코드를 더 쓰지 말고 하루 안에: 일·AI 이야기를 하는 한국 Threads 활성 계정 25명 안팎(개발 12, 비개발 지식노동자 13)에게 10문항과 결과 공유 문구를 그대로 보내고, (1) "내 경험으로 답을 못 고르는 문항"에 표시하게 하고, (2) 의향을 묻지 말고 **지금 본인 계정에 올려달라고 한 뒤 24시간 후 실제 게시 수를 센다**. 킬 기준: 실제 게시 5명 미만(≈20% 미만)이면 루프의 K 는 1 을 못 넘고 마찰 제거 공수는 매몰. 비개발 13명 중 과반이 2문항 이상 "못 고름"이면 "직군 중립"은 거짓이고 도달 모수는 한국 개발자 클러스터로 한 자릿수 줄어든다.

**바로 고친 것.** 규칙 위반에 해당하는 부분은 문항·문구의 개발자 어휘를 누구나 고를 수 있는 장면으로 바꿨다 (PR → 작업, 코드베이스 → 제품, 프로파일러 → 어디서 느려지는지 잰다, 에러율 → 장애). primary/secondary 배분은 그대로라 균형 게이트는 유지된다. **결정은 사람 몫.** 첫 번째 못(25명 실측)은 코드 밖의 일이라 `tasks.md` 에 다음 단계로 올렸다. 게시율을 셀 방법이 없다는 지적은 맞다. 해시태그 수동 검색이 전부이고, 프리필 문구는 편집 가능해 링크가 떨어지면 계수에서 빠진다. 분석을 넣을지는 실측 뒤에 정한다.

## 배포: Vercel

- 프로젝트 `axtype` 을 GitHub 저장소에 연결. 프로덕션 브랜치 `main`, 주소 `https://axtype.vercel.app`. `SITE.url` 과 `index.html` 의 절대 경로를 이 주소로 바꾸고 `npm run build` 로 `r/` 를 재생성했다.
- `vercel.json` 에서 `installCommand`·`buildCommand` 를 빈 문자열로 두어 설치·빌드를 건너뛰고 루트를 그대로 서빙한다. `package.json` 의 `build` 는 Playwright 가 필요해 Vercel 빌드 환경에서 실패하므로, 생성물을 커밋해 두는 기존 방식이 그대로 배포 방식이 된다.
- `sw.js` 는 `Cache-Control: no-cache` 로 내려 새 버전이 바로 잡히게 했다.
- 기각: GitHub Pages 배포 워크플로(`configure-pages` → `deploy-pages`). 사이트가 두 주소에 살면 OG 절대 경로가 한쪽만 가리켜 미리보기가 어긋난다. 한 주소만 둔다.
