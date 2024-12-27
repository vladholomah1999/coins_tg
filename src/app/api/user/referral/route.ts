import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { FRIEND_BONUS } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const { referrerId, referredId } = await req.json()

    // Перевіряємо чи існують користувачі
    const [referrer, referred] = await Promise.all([
      prisma.user.findUnique({ where: { telegramId: referrerId } }),
      prisma.user.findUnique({ where: { telegramId: referredId } })
    ])

    if (!referrer || !referred) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Перевіряємо чи не існує вже такого реферала
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        referredId: referred.id
      }
    })

    if (existingReferral) {
      return NextResponse.json({ error: 'Referral already exists' }, { status: 400 })
    }

    // Створюємо новий реферал і нараховуємо бонус
    const [referral, updatedReferrer] = await prisma.$transaction([
      prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: referred.id,
          claimed: true
        }
      }),
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          balance: { increment: FRIEND_BONUS }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      newBalance: updatedReferrer.balance.toString(),
      referral
    })
  } catch (error) {
    console.error('Referral error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}