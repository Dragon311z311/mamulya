/* Доступ к разделам: закрытый раздел возвращает в меню, открытый отмечается пройденным */
if (STEPS.includes(document.body.dataset.page)) { if (!isUnlocked(document.body.dataset.page)) location.replace('menu.html'); else markDone(document.body.dataset.page); }
/* Общий код для всех страниц. Менять не нужно. */
const D = window.SITE_DATA, $ = s => document.querySelector(s);
const page = document.body.dataset.page;

/* Главная: поздравления по кругу */
if (page === 'home') {
  const g = $('#greet'); let i = 0;
  D.greetings.forEach(t => { const s = document.createElement('span'); s.textContent = t; g.appendChild(s); });
  const show = () => { [...g.children].forEach(s => s.classList.remove('on')); g.children[i++ % g.children.length].classList.add('on'); };
  show(); setInterval(show, 2600);
}
/* Наполнение страниц из data.js */
if (page === 'moments') $('#photoList').innerHTML = D.photos.map(p => `<figure class="photo"><div class="pic">${p.photo ? `<img src="${p.photo}" alt="${p.text}" loading="lazy">` : '🖼️'}</div><p>${p.text}</p></figure>`).join('');
if (page === 'promises') $('#promiseList').innerHTML = D.promises.map(p => `<li>${p}</li>`).join('');
if (page === 'warm') {
  let last = -1;
  $('#warmBtn').onclick = () => {
    let i; do { i = Math.floor(Math.random() * D.compliments.length); } while (i === last && D.compliments.length > 1);
    last = i; $('#phrase').textContent = D.compliments[i]; sparkle(14);
  };
}
if (page === 'final') sparkle(22);

function sparkle(n) {
  const set = ['✦', '❤️', '✧', '🤍'];
  for (let k = 0; k < n; k++) {
    const h = document.createElement('div'); h.className = 'fall';
    h.textContent = set[Math.floor(Math.random() * set.length)];
    h.style.left = Math.random() * 100 + 'vw'; h.style.fontSize = (14 + Math.random() * 18) + 'px';
    h.style.animationDuration = (3 + Math.random() * 3) + 's'; h.style.animationDelay = (Math.random() * 1.2) + 's';
    document.body.appendChild(h); setTimeout(() => h.remove(), 7500);
  }
}

/* Плавный переход между страницами (обычные ссылки между html-файлами) */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || a.target || /^(https?:|mailto:|#)/.test(a.getAttribute('href'))) return;
  e.preventDefault(); document.body.classList.add('leaving');
  setTimeout(() => { location.href = a.href; }, 280);
});
window.addEventListener('pageshow', () => document.body.classList.remove('leaving'));

if (page === 'menu') { applyMenuState(); window.addEventListener('pageshow', applyMenuState); }
if (page === 'wishes') initCookie();
