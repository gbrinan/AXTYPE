# Project: AX 타입 테스트

## Goal

Threads 에서 퍼지는 1분짜리 "AI 시대 일꾼 타입" 테스트. 프로토타이퍼·빌더·스위퍼·그로워·메인테이너 중 나는 누구인지 알려주고, 결과를 한 번의 탭으로 올리게 한다. 정적 파일만으로 어디든 배포.

## Current Phase

🔄 Phase 5: Delivery (Phase 6~9 완료, Vercel 배포 연결됨, PR 2건 대기)

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
- [x] 배포: Vercel 프로젝트 `axtype` 이 저장소에 연결됨. `main` 푸시마다 `https://axtype.vercel.app` 에 올라간다 (`vercel.json`: 빌드 없이 루트를 그대로 서빙)
- [ ] 실제 Threads 에 링크 올려 미리보기 확인 (사람이 해야 함)
- [ ] **첫 번째 못**: 25명(개발 12·비개발 13) 실측 — 못 고르는 문항 표시, 24시간 내 실제 게시 수 (`findings.md` hate 절). 게시 5명 미만이면 문구·타입 축 재설계, 마찰 제거 공수 중단

### Phase 6: 비주얼 (블라인드 박스 피규어) ✅

- [x] 타입별 3D 캐릭터 5장 생성, `assets/` 에 640px WebP
- [x] 랜딩 라인업, 결과·공유받은 카드, 저장 카드, OG 이미지에 적용
- [x] 타입 색을 이미지 배경색에 맞춤
- [x] 디자인 캔버스 아트보드에 반영

### Phase 7: MBTI 문법 + 링크 미리보기·아이콘·PWA ✅

- [x] 타입별 4글자 코드, 별명, 태그 3개. 결과 코드 `메인-서브첫글자`
- [x] 카드·공유 문구·저장 이미지·OG 에 코드 표시
- [x] index 와 r/ 페이지에 og:·twitter: 태그, 파비콘, 테마색, 애플 아이콘
- [x] 매니페스트, 서비스 워커, 아이콘 5종 생성. check 가 목록·파일 대조



- [x] `scripts/smoke.mjs`: 브라우저 한 바퀴를 단언으로
- [x] `.github/workflows/ci.yml`: PR 마다 check + smoke, main 푸시에 Pages 배포
- [ ] PR 열고 CI 초록 확인 → 합치기 → 배포 주소에서 미리보기·PWA 확인 (사람)

### Phase 9: 동물 피규어로 교체 ✅

- [x] 고양이·강아지·토끼·곰·부엉이 5장 생성, 배경 단색 확인 (부엉이는 재생성)
- [x] `assets/` 교체, 타입 색을 새 배경색에 맞춤, `sw.js` VERSION 올림, OG 재생성
- [x] check·smoke 통과, 문서의 동물 매핑 표
- [ ] PR 합치기 → 배포 주소에서 카드·미리보기 확인 (사람)

### Phase 10: 문구도 동물로 ✅

- [x] `nick` 을 동물 이름으로, 이모지를 동물로, headline·tagline·traits·weapon·shadow·케미·공유 문구를 동물 목소리로
- [x] 랜딩·결과 화면 라벨("내 안의 다섯 동물", "무리가 알아보는 순간"), 메타 태그, README 표
- [x] 기본 OG 카드 세로 배치에서 캐릭터가 잘리던 것 수정 (`.l` 의 flex:1)
- [x] `sw.js` VERSION v3, 생성물 재생성, check·smoke 통과

### Phase 11: 사용자 관점 점검 ✅

- [x] 실제 브라우저로 320·390·1440px, 뒤로가기·앞으로가기·새로고침·다크 모드·키보드 점검
- [x] 뒤로가기가 사이트를 벗어나던 것, 결과 새로고침이 결과를 날리던 것 → 해시 라우팅으로 수정
- [x] `#q0` 등 망가진 주소에서 빈 화면이 되던 것 수정
- [x] 회귀 테스트를 `smoke.mjs` 에 추가 (뒤로가기·새로고침·주소 붙여넣기·망가진 해시)

### Phase 12: 문항 개편 (행동 중심, 1선택지 1타입) ✅

- [x] 선호·자기 이미지를 묻던 문항("가장 설레는", "가장 뿌듯했던", "1년 뒤 듣고 싶은 말") 제거, 열 문항 모두 행동 장면으로
- [x] 선택지 하나가 타입 하나만 가리키게 (`primary`/`secondary` → `type`), 채점을 1점으로
- [x] `check` 규칙 교체: 30 슬롯에 타입마다 6번, 한 문항에 같은 타입 금지, 선택지 문구에 타입 이름 노출 금지
- [x] 브라우저로 10가지 검증 (결과 도달 5타입, 답 변경 시 중복 없음, 합계 100%, 공유·복사·저장)
- [ ] 판별 여유: 1위 동점 34.7%. 문항 수·가중치·순위 선택 중 무엇으로 늘릴지는 25명 실측 뒤에 (사람)

## Key Questions

0. 완주자가 실제로 올리는가? 설계 전체가 이 가정 위에 있다. 코드보다 먼저 25명 실측으로 확인한다.

1. 배포 주소는 Vercel 프로젝트 `axtype` 의 `https://axtype.vercel.app`. 주소가 바뀌면 `data.js` 의 `SITE.url` 을 바꾸고 `npm run build`.
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
