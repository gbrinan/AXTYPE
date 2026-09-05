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

첫 커밋과 `main` 푸시. 배포는 Session 6 에서 Vercel 로. 실제 Threads 미리보기 확인은 사람 몫.

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

## Session 3

### Phase 6: 비주얼 ✅

**작업 내역**:

1. 이미지 생성 모델로 타입별 블라인드 박스 피규어 5장 (프롬프트는 `findings.md`)
2. 생성 CDN 이 프록시에 막혀 샌드박스에서 640px WebP 로 축소·base64 로 받아 복원, 체크섬 5장 일치
3. 랜딩(피규어 라인업), 결과·공유받은 카드(캐릭터 300px), 저장 카드(560px), OG(520px, 기본 OG 는 5장 나열)에 적용
4. 타입 색을 이미지 배경 샘플값으로 교체, 빌드·검증·브라우저 재구동 통과
5. 디자인 캔버스 아트보드에 이미지 반영

**생성/수정 파일**:

- `assets/{prototyper,builder,sweeper,grower,maintainer}.webp`
- `data.js`(색), `app.js`, `style.css`, `scripts/build.mjs`, `scripts/check.mjs`, `og/*.png`
- `design/*.dc.html`, `design/canvas.json`, 문서 5종

## Session 4

### Phase 7: MBTI 문법, 링크 미리보기, 아이콘, PWA ✅

**작업 내역**:

1. `data.js` 에 code/nick/tags, `resultCode` 규칙. 카드 첫 줄·공유 문구·저장 이미지·OG·랜딩 캡션에 코드
2. `index.html` 에 og:·twitter:·canonical·theme-color·아이콘·매니페스트 링크. `r/<type>/` 에도 같은 세트와 타입별 theme-color
3. `icons/favicon.svg` 원본, 빌드가 PNG 5종 렌더. `manifest.webmanifest`, `sw.js`(앱 셸 프리캐시, 캐시 우선)
4. `check` 가 code 형식·첫 글자 유일성·매니페스트 아이콘·SW 프리캐시 목록을 대조
5. OG 카드 레이아웃을 코드 배지에 맞춰 조정

**생성/수정 파일**:

- `data.js`, `app.js`, `style.css`, `index.html`, `manifest.webmanifest`, `sw.js`, `icons/*`, `scripts/build.mjs`, `scripts/check.mjs`, `r/*`, `og/*`
- `design/*`, 문서 5종

## Session 5

### Phase 8: CI 와 배포 자동화 🔄

**작업 내역**:

1. 세션 밖 스크래치에 있던 브라우저 구동 스크립트를 `scripts/smoke.mjs` 로 저장소에 넣고 단언으로 바꿈 (되돌아가기, 결과 코드 형식, 공유 문구, 막대 합 100, 카드 저장, 공유받은 화면, `?r=constructor`, OG 리다이렉트, 서브 타입, PWA 파일 응답)
2. `.github/workflows/ci.yml`: PR 과 main 에서 check + smoke
3. 브랜치에서 PR 로 올려 CI 확인

## Session 6

### 배포: Vercel ✅

**작업 내역**:

1. Vercel 프로젝트 `axtype` 을 저장소에 연결 (프로덕션 브랜치 `main`)
2. `vercel.json` 으로 설치·빌드를 건너뛰고 루트를 그대로 서빙. `SITE.url` 과 `index.html` 절대 경로를 배포 주소로 바꾸고 `r/` 재생성
3. 배포된 주소에서 랜딩·`r/grower/`·매니페스트 응답 확인 (OG 절대 경로가 배포 주소를 가리킴)
4. CI 의 GitHub Pages 배포 잡 제거, 문서의 배포 안내를 Vercel 로

**생성/수정 파일**:

- `vercel.json`, `data.js`, `index.html`, `r/*`, `.github/workflows/ci.yml`, `design/ShareCard.dc.html`, 문서 4종

## Session 7

### Phase 9: 동물 피규어 ✅

**작업 내역**:

1. 같은 블라인드 박스 프롬프트 뼈대로 타입별 동물 5장 생성 (동물·소품 표는 `findings.md`). 첫 부엉이는 배경이 그라데이션이라 단색 지시를 붙여 재생성
2. 샌드박스에서 640px WebP 로 축소·base64 로 받아 복원, 체크섬 5장 일치
3. `data.js` 타입 색을 새 이미지 모서리 평균값으로, `sw.js` VERSION v2, `npm run build` 로 OG 재생성
4. check·smoke 통과. DESIGN·README·findings 의 비주얼 설명을 동물로, 사람 피규어는 기각 표에

**생성/수정 파일**:

- `assets/*.webp`, `data.js`, `sw.js`, `og/*.png`, `r/*`, `docs/DESIGN.md`, `README.md`, `findings.md`, `tasks.md`, `progress.md`

## Session 8

### Phase 10: 문구를 동물 목소리로 ✅

**작업 내역**:

1. `data.js`: `nick` 을 동물 이름(고양이·강아지·토끼·곰·부엉이)으로, 이모지를 동물로, 다섯 타입의 모든 문구를 그 동물의 동사로 다시 씀. 팀 → "무리"
2. `app.js`: 라인업 캡션에 동물 이름, 막대·케미·서브 타입 표기를 동물로, 섹션 제목 "내 안의 다섯 동물"·"무리가 알아보는 순간"
3. `index.html` 메타 3종과 `SITE.description`·`SITE.tagline` 을 동물 문구로. README 타입 표 갱신
4. 기본 OG 카드에서 다섯 캐릭터가 아래로 잘리던 문제 수정 (`.l` 의 `flex:1` 이 세로 배치에서 텍스트 블록을 늘리고 있었음)
5. `sw.js` VERSION v3, 빌드·check·smoke 통과

**생성/수정 파일**:

- `data.js`, `app.js`, `index.html`, `style.css`, `sw.js`, `scripts/build.mjs`, `og/*`, `r/*`, `README.md`, `docs/DESIGN.md`, `findings.md`, `tasks.md`, `progress.md`

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
| MBTI 코드·PWA 적용 후 | 빌드·check·브라우저 재구동 | 공유 문구가 `PRTO-G` 로 시작, r/ 페이지 og·twitter 14줄, 아이콘 6종 | 통과 | ✅ |
| 캐릭터 아트 적용 후 | 빌드·check·브라우저 재구동, 스크린샷 육안 | 카드·OG·저장 이미지에 캐릭터, 배경색 이어짐 | 통과 | ✅ |
| 동물 피규어 교체 후 | 빌드·check·smoke, OG 육안 | 5장 체크섬 일치, 배경 단색, 카드와 색 이어짐 | 통과 | ✅ |
| 동물 문구 적용 후 | 빌드·check·smoke, OG 육안 | headline 16자 이내, nick 4자 이내, 기본 OG 에 캐릭터 5장 안 잘림 | 통과 | ✅ |

## Error Log

| Error | Attempt | Resolution |
|---|---|---|
| Playwright 로컬 require 실패 | 1 | 전역 경로 폴백 |
| `data.js` 모듈 타입 경고 | 1 | `"type": "module"` |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| 1. 현재 어느 단계인가? | Phase 5: Delivery — Vercel 에 배포됨, CI PR 과 동물 아트 PR 열림, 실측은 사람 몫 |
| 2. 다음에 할 일은? | 25명 실측(첫 번째 못) → Threads·카카오톡에 `https://axtype.vercel.app` 붙여 미리보기 확인, 홈 화면 설치 확인 → PR 합치기 → 디자인 캔버스에서 다듬은 것을 코드로 반영 |
| 3. 목표는? | Threads 에서 퍼지는 1분짜리 AX 타입 테스트 |
| 4. 지금까지 배운 것? | `findings.md` Learnings |
| 5. 완료한 작업은? | 위 Phase 1~4 |
