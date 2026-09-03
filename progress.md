# Progress Log

> 단계를 끝내거나 문제가 생기면 갱신한다. 최근 세션이 맨 아래.

## Session 1

### Phase 1: Requirements & Discovery ✅

**작업 내역**:

1. 다섯 아키타입 1차 출처(Boris Cherny, X) 확보, 2차 해설 확인
2. 바이럴 퀴즈 모범 사례·문항 수·Threads 인텐트 조사 (`findings.md`)
3. paperthin 클론 후 28개 스킬 + CLAUDE.md + README + invocation.md 정독
4. paperthin 을 `.claude/skills/` 에 설치 (`npx skills add LilMGenius/paperthin --agent claude-code`)

### Phase 2: Planning & Structure ✅

**작업 내역**:

1. 설계 문서 작성: 바이럴 루프, 문항 원칙, 채점, 정직성 게이트
2. 파일 구조 확정 (SSOT `data.js`, 생성물 `r/`·`og/`)

**생성/수정 파일**:

- `docs/DESIGN.md`, `tasks.md`, `findings.md`, `progress.md`, `CLAUDE.md`, `README.md`

### Phase 3: Implementation ✅

**작업 내역**:

1. 타입 5개 결과 문구, 문항 10개 작성. 초안 균형 불일치(프로토타이퍼 primary 8회) → 두 문항 선택지 재작성으로 6/6 맞춤
2. 화면 3종 + 공유받은 화면(`?r=`) 구현
3. Threads/X 인텐트, 링크 복사, 캔버스 결과 카드
4. `scripts/build.mjs`(OG 페이지·이미지 생성), `scripts/check.mjs`(구조·균형·분포·동기화)

**생성/수정 파일**:

- `index.html`, `app.js`, `style.css`, `data.js`, `scoring.js`, `scripts/build.mjs`, `scripts/check.mjs`, `package.json`, `.gitignore`
- 생성물: `r/{prototyper,builder,sweeper,grower,maintainer}/index.html`, `og/{5타입,default}.png`

### Phase 4: Testing & Verification ✅

아래 Test Results 참고.

### Phase 5: Delivery 🔄

첫 커밋과 `main` 푸시. GitHub Pages 활성화와 실제 Threads 미리보기 확인은 사람 몫.

## Session 2

### 점검 (paperthin `sip` + `hate`) ✅

**작업 내역**:

1. `factchk`: 문서의 사실 주장 30여 건을 출처와 양방향 대조. 문항 수 근거 세 문장이 출처와 어긋나 고침 (`findings.md` factchk 절)
2. `ssotize` 감사: "10문항, 1분" 세 가지 표기 → `SITE.length` 한 곳. `findings.md` 의 낡은 동점 근거 → DESIGN 을 가리키게. `check.mjs` 가 `index.html` 설명·README 타입 표까지 대조
3. `detool` 감사: 도구 명사는 README 실행 안내와 tasks 오류표에만 있음 (runbook·provenance). 변경 없음
4. `hate`: 계획을 죽일 반론 = "완주자가 실제로 올린다"는 미검증 가정 + 문항의 개발자 인그룹 어휘. 어휘는 직군 중립으로 고치고, 25명 실측을 다음 단계로 올림 (`findings.md` hate 절, `tasks.md`)
5. 랜딩과 README 에 AX 풀어쓰기
6. Claude Design 핸드오프: `design/` 에 화면 4종 + OG·저장 카드 아트보드, 캔버스로 발행

**생성/수정 파일**:

- `data.js`, `app.js`, `scripts/build.mjs`, `scripts/check.mjs`, `docs/DESIGN.md`, `findings.md`, `tasks.md`, `README.md`, `CLAUDE.md`, `.gitignore`
- `design/{Main,Landing,Question,Shared,OGCard,ShareCard}.dc.html`, `design/canvas.json`

## Test Results

| Test | Input | Expected | Actual | Status |
|---|---|---|---|---|
| 구조 검증 | `npm run check` | 5타입·10문항·3지선다, primary≠secondary | 통과 | ✅ |
| 균형 | `npm run check` | 모든 타입 primary 6 / secondary 6 | 6/6 ×5 | ✅ |
| 분포 | 59,049 조합 전수 | 어떤 타입도 12% 미만 아님 | 18.9%~21.0% | ✅ |
| 생성물 동기화 | `npm run check` | `r/`·`og/`·`index.html` og:image 가 `data.js` 와 일치 | 통과 | ✅ |
| 브라우저 플로우 | 1번 선택지만 10회 | 프로토타이퍼 결과, Threads 링크에 문구·URL 포함 | 프로토타이퍼, 문구 정상 | ✅ |
| 되돌아가기 | Q2 에서 이전 | Q1 로 복귀 | 1 / 10 | ✅ |
| 혼합 답변 | 1,2,0,2,1,0,1,2,0,1 | 메인·서브·막대 표시 | 표시됨 | ✅ |
| 공유받은 화면 | `?r=sweeper` | 스위퍼 카드 + "나도 테스트하기" | 표시됨 | ✅ |
| OG 페이지 리다이렉트 | `/r/grower/` | `/?r=grower` 로 이동 | 이동됨 | ✅ |
| 카드 저장 | 결과에서 저장 | `axtype-<type>.png` 다운로드 | 다운로드됨 | ✅ |
| 콘솔 오류 | 전체 플로우 | 없음 | 없음 (폰트 CDN 차단은 이 환경 문제) | ✅ |
| 콜드 리드 | 세션 밖 리뷰어가 README·DESIGN·CLAUDE·data·app 정독 | 막히는 곳 없음 | minor gaps → 반영 (`findings.md` Learnings) | ✅ |
| 사실 확인 | `factchk` 양방향 | 모든 주장에 출처 | 문항 수 근거 3건 수정, 나머지 확인됨 | ✅ |
| 문항 어휘 중립화 후 | `npm run check` + 브라우저 재구동 | 균형 6/6, 분포 유지, 플로우 정상 | 통과 | ✅ |

## Error Log

| Error | Attempt | Resolution |
|---|---|---|
| Playwright 로컬 require 실패 | 1 | 전역 경로 폴백 |
| `data.js` 모듈 타입 경고 | 1 | `"type": "module"` |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| 1. 현재 어느 단계인가? | Phase 5: Delivery — 점검 반영분 푸시됨, 배포와 실측은 사람 몫 |
| 2. 다음에 할 일은? | 25명 실측(첫 번째 못) → GitHub Pages 켜기 → Threads 미리보기 확인 → 디자인 캔버스에서 다듬은 것을 `style.css`·`data.js` 로 반영 |
| 3. 목표는? | Threads 에서 퍼지는 1분짜리 AX 타입 테스트 |
| 4. 지금까지 배운 것? | `findings.md` Learnings |
| 5. 완료한 작업은? | 위 Phase 1~4 |
