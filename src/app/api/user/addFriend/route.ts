import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()

    const user = await prisma.user.update({
      where: { telegramId },
      data: {
        balance: {
          increment: 5000
        }
      }
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
    console.error('Add friend error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}