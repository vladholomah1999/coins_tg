import { Telegraf } from 'telegraf'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!')
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

export default bot