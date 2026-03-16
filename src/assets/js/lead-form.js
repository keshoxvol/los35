document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('leadForm');
  if (!form) return;

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

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, model, comment })
      });
      const data = await res.json();
      if (data.ok) {
        document.getElementById('leadForm').style.display = 'none';
        document.getElementById('lf-success').style.display = 'block';
      } else {
        throw new Error(data.error || 'Ошибка');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
      errEl.style.display = 'block';
    }
  });
});
