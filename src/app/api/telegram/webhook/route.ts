import { NextResponse } from 'next/server'
import bot from '@/lib/bot'

// Секретний шлях для вебхуків
const secretPath = `/api/telegram/webhook/${process.env.TELEGRAM_BOT_TOKEN}`

export async function POST(req: Request) {
  try {
    if (req.url.endsWith(secretPath)) {
      const update = await req.json()
      await bot.handleUpdate(update)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json(
      { error: 'Invalid secret path' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}