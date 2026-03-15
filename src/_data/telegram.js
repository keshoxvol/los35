require('dotenv').config();
module.exports = {
  token: process.env.TG_TOKEN || '',
  chat: process.env.TG_CHAT || ''
};
