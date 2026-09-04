# AX 타입 테스트

**AI 시대, 당신은 어떤 일꾼입니까?** 10문항, 1분. 결과는 다섯 타입 중 하나. AX 는 AI Transformation(AI 전환)의 국내 통용 약어다.

| 코드 | 타입 | 별명 | 한 줄 |
|---|---|---|---|
| PRTO | 💡 **프로토타이퍼** Prototyper | 발명가 | 아이디어를 찍어내는 사람 |
| BLDR | 🚀 **빌더** Builder | 제작자 | 아이디어를 진짜로 만드는 사람 |
| SWPR | 🧹 **스위퍼** Sweeper | 편집자 | 덜어내서 좋아지게 만드는 사람 |
| GRWR | 📈 **그로워** Grower | 육성가 | 만든 걸 사랑받게 만드는 사람 |
| MNTR | 🛠️ **메인테이너** Maintainer | 수호자 | 무너지지 않게 지키는 사람 |

결과 코드는 `메인-서브첫글자` 꼴이다. `PRTO-G` 는 프로토타이퍼이면서 그로워 기질이 있는 사람.

다섯 아키타입은 Claude Code를 만든 Boris Cherny가 [X에 올린 글](https://x.com/bcherny/status/2071379474277613732)에서 가져왔다. 직군이 아니라 **일하는 패턴**이고, 많은 사람이 두세 타입에 걸쳐 있다. 그래서 결과는 메인 타입과 서브 타입을 같이 보여준다.

재미로 보는 테스트다. 심리검사가 아니다.

## 실행

사이트는 빌드 없이 정적 파일 그대로 돈다. ES 모듈을 쓰므로 `file://` 이 아니라 로컬 서버로 연다. `build` 는 생성물(공유용 OG 페이지와 이미지)을 다시 만들 때만 필요하다.

```bash
npm run dev        # http://localhost:3000
npm run check      # 문항 균형·결과 분포·생성물 동기화·PWA 목록 검증
npm run smoke      # 실제 브라우저로 한 바퀴 (Playwright 필요)
npm run build      # r/<type>/ 와 og/*.png 를 data.js 에서 다시 생성하고 check 실행 (Playwright 필요)
```

`build` 는 전역 또는 로컬에 설치된 `playwright` 를 찾아 쓴다. 없으면 `npm i -D playwright && npx playwright install chromium`.

## 구조

```
data.js        타입·문항·공유 문구의 단일 진실 원천. 내용 수정은 여기서만.
scoring.js     채점과 동점 규칙. 브라우저와 검증 스크립트가 같이 쓴다.
index.html     한 페이지. 랜딩 → 문항 → 결과. 공유 링크로 들어오면(?r=<type>) 그 타입 설명과 "나도 테스트하기"부터 보여준다. 링크 미리보기 메타태그, 아이콘, PWA 링크가 head 에 있다.
manifest.webmanifest, sw.js  홈 화면 설치와 오프라인용. 파일을 추가하면 sw.js 의 목록과 VERSION 을 갱신한다 (check 가 목록을 대조).
icons/         favicon.svg 가 원본. PNG 들은 build 가 렌더한다. (생성물)
app.js         화면 렌더링, 공유(Threads/X/복사), 결과 카드 이미지 저장.
style.css
assets/<type>.webp  타입별 3D 캐릭터 아트 640×640. 생성 프롬프트는 findings.md 에.
r/<type>/      공유 링크가 가리키는 곳. OG 태그만 들고 본편으로 보낸다. (생성물)
og/<type>.png  링크 미리보기 이미지 1200×630. (생성물)
scripts/       build.mjs (생성), check.mjs (검증), smoke.mjs (브라우저 한 바퀴)
.github/workflows/ci.yml  PR 마다 check + smoke. main 에 들어오면 GitHub Pages 배포
docs/DESIGN.md 왜 이렇게 설계했는지: 바이럴 루프, 문항 원칙, 채점, 정직성 게이트.
design/        Claude Design 캔버스 원본(아트보드 6장 + canvas.json). 화면의 거울이지 원본이 아니다.
```

`r/` 와 `og/` 는 손으로 고치지 않는다. `data.js` 를 고치고 `npm run build`.

`assets/` 의 캐릭터는 이미지 생성 모델로 만든 것이다. 다시 만들면 `data.js` 의 타입 색을 새 이미지의 배경색에 맞춘다. 카드와 캐릭터가 한 장처럼 이어져야 하기 때문이다.

`design/` 은 시각 작업을 Claude Design 에서 이어가기 위한 사본이다. 거기서 정한 색·간격·문구는 `style.css` 와 `data.js` 로 되돌려 넣어야 배포된다.

## 배포

정적 호스팅 어디든 된다. 한 가지만 맞춘다: `data.js` 의 `SITE.url` 을 실제 배포 주소로, 끝 슬래시 없이. 공유 링크의 미리보기(OG 이미지)가 절대 경로로 이 값을 쓰기 때문이다. 바꾼 뒤 `npm run build` 로 생성물을 다시 만든다.

GitHub Pages 는 `main` 에 푸시될 때 워크플로가 올린다 (`.github/workflows/ci.yml` 의 deploy). 처음 한 번은 워크플로가 Pages 를 켜려 시도하고, 권한이 없으면 Settings → Pages → Source 를 "GitHub Actions" 로 한 번 바꿔 준다. 서비스 워커는 HTTPS 에서만 등록되므로 로컬에서는 PWA 설치가 뜨지 않는다.

작업은 브랜치에서 PR 로 올린다. PR 마다 `check` 와 `smoke` 가 돌고, 둘 다 통과해야 합친다.

## 작업 방식

- 계획·발견·진행은 [`tasks.md`](./tasks.md), [`findings.md`](./findings.md), [`progress.md`](./progress.md) 세 파일에 기록한다 ([File-based Planning Workflow](https://github.com/ahastudio/til/blob/main/ai/file-based-planning-workflow.md)).
- 에이전트용 위생 스킬 [paperthin](https://github.com/LilMGenius/paperthin) 이 `.claude/skills/` 에 설치되어 있다. 설계 철학도 거기서 빌렸다: 만든 사람이 아니라 결과물을 믿을 것, 한 사실은 한 곳에, 더하기보다 덜어내기. 자세한 건 [`CLAUDE.md`](./CLAUDE.md).
