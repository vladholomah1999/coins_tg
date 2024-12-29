import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId, walletAddress } = await req.json()

    const user = await prisma.user.update({
      where: { telegramId },
      data: { wallet: walletAddress }
    })

    return NextResponse.json({
      success: true,
      wallet: user.wallet
    })
  } catch (error) {
    console.error('Wallet connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    )
  }
}