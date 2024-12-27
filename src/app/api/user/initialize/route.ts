import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {},
      create: {
        telegramId,
        balance: BigInt(1000),
        username: '',
      },
    })

    const friends = await prisma.referral.findMany({
      where: { referrerId: user.id },
      include: {
        referred: true
      }
    })

    return NextResponse.json({
      success: true,
      balance: user.balance.toString(),
      friends: friends.map(f => ({
        username: f.referred.username,
        createdAt: f.createdAt
      }))
    })
  } catch (error) {
    console.error('Initialize error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}