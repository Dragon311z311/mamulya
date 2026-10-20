/* Печенье с предсказанием: анимация и случайное пожелание без повторов, пока не выпадут все 365. */
function initCookie(){
  const W = window.WISHES, $ = s => document.querySelector(s);
  const stage = $('#stage'), btn = $('#cookieBtn'), wish = $('#wish'), cnt = $('#wishCount'), cv = $('#fx'), hint = $('.hint'), ctx = cv.getContext('2d');
  let deck = [], busy = false, isOpen = false, P = [], w = 0, h = 0, f = 0;
  const dpr = Math.min(devicePixelRatio || 1, 2), R = (a, b) => a + Math.random() * (b - a), T = (fn, ms) => setTimeout(fn, ms);
  const fit = () => { w = stage.clientWidth; h = stage.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  fit(); addEventListener('resize', fit);
  const draw = () => {
    if (!deck.length) { deck = W.map((_, i) => i); for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } }
    return deck.pop();
  };
  /* Частицы: пыль (всегда), крошки и звёзды (при раскрытии) */
  const dust = () => P.push({ t: 'd', x: R(0, w), y: h + 6, vx: R(-.15, .15), vy: R(-.55, -.2), r: R(.8, 2), life: 0, max: R(240, 420) });
  const burst = () => {
    const cx = w / 2, cy = h * .46, cols = ['#D9AE6B', '#C28F4C', '#E8CB94', '#A9803F'];
    for (let i = 0; i < 48; i++) { const a = R(0, 6.28), s = R(2, 8); P.push({ t: 'c', x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, r: R(1.5, 4.5), rot: R(0, 6), vr: R(-.3, .3), life: 0, max: R(70, 120), col: cols[i % 4] }); }
    for (let i = 0; i < 40; i++) { const a = R(0, 6.28), s = R(1, 5.5); P.push({ t: 's', x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, r: R(3, 8), life: 0, max: R(60, 140) }); }
  };
  const star = (x, y, r) => { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, d = i % 2 ? r * .28 : r; ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } ctx.closePath(); ctx.fill(); };
  (function loop(){
    requestAnimationFrame(loop);
    if (!stage.offsetParent) return;
    if (stage.clientWidth !== w) fit();
    ctx.clearRect(0, 0, w, h);
    if (++f % 7 === 0 && P.length < 160) dust();
    P = P.filter(p => {
      p.life++; const k = p.life / p.max; if (k >= 1) return false;
      p.x += p.vx; p.y += p.vy;
      if (p.t === 'c') { p.vy += .28; p.vx *= .985; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = 1 - k * k; ctx.fillStyle = p.col; ctx.fillRect(-p.r, -p.r * .6, p.r * 2, p.r * 1.2); ctx.restore(); }
      else if (p.t === 's') { p.vy += .03; p.vx *= .98; ctx.globalAlpha = (1 - k) * (.6 + .4 * Math.sin(p.life * .6)); ctx.fillStyle = '#F4DDA6'; ctx.shadowColor = '#F4DDA6'; ctx.shadowBlur = 10; star(p.x, p.y, p.r); ctx.shadowBlur = 0; }
      else if (p.t === 'f') { p.rot += .12; p.x += Math.sin(p.life * .08 + p.s) * .9; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, Math.cos(p.rot)); ctx.globalAlpha = 1 - k * k * k; ctx.fillStyle = p.col; ctx.fillRect(-p.r, -p.r * .5, p.r * 2, p.r); ctx.restore(); }
      else { ctx.globalAlpha = Math.sin(Math.PI * k) * .7; ctx.fillStyle = '#E8CB94'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
      return true;
    });
    ctx.globalAlpha = 1;
  })();
  /* Золотое конфетти сверху в момент появления пожелания */
  const confetti = () => { const cols = ['#E8CB94', '#FAF8F5', '#C5A880', '#D9AE6B', '#F4DDA6']; for (let i = 0; i < 80; i++) P.push({ t: 'f', x: R(0, w), y: R(-90, -5), vx: 0, vy: R(1.1, 2.5), r: R(3, 6), rot: R(0, 6), a: R(0, 6), s: R(0, 6), life: 0, max: R(170, 270), col: cols[i % 5] }); };
  const wb = $('#wishbox');
  /* Сценарий: сжатие → нарастающая дрожь и свечение → трещина, вспышка, кольца → раскрытие, крошки, звёзды, летит бумажка → карточка с пожеланием + конфетти */
  const run = () => {
    const i = draw();
    wish.innerHTML = W[i].split(' ').map((x, k) => `<span style="animation-delay:${(.25 + k * .05).toFixed(2)}s">${x}</span>`).join(' ');
    stage.classList.remove('idle'); stage.classList.add('squeeze');
    T(() => { stage.classList.remove('squeeze'); stage.classList.add('trem', 'charge'); }, 250);
    T(() => { stage.classList.remove('trem', 'charge'); stage.classList.add('crack', 'boom'); }, 850);
    T(() => { stage.classList.add('open'); burst(); if (hint) hint.style.display = 'none'; }, 1050);
    T(() => {
      wb.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => wb.classList.add('show')));
      confetti(); cnt.textContent = 'Пожелание № ' + (i + 1) + ' из ' + W.length;
      wb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1700);
    T(() => { isOpen = true; busy = false; btn.textContent = 'Ещё одно печенье'; }, 2300);
  };
  const act = () => {
    if (busy) return; busy = true;
    if (isOpen) {
      isOpen = false; cnt.textContent = ''; wb.classList.remove('show'); stage.classList.remove('open', 'crack', 'boom');
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      T(() => { wb.classList.remove('on'); stage.classList.add('idle'); T(run, 150); }, 600);
    } else run();
  };
  stage.onclick = act; btn.onclick = act;
}
