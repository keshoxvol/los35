(function () {
  if (localStorage.getItem('cookie_ok')) return;

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML =
    '<span>Мы используем файлы cookie и Яндекс.Метрику для анализа трафика. ' +
    'Продолжая использовать сайт, вы соглашаетесь с <a href="/privacy/">политикой обработки данных</a>.</span>' +
    '<button id="cookie-ok">Понятно</button>';
  document.body.appendChild(banner);

  document.getElementById('cookie-ok').addEventListener('click', function () {
    localStorage.setItem('cookie_ok', '1');
    banner.style.opacity = '0';
    setTimeout(function () { banner.remove(); }, 300);
  });
})();
