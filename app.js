import { SITE, TYPES, QUESTIONS, shareText } from './data.js';
import { score, TOTAL_POINTS } from './scoring.js';

const app = document.getElementById('app');
const byId = Object.fromEntries(TYPES.map((t) => [t.id, t]));
const typeOf = (id) => (Object.hasOwn(byId, id) ? byId[id] : null);

// 배포 경로에 상관없이 동작하도록 현재 주소에서 기준 경로를 얻는다. (예: https://host/AXTYPE/)
const BASE = location.origin + location.pathname.replace(/[^/]*$/, '');
const resultUrl = (id) => `${BASE}r/${id}/`;
const artUrl = (id) => `assets/${id}.webp`; // 타입별 캐릭터. 파일명은 타입 id 로 정해진다

const state = { answers: [] };

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, 1800);
}

function render(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0 });
}

/* ---------- 화면: 랜딩 ---------- */
function landing() {
  document.title = SITE.name;
  render(`
    <section class="screen hero">
      <p class="kicker">AX = AI Transformation, AI 전환</p>
      <h1>${esc(SITE.name)}</h1>
      <p class="lead">${esc(SITE.tagline)}</p>
      <p class="desc">${esc(SITE.description)}</p>
      <div class="lineup">
        ${TYPES.map((t) => `<figure class="figure"><img src="${artUrl(t.id)}" alt="${esc(t.ko)} 피규어" loading="lazy"><figcaption>${t.emoji} ${esc(t.ko)}</figcaption></figure>`).join('')}
      </div>
      <button class="btn" id="start">테스트 시작 →</button>
      <p class="footnote">재미로 보는 테스트입니다. 5가지 아키타입 출처: <a href="${SITE.source.url}" target="_blank" rel="noopener">${esc(SITE.source.label)}</a></p>
    </section>
  `);
  document.getElementById('start').onclick = () => { state.answers = []; question(0); };
}

/* ---------- 화면: 문항 ---------- */
function question(i) {
  const q = QUESTIONS[i];
  const n = QUESTIONS.length;
  render(`
    <section class="screen">
      <div class="progress">
        <span>${i + 1} / ${n}</span>
        <div class="bar"><i style="width:${((i + 1) / n) * 100}%"></i></div>
      </div>
      <h2 class="question">${esc(q.text)}</h2>
      <div class="options">
        ${q.options.map((o, k) => `<button class="option${state.answers[i] === k ? ' selected' : ''}" data-k="${k}">${esc(o.text)}</button>`).join('')}
      </div>
      ${i > 0 ? '<button class="btn ghost" id="back">← 이전</button>' : ''}
    </section>
  `);
  app.querySelectorAll('.option').forEach((b) => {
    b.onclick = () => {
      state.answers[i] = Number(b.dataset.k);
      state.answers.length = i + 1;
      i + 1 < n ? question(i + 1) : result(score(state.answers));
    };
  });
  const back = document.getElementById('back');
  if (back) back.onclick = () => question(i - 1);
}

/* ---------- 화면: 결과 ---------- */
function typeCard(t, { label, sub } = {}) {
  const dark = t.ink.toLowerCase() !== '#ffffff';
  return `
    <section class="result-card" data-ink="${dark ? 'dark' : 'light'}" style="--type-color:${t.color};--type-ink:${t.ink}">
      <p class="label">${esc(label)}</p>
      <img class="art" src="${artUrl(t.id)}" alt="${esc(t.ko)} 피규어">
      <h1 class="name">${esc(t.ko)}<small>${esc(t.en)}</small></h1>
      <p class="headline">${esc(t.headline)}</p>
      <p class="tagline">${esc(t.tagline)}</p>
      ${sub ? `<p class="sub">서브 타입 · ${sub.emoji} ${esc(sub.ko)}</p>` : ''}
    </section>
  `;
}

function typeBody(t) {
  const best = byId[t.best.id];
  const clash = byId[t.clash.id];
  return `
    <section class="section">
      <h2>동료가 알아보는 순간</h2>
      <ul>${t.traits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </section>
    <section class="section">
      <h2>AI 시대, 당신의 무기</h2>
      <p>${esc(t.weapon)}</p>
    </section>
    <section class="section">
      <h2>조심할 것</h2>
      <p>${esc(t.shadow)}</p>
    </section>
    <section class="section">
      <h2>케미</h2>
      <div class="chem">
        <div><b>최고의 짝</b><strong>${best.emoji} ${esc(best.ko)}</strong><span>${esc(t.best.why)}</span></div>
        <div><b>부딪히지만 필요한 짝</b><strong>${clash.emoji} ${esc(clash.ko)}</strong><span>${esc(t.clash.why)}</span></div>
      </div>
    </section>
  `;
}

function result({ main, sub, ranked }) {
  document.title = `나의 AX 타입: ${main.emoji} ${main.ko}`;
  const url = resultUrl(main.id);
  const text = shareText(main, sub, url);
  const threads = `https://www.threads.com/intent/post?text=${encodeURIComponent(text)}`;
  const x = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;

  render(`
    <div class="screen">
      ${typeCard(main, { label: '나의 AX 타입', sub })}
      <section class="share">
        <a class="btn threads" href="${threads}" target="_blank" rel="noopener">Threads에 결과 올리기</a>
        <div class="row">
          <button class="btn secondary" id="copy">문구+링크 복사</button>
          <button class="btn secondary" id="save">이미지로 저장</button>
        </div>
        <a class="btn ghost" href="${x}" target="_blank" rel="noopener">X에 올리기</a>
      </section>
      ${typeBody(main)}
      <section class="section">
        <h2>내 안의 다섯 타입</h2>
        <div class="bars">
          ${ranked.map((r) => {
            const t = byId[r.id];
            const pct = Math.round((r.total / TOTAL_POINTS) * 100);
            return `<div class="row"><span>${t.emoji} ${esc(t.ko)}</span><div class="track"><i style="width:${pct}%;background:${t.color}"></i></div><span class="pct">${pct}%</span></div>`;
          }).join('')}
        </div>
        <p class="footnote">내 답이 다섯 타입에 나뉜 비율입니다. 많은 사람이 두세 타입에 걸쳐 있으니 메인과 서브를 함께 보세요.</p>
      </section>
      <button class="btn secondary" id="retry">다시 하기</button>
      <p class="footnote">재미로 보는 테스트입니다. 5가지 아키타입 출처: <a href="${SITE.source.url}" target="_blank" rel="noopener">${esc(SITE.source.label)}</a></p>
    </div>
  `);

  document.getElementById('copy').onclick = async () => {
    try { await navigator.clipboard.writeText(text); toast('결과와 링크를 복사했어요'); }
    catch { toast('복사에 실패했어요. 주소창을 이용해 주세요'); }
  };
  document.getElementById('save').onclick = () => saveCard(main, sub);
  document.getElementById('retry').onclick = () => { history.replaceState(null, '', location.pathname); landing(); };
}

/* ---------- 화면: 공유받은 결과 (?r=<type>) ---------- */
function shared(t) {
  document.title = `${t.emoji} ${t.ko}: ${t.headline}`;
  render(`
    <div class="screen">
      ${typeCard(t, { label: '공유받은 AX 타입' })}
      <button class="btn" id="start">나도 테스트하기 (1분) →</button>
      ${typeBody(t)}
      <button class="btn secondary" id="start2">나는 어떤 타입일까? →</button>
      <p class="footnote">5가지 아키타입 출처: <a href="${SITE.source.url}" target="_blank" rel="noopener">${esc(SITE.source.label)}</a></p>
    </div>
  `);
  const go = () => { history.replaceState(null, '', location.pathname); state.answers = []; question(0); };
  document.getElementById('start').onclick = go;
  document.getElementById('start2').onclick = go;
}

/* ---------- 결과 카드 이미지 (1080×1350, 4:5) ---------- */
function loadArt(id) {
  return new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = artUrl(id); });
}

async function saveCard(main, sub) {
  let art = null;
  try { art = await loadArt(main.id); } catch { /* 아트가 없으면 이모지로 */ }
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const font = (w, px) => `${w} ${px}px ${getComputedStyle(document.body).fontFamily}`;

  ctx.fillStyle = main.color;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = main.ink;
  ctx.textAlign = 'center';
  ctx.font = font(700, 36);
  ctx.globalAlpha = .85;
  ctx.fillText('나의 AX 타입', W / 2, 160);
  ctx.globalAlpha = 1;

  if (art) {
    const size = 560;
    ctx.drawImage(art, (W - size) / 2, 230, size, size);
  } else {
    ctx.font = font(400, 260);
    ctx.fillText(main.emoji, W / 2, 520);
  }

  ctx.font = font(900, 104);
  ctx.fillText(main.ko, W / 2, 900);
  ctx.font = font(700, 40);
  ctx.globalAlpha = .8;
  ctx.fillText(main.en, W / 2, 960);
  ctx.globalAlpha = 1;

  ctx.font = font(700, 54);
  ctx.fillText(main.headline, W / 2, 1050);

  if (sub) {
    ctx.font = font(700, 36);
    ctx.globalAlpha = .9;
    ctx.fillText(`서브 타입 · ${sub.emoji} ${sub.ko}`, W / 2, 1120);
    ctx.globalAlpha = 1;
  }

  ctx.font = font(700, 34);
  ctx.globalAlpha = .85;
  ctx.fillText(SITE.tagline, W / 2, 1230);
  ctx.font = font(400, 30);
  ctx.fillText(BASE.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, 1285);
  ctx.globalAlpha = 1;

  c.toBlob((blob) => {
    if (!blob) { toast('이미지를 만들지 못했어요'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `axtype-${main.id}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('이미지를 저장했어요. Threads에 사진으로 올려보세요');
  }, 'image/png');
}

/* ---------- 시작 ---------- */
const sharedType = typeOf(new URLSearchParams(location.search).get('r'));
sharedType ? shared(sharedType) : landing();
