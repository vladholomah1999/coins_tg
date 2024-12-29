import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()

    // Спочатку перевіряємо чи існує користувач
    let user = await prisma.user.findUnique({
      where: { telegramId }
    })

    // Якщо користувача немає, створюємо його
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId,
          balance: BigInt(0),
          username: '',
        }
      })
    }

    // Оновлюємо баланс користувача
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: {
          increment: 5000 // бонус за друга
        }
      }
    })

    // Отримуємо список друзів
    const friends = await prisma.referral.findMany({
      where: { referrerId: user.id },
      include: {
        referred: true
      }
    })

    return NextResponse.json({
      success: true,
      balance: updatedUser.balance.toString(),
      friends: friends.map(f => ({
        username: f.referred.username,
        createdAt: f.createdAt
      }))
    })
  } catch (error) {
    console.error('Add friend error:', error)
    return NextResponse.json(
      { error: 'Failed to add friend' },
      { status: 500 }
    )
  }
}