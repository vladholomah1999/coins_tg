import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const referralCode = searchParams.get('code')

  if (!referralCode) {
    return NextResponse.json({ error: 'Referral code required' }, { status: 400 })
  }

  try {
    const referral = await prisma.referral.findUnique({
      where: { id: parseInt(referralCode) },
      include: { referrer: true }
    })

    if (!referral) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      referrerUsername: referral.referrer.username
    })
  } catch (error) {
    console.error('Check referral error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}