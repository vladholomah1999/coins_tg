import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId } = await req.json()

    const user = await prisma.user.update({
      where: { telegramId },
      data: { wallet: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wallet disconnection error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect wallet' },
      { status: 500 }
    )
  }
}