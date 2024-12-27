import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const count = await prisma.user.count()
    return NextResponse.json({
      status: 'success',
      userCount: count
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed'
    }, { status: 500 })
  }
}