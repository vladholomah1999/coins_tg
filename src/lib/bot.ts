import { Telegraf } from 'telegraf'
import prisma from './db'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!')
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000'

// Додаємо логування для відстеження роботи бота
bot.use(async (ctx, next) => {
  console.log('Отримано оновлення:', JSON.stringify(ctx.update, null, 2))
  await next()
})

// Команда для перевірки роботи бота
bot.command('ping', async (ctx) => {
  await ctx.reply('pong')
})

// Команда /start
bot.command('start', async (ctx) => {
  try {
    console.log('Отримано команду /start')
    const { id, first_name, username } = ctx.from || {}
    if (!id) {
      console.log('ID користувача відсутній')
      return
    }

    console.log('Створення користувача:', { id, first_name, username })

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

    console.log('Користувача створено/оновлено:', user)

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
  try {
    console.log('Отримано команду /help')
    await ctx.reply(
      '💡 Доступні команди:\n\n' +
      '/start - Почати майнінг\n' +
      '/balance - Перевірити баланс\n' +
      '/referral - Отримати реферальне посилання\n' +
      '/help - Показати це повідомлення'
    )
  } catch (error) {
    console.error('Help command error:', error)
    await ctx.reply('Сталася помилка. Спробуйте пізніше.')
  }
})

// Команда /balance
bot.command('balance', async (ctx) => {
  try {
    console.log('Отримано команду /balance')
    const telegramId = ctx.from?.id.toString()
    if (!telegramId) {
      console.log('ID користувача відсутній')
      return
    }

    const user = await prisma.user.findUnique({
      where: { telegramId }
    })

    console.log('Знайдено користувача:', user)

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
    console.log('Отримано текстове повідомлення:', ctx.message.text)
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

// Обробка помилок
bot.catch((err, ctx) => {
  console.error(`Помилка для ${ctx.updateType}:`, err)
})

export default bot