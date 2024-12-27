import { NextResponse } from 'next/server'
import bot from '@/lib/bot'

// Функція для обробки POST запитів від Telegram
export async function POST(req: Request) {
  try {
    console.log('Webhook: отримано POST запит')

    if (!req.body) {
      console.log('Webhook: тіло запиту відсутнє')
      return NextResponse.json(
        { error: 'No body provided' },
        { status: 400 }
      )
    }

    const update = await req.json()
    console.log('Webhook: отримано оновлення:', JSON.stringify(update, null, 2))

    await bot.handleUpdate(update)
    console.log('Webhook: оновлення оброблено успішно')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Функція для обробки GET запитів (перевірка роботи вебхука)
export async function GET() {
  console.log('Webhook: отримано GET запит')
  return NextResponse.json({
    status: 'Webhook is working',
    timestamp: new Date().toISOString()
  })
}