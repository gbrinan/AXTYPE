import { SITE, TYPES, QUESTIONS, shareText, resultCode } from './data.js';
import { score, TOTAL_POINTS } from './scoring.js';

const app = document.getElementById('app');
const byId = Object.fromEntries(TYPES.map((t) => [t.id, t]));
const typeOf = (id) => (Object.hasOwn(byId, id) ? byId[id] : null);

// 배포 경로에 상관없이 동작하도록 현재 주소에서 기준 경로를 얻는다. (예: https://host/AXTYPE/)
const BASE = location.origin + location.pathname.replace(/[^/]*$/, '');
const resultUrl = (id) => `${BASE}r/${id}/`;
const artUrl = (id) => `assets/${id}.webp`; // 타입별 캐릭터. 파일명은 타입 id 로 정해진다

const state = { answers: [] };

// 화면을 주소에 남긴다. 문항은 #q<번호>, 결과는 #r<답안>.
// 결과 해시는 답을 그대로 담고 있어서 새로고침해도 같은 결과가 다시 나온다.
// 문항 도중의 답은 sessionStorage 에 두되, 막혀 있으면 처음부터 다시 시작한다.
const STORE = 'axtype-answers';
const saveAnswers = (a) => { try { sessionStorage.setItem(STORE, a.join('')); } catch { /* 저장이 막힌 브라우저 */ } };
const loadAnswers = () => { try { return digits(sessionStorage.getItem(STORE) || ''); } catch { return null; } };
const clearAnswers = () => { try { sessionStorage.removeItem(STORE); } catch { /* 무시 */ } };

// '0120' → [0,1,2,0]. 선택지 번호가 아니면 null.
function digits(s) {
  if (!/^[0-2]*$/.test(s) || s.length > QUESTIONS.length) return null;
  return s.split('').map(Number);
}

const urlFor = (hash) => location.pathname + (hash || '');
function go(hash, { replace = false } = {}) {
  history[replace ? 'replaceState' : 'pushState'](null, '', urlFor(hash));
  route();
}

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
        ${TYPES.map((t) => `<figure class="figure"><img src="${artUrl(t.id)}" alt="${esc(t.ko)} ${esc(t.nick)} 피규어" loading="lazy"><figcaption><b>${esc(t.code)}</b> ${esc(t.nick)}<small>${esc(t.ko)}</small></figcaption></figure>`).join('')}
      </div>
      <button class="btn" id="start">테스트 시작 →</button>
      <p class="footnote">재미로 보는 테스트입니다. 5가지 아키타입 출처: <a href="${SITE.source.url}" target="_blank" rel="noopener">${esc(SITE.source.label)}</a></p>
    </section>
  `);
  document.getElementById('start').onclick = () => { state.answers = []; clearAnswers(); go('#q1'); };
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
      saveAnswers(state.answers);
      go(i + 1 < n ? `#q${i + 2}` : `#r${state.answers.join('')}`);
    };
  });
  const back = document.getElementById('back');
  if (back) back.onclick = () => history.back();
}

/* ---------- 화면: 결과 ---------- */
function typeCard(t, { label, sub } = {}) {
  const dark = t.ink.toLowerCase() !== '#ffffff';
  return `
    <section class="result-card" data-ink="${dark ? 'dark' : 'light'}" style="--type-color:${t.color};--type-ink:${t.ink}">
      <div class="top"><p class="label">${esc(label)}</p><p class="code">${esc(resultCode(t, sub))}</p></div>
      <img class="art" src="${artUrl(t.id)}" alt="${esc(t.ko)} ${esc(t.nick)} 피규어">
      <h1 class="name">${esc(t.nick)}<small>${esc(t.ko)} · ${esc(t.en)}</small></h1>
      <p class="headline">${esc(t.headline)}</p>
      <p class="tagline">${esc(t.tagline)}</p>
      <p class="tags">${t.tags.map((x) => `<span>#${esc(x)}</span>`).join('')}</p>
      ${sub ? `<p class="sub">서브 타입 · ${sub.emoji} ${esc(sub.nick)} ${esc(sub.ko)} ${esc(sub.code)}</p>` : ''}
    </section>
  `;
}

function typeBody(t) {
  const best = byId[t.best.id];
  const clash = byId[t.clash.id];
  return `
    <section class="section">
      <h2>무리가 알아보는 순간</h2>
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
        <div><b>가장 잘 맞는 짝</b><strong>${best.emoji} ${esc(best.nick)}</strong><span>${esc(t.best.why)}</span></div>
        <div><b>부딪히지만 필요한 짝</b><strong>${clash.emoji} ${esc(clash.nick)}</strong><span>${esc(t.clash.why)}</span></div>
      </div>
    </section>
  `;
}

function result({ main, sub, ranked }) {
  document.title = `나의 AX 타입: ${resultCode(main, sub)} ${main.nick}`;
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
        <h2>내 안의 다섯 동물</h2>
        <div class="bars">
          ${ranked.map((r) => {
            const t = byId[r.id];
            const pct = Math.round((r.total / TOTAL_POINTS) * 100);
            return `<div class="row"><span>${t.emoji} ${esc(t.nick)}</span><div class="track"><i style="width:${pct}%;background:${t.color}"></i></div><span class="pct">${pct}%</span></div>`;
          }).join('')}
        </div>
        <p class="footnote">내 답이 다섯 동물에게 나뉜 비율입니다. 많은 사람이 두세 동물에 걸쳐 있으니 메인과 서브를 함께 보세요.</p>
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
  document.getElementById('retry').onclick = () => { state.answers = []; clearAnswers(); go(''); };
}

/* ---------- 화면: 공유받은 결과 (?r=<type>) ---------- */
function shared(t) {
  document.title = `${t.code} ${t.nick}: ${t.headline}`;
  render(`
    <div class="screen">
      ${typeCard(t, { label: '공유받은 AX 타입' })}
      <button class="btn" id="start">나도 테스트하기 (1분) →</button>
      ${typeBody(t)}
      <button class="btn secondary" id="start2">나는 어떤 타입일까? →</button>
      <p class="footnote">5가지 아키타입 출처: <a href="${SITE.source.url}" target="_blank" rel="noopener">${esc(SITE.source.label)}</a></p>
    </div>
  `);
  const begin = () => { state.answers = []; clearAnswers(); go('#q1'); };
  document.getElementById('start').onclick = begin;
  document.getElementById('start2').onclick = begin;
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
  ctx.fillText('나의 AX 타입', W / 2, 140);
  ctx.globalAlpha = 1;
  ctx.font = font(900, 64);
  ctx.fillText(resultCode(main, sub), W / 2, 215);

  if (art) {
    const size = 560;
    ctx.drawImage(art, (W - size) / 2, 260, size, size);
  } else {
    ctx.font = font(400, 260);
    ctx.fillText(main.emoji, W / 2, 520);
  }

  ctx.font = font(900, 104);
  ctx.fillText(main.nick, W / 2, 920);
  ctx.font = font(700, 40);
  ctx.globalAlpha = .8;
  ctx.fillText(`${main.ko} · ${main.en}`, W / 2, 980);
  ctx.globalAlpha = 1;

  ctx.font = font(700, 54);
  ctx.fillText(main.headline, W / 2, 1065);

  if (sub) {
    ctx.font = font(700, 36);
    ctx.globalAlpha = .9;
    ctx.fillText(`서브 타입 · ${sub.emoji} ${sub.nick}`, W / 2, 1130);
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
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
// 주소 → 화면. 뒤로가기·앞으로가기·새로고침이 모두 여기를 지난다.
function route() {
  const h = location.hash;
  const done = h.startsWith('#r') && digits(h.slice(2));
  if (done && done.length === QUESTIONS.length) {
    state.answers = done;
    return result(score(done));
  }
  const q = /^#q(\d+)$/.exec(h);
  if (q) {
    const i = Math.min(Math.max(Number(q[1]), 1), QUESTIONS.length) - 1;
    // 새로고침이면 state 가 비어 있다. 저장해 둔 답으로 되살리고, 그것도 없으면 1번부터.
    if (state.answers.length < i) state.answers = loadAnswers()?.slice(0, i) || [];
    if (state.answers.length < i) return go('#q1', { replace: true });
    return question(i);
  }
  const sharedType = typeOf(new URLSearchParams(location.search).get('r'));
  return sharedType ? shared(sharedType) : landing();
}

window.addEventListener('popstate', route);
route();
