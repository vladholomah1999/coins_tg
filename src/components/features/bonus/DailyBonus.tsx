import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { DAILY_STREAK_BONUSES } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { telegramId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Перевіряємо чи можна отримати бонус
    const lastBonus = user.lastBonus
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (lastBonus) {
      const lastBonusDate = new Date(lastBonus)
      const yesterdayDate = new Date(today)
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)

      // Якщо останній бонус був не вчора, скидаємо стрік
      if (lastBonusDate < yesterdayDate) {
        user.dailyStreak = 0
      }

      // Якщо бонус вже отримано сьогодні
      if (lastBonusDate >= today) {
        return NextResponse.json({
          error: 'Daily bonus already claimed'
        }, { status: 400 })
      }
    }

    const streakIndex = Math.min(user.dailyStreak, DAILY_STREAK_BONUSES.length - 1)
    const bonusAmount = DAILY_STREAK_BONUSES[streakIndex]

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { increment: bonusAmount },
        lastBonus: new Date(),
        dailyStreak: { increment: 1 }
      }
    })

    return NextResponse.json({
      success: true,
      bonusAmount,
      newBalance: updatedUser.balance.toString(),
      newStreak: updatedUser.dailyStreak
    })
  } catch (error) {
    console.error('Daily bonus error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}