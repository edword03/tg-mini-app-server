const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()


const token = process.env.TOKEN;
const apiUrl = process.env.API_URL;

const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/getcat/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await fetch(apiUrl).then(res => res.json());

  bot.sendPhoto(chatId, resp[0].url)
})


bot.on('inline_query', async(msg) => {
  const resp = await fetch(`${apiUrl}?limit=10`, {
    cache: 'no-store',

  }).then(res => res.json());

  const answers = resp.map(obj => ({
    type: 'photo',
    id: obj.id,
    photo_url: obj.url,
    thumbnail_url: obj.url,
    photo_width: obj.width,
    photo_height: obj.height
  }));


  await bot.answerInlineQuery(msg.id, answers)
})
