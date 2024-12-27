import { NextResponse } from 'next/server'
import bot from '@/lib/bot'

// Отримуємо оновлення від Telegram
export async function POST(req: Request) {
  try {
    console.log('Отримано вебхук від Telegram')

    const update = await req.json()
    console.log('Дані оновлення:', JSON.stringify(update, null, 2))

    // Обробляємо оновлення
    await bot.handleUpdate(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Помилка обробки вебхука:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Перевірка роботи вебхука
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint is working' })
}