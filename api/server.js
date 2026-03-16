'use strict';

const http  = require('http');
const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const PORT     = process.env.API_PORT || 3000;
const TG_TOKEN = process.env.TG_TOKEN;
const TG_CHAT  = process.env.TG_CHAT;

if (!TG_TOKEN || !TG_CHAT) {
  console.error('Ошибка: не заданы TG_TOKEN или TG_CHAT в .env');
  process.exit(1);
}

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TG_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Bad JSON from Telegram')); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/api/lead') {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', async () => {
      try {
        const { name, phone, model, comment } = JSON.parse(raw);
        if (!name || !phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Имя и телефон обязательны' }));
          return;
        }
        const text = [
          '🛥 <b>Новая заявка с сайта ЛОСЬ 400</b>',
          '',
          `👤 <b>Имя:</b> ${name}`,
          `📞 <b>Телефон:</b> ${phone}`,
          model   ? `⛵ <b>Модель:</b> ${model}`        : '',
          comment ? `💬 <b>Комментарий:</b> ${comment}` : '',
        ].filter(Boolean).join('\n');

        const tg = await sendTelegram(text);
        if (tg.ok) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } else {
          throw new Error(JSON.stringify(tg));
        }
      } catch (err) {
        console.error('lead error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Внутренняя ошибка' }));
      }
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API сервер запущен на 127.0.0.1:${PORT}`);
});
