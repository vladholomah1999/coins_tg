import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

const MIN_COINS = 10
const MAX_COINS = 50

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      )
    }

    // Випадкова кількість монет
    const minedCoins = Math.floor(
      Math.random() * (MAX_COINS - MIN_COINS + 1) + MIN_COINS
    )

    // Оновлюємо баланс користувача
    const user = await prisma.user.update({
      where: { telegramId },
      data: {
        balance: {
          increment: minedCoins
        }
      }
    })

    return NextResponse.json({
      success: true,
      minedCoins,
      newBalance: user.balance
    })
  } catch (error) {
    console.error('Mining error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}