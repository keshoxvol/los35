'use strict';

const http  = require('http');
const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const PORT    = process.env.API_PORT || 3000;
const CRM_URL = process.env.CRM_URL;

if (!CRM_URL) {
  console.error('Ошибка: не задан CRM_URL в .env');
  process.exit(1);
}

function mapModel(raw) {
  if (!raw) return 'UNDEFINED';
  if (raw.includes('Сохатый') || raw.includes('GX') || raw.includes('рубк')) return 'LOS_400_GX';
  if (raw.includes('400') || raw.includes('базов')) return 'LOS_400';
  return 'UNDEFINED';
}

function postToCrm(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const url  = new URL('/api/public/orders', CRM_URL);
    const lib  = url.protocol === 'https:' ? https : http;

    const req = lib.request({
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
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
        if (!phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Телефон обязателен' }));
          return;
        }

        const crm = await postToCrm({
          name:  name  || undefined,
          phone,
          model: mapModel(model),
          notes: comment || undefined
        });

        if (crm.status === 201) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } else {
          throw new Error(`CRM вернул ${crm.status}: ${crm.body}`);
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
