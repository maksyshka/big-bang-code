require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_Token);
bot.start((ctx) =>
  ctx.reply(
    `Привет ${ctx.message.from.first_name}, узнай статистику по коронавирусу. Введи на английском назвние страны и получи статистику. Посмотреть весь список стран можно, введя команду /help
`,
    Markup.keyboard([
      ['US', 'Russia'],
      ['China', 'Ukraine'],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = `
Страна: ${data[0][0].country} 
Случаи: ${data[0][0].cases}
Смерти: ${data[0][0].deaths}
Вылечилось: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    ctx.reply('Ошибка, такой страны не существует, посмотрите /help');
  }
});
bot.launch();
console.log('Бот запущен');
