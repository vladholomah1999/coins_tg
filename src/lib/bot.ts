import { Telegraf } from 'telegraf'
import prisma from './db'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!')
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000'

// Команда /start
bot.command('start', async (ctx) => {
  try {
    const { id, first_name, username } = ctx.from || {}
    if (!id) return

    // Створюємо або отримуємо користувача
    await prisma.user.upsert({
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
    const telegramId = ctx.from?.id.toString()
    if (!telegramId) return

    const user = await prisma.user.findUnique({
      where: { telegramId }
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

// Обробка текстових повідомлень
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text.toLowerCase()

    if (text === 'баланс') {
      await ctx.reply('Використайте команду /balance для перевірки балансу')
      return
    }

    if (text === 'допомога') {
      await ctx.reply('Використайте команду /help для отримання списку команд')
      return
    }

    await ctx.reply('Використайте команду /help для отримання списку доступних команд')
  } catch (error) {
    console.error('Text handler error:', error)
  }
})

export default bot