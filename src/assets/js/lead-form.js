document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const TG_TOKEN = window.ENV && window.ENV.TG_TOKEN;
  const TG_CHAT = window.ENV && window.ENV.TG_CHAT;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name    = document.getElementById('lf-name').value.trim();
    const phone   = document.getElementById('lf-phone').value.trim();
    const model   = document.getElementById('lf-model').value;
    const comment = document.getElementById('lf-comment').value.trim();
    const btn     = document.getElementById('lf-submit');
    const errEl   = document.getElementById('lf-error');

    if (!name || !phone) return;

    btn.disabled = true;
    btn.textContent = 'Отправка...';
    errEl.style.display = 'none';

    const text = [
      '🛥 <b>Новая заявка с сайта ЛОСЬ 400</b>',
      '',
      `👤 <b>Имя:</b> ${name}`,
      `📞 <b>Телефон:</b> ${phone}`,
      model   ? `⛵ <b>Модель:</b> ${model}` : '',
      comment ? `💬 <b>Комментарий:</b> ${comment}` : '',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' })
      });
      const data = await res.json();
      if (data.ok) {
        document.getElementById('leadForm').style.display = 'none';
        document.getElementById('lf-success').style.display = 'block';
      } else {
        throw new Error('TG error');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
      errEl.style.display = 'block';
    }
  });
});
