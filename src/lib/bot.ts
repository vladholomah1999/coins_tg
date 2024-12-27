import { Telegraf } from 'telegraf'
import { Message } from 'telegraf/types'
import prisma from './db'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!')
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// Базова URL вашого веб-додатку
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000'

// Команда /start
bot.command('start', async (ctx) => {
  const { id, first_name, username } = ctx.from

  try {
    // Створюємо або отримуємо користувача
    const user = await prisma.user.upsert({
      where: { telegramId: id.toString() },
      update: {},
      create: {
        telegramId: id.toString(),
        username: username || '',
        balance: BigInt(0)
      }
    })

    await ctx.reply(
      `Вітаю, ${first_name}! 👋\nПочніть майнити прямо зараз:`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '▶️ Почати майнінг', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    )
  } catch (error) {
    console.error('Start command error:', error)
    await ctx.reply('Сталася помилка. Спробуйте пізніше.')
  }
})

// Команда /help
bot.command('help', async (ctx) => {
  await ctx.reply(
    '💡 Доступні команди:\n\n' +
    '/start - Почати майнінг\n' +
    '/balance - Перевірити баланс\n' +
    '/referral - Отримати реферальне посилання\n' +
    '/help - Показати це повідомлення'
  )
})

// Команда /balance
bot.command('balance', async (ctx) => {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id.toString() }
    })

    if (!user) {
      return await ctx.reply('Спочатку потрібно запустити бота командою /start')
    }

    await ctx.reply(
      `💰 Ваш баланс:\n${user.balance.toString()} NOT`
    )
  } catch (error) {
    console.error('Balance command error:', error)
    await ctx.reply('Сталася помилка. Спробуйте пізніше.')
  }
})

// Обробка тексту
bot.on('text', async (ctx: { message: Message.TextMessage }) => {
  const text = ctx.message.text.toLowerCase()

  if (text === 'баланс') {
    return ctx.reply('Використайте команду /balance для перевірки балансу')
  }

  if (text === 'допомога') {
    return ctx.reply('Використайте команду /help для отримання списку команд')
  }

  await ctx.reply('Використайте команду /help для отримання списку доступних команд')
})

export default bot