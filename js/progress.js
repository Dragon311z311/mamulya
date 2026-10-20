/* Поэтапное открытие разделов. Менять не нужно. Порядок шагов: */
const STEPS = ['moments', 'promises', 'warm', 'letter', 'final'];
let _mem = [];
const store = {
  get(){ try { return JSON.parse(localStorage.getItem('gift_done') || '[]'); } catch(e){ return _mem; } },
  set(v){ _mem = v; try { localStorage.setItem('gift_done', JSON.stringify(v)); } catch(e){} }
};
function isUnlocked(k){
  if (window.SITE_DATA.unlockAll) return true;
  const i = STEPS.indexOf(k);
  return i <= 0 || store.get().includes(STEPS[i - 1]);
}
function markDone(k){ const d = store.get(); if (!d.includes(k)) { d.push(k); store.set(d); } }
function applyMenuState(){
  const done = store.get();
  document.querySelectorAll('[data-step]').forEach(a => {
    const k = a.dataset.step, ok = isUnlocked(k);
    a.classList.toggle('locked', !ok); a.classList.toggle('done', done.includes(k));
    a.setAttribute('aria-disabled', ok ? 'false' : 'true');
    const s = a.querySelector('.state'); if (s) s.textContent = !ok ? '🔒' : done.includes(k) ? '✓' : '→';
  });
}
/* Закрытый шаг не открывается, карточка слегка «качнётся» */
document.addEventListener('click', e => {
  const a = e.target.closest('.locked'); if (!a) return;
  e.preventDefault(); e.stopImmediatePropagation();
  a.classList.remove('nudge'); void a.offsetWidth; a.classList.add('nudge');
}, true);
