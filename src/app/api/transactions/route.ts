import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { PrismaClient, Transaction, User } from '@prisma/client'

interface TransactionResult {
  user: User;
  transaction: Transaction;
}

export async function POST(req: Request) {
  try {
    const { telegramId, amount, transactionHash } = await req.json()

    const result = await prisma.$transaction<TransactionResult>(async (tx) => {
      // Знаходимо користувача
      const user = await prisma.user.findUnique({
        where: { telegramId }
      })

      if (!user) {
        throw new Error('Користувача не знайдено')
      }

      // Створюємо транзакцію
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount,
          type: 'PURCHASE',
          status: 'COMPLETED',
          transactionHash
        }
      })

      // Оновлюємо баланс користувача
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: {
            increment: BigInt(amount * 100000)
          }
        }
      })

      return { user: updatedUser, transaction }
    })

    return NextResponse.json({
      success: true,
      balance: result.user.balance.toString(),
      transaction: result.transaction
    })
  } catch (error) {
    console.error('Помилка транзакції:', error)
    return NextResponse.json(
      { error: 'Помилка обробки транзакції' },
      { status: 500 }
    )
  }
}