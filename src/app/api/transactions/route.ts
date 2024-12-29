import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { telegramId, amount, transactionHash } = await req.json()

    await prisma.$transaction(async (tx) => {
      // Створюємо транзакцію
      await tx.transaction.create({
        data: {
          user: {
            connect: { telegramId }
          },
          amount,
          type: 'PURCHASE',
          status: 'COMPLETED',
          transactionHash
        }
      })

      // Оновлюємо баланс користувача
      const user = await tx.user.update({
        where: { telegramId },
        data: {
          balance: {
            increment: BigInt(amount * 100000)
          }
        }
      })

      return user
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Transaction failed' },
      { status: 500 }
    )
  }
}