# Project: AX 타입 테스트

## Goal

Threads 에서 퍼지는 1분짜리 "AI 시대 일꾼 타입" 테스트. 프로토타이퍼·빌더·스위퍼·그로워·메인테이너 중 나는 누구인지 알려주고, 결과를 한 번의 탭으로 올리게 한다. 정적 파일만으로 어디든 배포.

## Current Phase

🔄 Phase 5: Delivery

## Phases

### Phase 1: Requirements & Discovery ✅

- [x] 다섯 아키타입 원문 확보 (Boris Cherny, X)
- [x] 바이럴 퀴즈 모범 사례 조사 (정체성 훅, 결과 페이지, 문항 수)
- [x] Threads 공유 인텐트 조사
- [x] paperthin 스킬 설치 및 전 스킬 정독, 철학 추출
- [x] 3-file 계획 워크플로우 세팅

### Phase 2: Planning & Structure ✅

- [x] 설계 문서 (`docs/DESIGN.md`)
- [x] 파일 구조 확정: `data.js` SSOT, 생성물 `r/`·`og/`, 검증 스크립트
- [x] 채점·동점 규칙 확정

### Phase 3: Implementation ✅

- [x] 타입 5개 결과 문구
- [x] 문항 10개 (primary/secondary 균형)
- [x] 랜딩 → 문항 → 결과 화면
- [x] Threads/X 인텐트, 링크 복사, 결과 카드 저장
- [x] `r/<type>/` OG 페이지 + `og/*.png` 생성 스크립트
- [x] `check.mjs` (구조·균형·분포·동기화)

### Phase 4: Testing & Verification ✅

- [x] `npm run check` 통과
- [x] 브라우저로 전체 플로우 구동 (랜딩·문항·되돌리기·결과·공유 링크·공유받은 화면·카드 저장)
- [x] 콜드 리드 (`shower`)

### Phase 5: Delivery 🔄

- [x] README, CLAUDE.md
- [x] 첫 커밋, `main` 푸시
- [ ] GitHub Pages 켜기 (사람이 해야 함: Settings → Pages)
- [ ] 실제 Threads 에 링크 올려 미리보기 확인 (사람이 해야 함)

## Key Questions

1. 배포 주소가 `https://gbrinan.github.io/AXTYPE` 이 맞나? 아니면 `data.js` 의 `SITE.url` 을 바꾸고 `npm run build`.
2. 다섯 타입 이름을 한글 음차(프로토타이퍼)로 갈지, 번역(발명가)로 갈지. 지금은 음차 + 영문 병기. 원문과의 연결이 보이는 쪽을 택했다.
3. 결과 카드 이미지 비율: 4:5 (1080×1350) 로 갔다. Threads 피드에서 가장 크게 보이는 비율. 1:1 이 필요하면 `saveCard` 의 H 만 바꾸면 된다.

## Decisions Made

| Decision | Rationale |
|---|---|
| 프레임워크·번들러 없음, ES 모듈 정적 파일 | 덜어내기. 파일 여섯 개면 돌고, 어디든 배포되고, 5년 뒤에도 열린다 |
| `data.js` 하나에 타입·문항·공유 문구 | 한 사실은 한 곳에. 화면·OG·카드·공유 문구가 전부 여기서 나온다 |
| `r/<type>/` 정적 OG 페이지 + JS 리다이렉트 | 크롤러는 JS 를 안 돌린다. 타입별 미리보기 이미지를 주려면 정적 HTML 이 필요 |
| 생성물을 커밋 + `check` 로 동기화 강제 | 배포 시 빌드 단계 없음. 대신 어긋나면 검증이 잡는다 (paperthin 이 카탈로그 복사본을 CI 로 지키는 방식) |
| 10문항 × 3지선다, +2/+1 | 완주율 자료(7~12)와 균형 배분(6/6)이 동시에 맞는 수 |
| 메인 + 서브 타입 | 원문: "많은 사람이 두세 타입에 걸친다" |
| 이메일·로그인·분석 없음 | 사전 게이트는 공유율을 죽인다. 지금 목표는 전환이 아니라 확산 |
| 희소성 수치 없음 | 실제 데이터가 없다. 지어내지 않는다 |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---|---|
| Playwright 를 로컬 `require` 로 못 찾음 | 1 | 전역 `npm root -g` 경로에서 폴백 로드 (`scripts/build.mjs`) |
| Node 가 `data.js` 를 CommonJS 로 먼저 파싱해 경고 | 1 | `package.json` 에 `"type": "module"` |

## Notes

- 문항을 하나라도 바꾸면 `npm run check`. 균형이 깨지면 바로 실패한다.
- `SITE.url` 을 바꾸면 `npm run build` — `index.html` 의 og:image 도 `check` 가 대조한다.
- 중요한 결정 전에 `docs/DESIGN.md` 의 "정직성 게이트"를 다시 읽는다.
