'use client'

import { useState, useEffect } from 'react'
import { TonConnector } from '@/components/features/wallet/TonConnector'
import { TransactionButton } from '@/components/features/wallet/TransactionButton'
import { getTelegramWebApp, showAlert } from '@/lib/telegram'

interface TelegramUser {
 id: number
 first_name: string
 username?: string
}

interface Friend {
 username: string
 createdAt: string
}

interface Transaction {
 status: string
 amount: number
 type: string
 createdAt: string
}

export default function Home() {
 const [balance, setBalance] = useState<number>(0)
 const [telegramId, setTelegramId] = useState<string>('')
 const [username, setUsername] = useState<string>('Користувач')
 const [friends, setFriends] = useState<Friend[]>([])
 const [walletAddress, setWalletAddress] = useState<string>('')
 const [isTransacting, setIsTransacting] = useState<boolean>(false)
 const [transactions, setTransactions] = useState<Transaction[]>([])

 useEffect(() => {
   const initializeUser = async () => {
     const tg = getTelegramWebApp()
     if (!tg) return

     tg.ready()
     tg.expand()

     const userData = tg.initDataUnsafe.user as TelegramUser | undefined
     if (userData?.id) {
       try {
         const response = await fetch('/api/user/initialize', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             telegramId: userData.id.toString(),
             username: userData.first_name || ''
           })
         })

         const data = await response.json()
         if (data.success) {
           setTelegramId(userData.id.toString())
           setUsername(userData.first_name)
           setBalance(Number(data.balance))
           setFriends(data.friends || [])
           if (data.wallet) {
             setWalletAddress(data.wallet)
           }
         }
       } catch (error) {
         console.error('Failed to initialize user:', error)
       }
     }
   }

   initializeUser()
 }, [])

 const handleWalletConnect = (address: string): void => {
   if (!telegramId) return

   fetch('/api/wallet/connect', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ telegramId, walletAddress: address })
   })
     .then(response => response.json())
     .then(data => {
       if (data.success) {
         setWalletAddress(address)
       }
     })
     .catch(console.error)
 }

 const handleWalletDisconnect = (): void => {
   if (!telegramId) return

   fetch('/api/wallet/disconnect', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ telegramId })
   })
     .then(response => response.json())
     .then(data => {
       if (data.success) {
         setWalletAddress('')
       }
     })
     .catch(console.error)
 }

 const handleTransaction = async (): Promise<void> => {
   const tg = getTelegramWebApp()
   if (!walletAddress || !telegramId || !tg) return

   setIsTransacting(true)
   try {
     const result = await tg.openTonWallet({
       address: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS || '',
       amount: '1000000000',
       comment: 'Покупка NOT токенів'
     })

     if (result.transaction) {
       const response = await fetch('/api/transactions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           telegramId,
           amount: 1,
           transactionHash: result.transaction
         })
       })

       const data = await response.json()
       if (data.success) {
         setBalance(Number(data.newBalance))
         showAlert('Успішна покупка! Ви отримали 100,000 NOT')
       }
     }
   } catch (error) {
     console.error('Transaction failed:', error)
     showAlert('Помилка транзакції. Спробуйте ще раз')
   } finally {
     setIsTransacting(false)
   }
 }

 const addFriend = (): void => {
   if (!telegramId) return

   fetch('/api/user/addFriend', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ telegramId })
   })
     .then(response => response.json())
     .then(data => {
       if (data.success) {
         setBalance(Number(data.balance))
         setFriends(data.friends || [])
       }
     })
     .catch(console.error)
 }

 return (
   <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
     <div className="w-full max-w-md space-y-4">
       {/* Профіль користувача */}
       <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
         <div className="flex items-center space-x-3">
           <div className="w-12 h-12 rounded-full bg-gray-200" />
           <div>
             <h2 className="font-semibold">{username}</h2>
             <p className="text-sm text-gray-500">Місячний план</p>
           </div>
         </div>
         <span className="text-blue-500">Telegram</span>
       </div>

       {/* Баланс */}
       <div className="p-4 bg-white rounded-lg shadow">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
               N
             </div>
             <span className="font-semibold">NOT</span>
           </div>
           <span className="font-bold">{balance}</span>
         </div>
         <p className="text-right text-gray-500 text-sm">{((balance/1000) * 9.17).toFixed(2)}$</p>
       </div>

       {/* Гаманець і транзакції */}
       <div className="space-y-2">
         <TonConnector
           onConnect={handleWalletConnect}
           onDisconnect={handleWalletDisconnect}
         />
         {walletAddress && (
           <TransactionButton
             amount={100000}
             onTransaction={handleTransaction}
             disabled={isTransacting}
           />
         )}
       </div>

       {/* Транзакції */}
       {transactions.length > 0 && (
         <div className="p-4 bg-white rounded-lg shadow">
           <h3 className="font-semibold mb-4">Останні транзакції</h3>
           <div className="space-y-2">
             {transactions.map((tx, index) => (
               <div
                 key={index}
                 className="flex justify-between items-center p-2 bg-gray-50 rounded"
               >
                 <div>
                   <p className="font-medium">
                     {tx.type === 'PURCHASE' ? 'Покупка' : 'Бонус'}
                   </p>
                   <p className="text-sm text-gray-500">
                     {new Date(tx.createdAt).toLocaleString()}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-green-500">
                     +{tx.amount * 100000} NOT
                   </p>
                   <p className="text-sm text-gray-500">
                     {tx.amount} TON
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Кнопка завдань */}
       <button
         type="button"
         className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors flex justify-between items-center"
         onClick={() => {
           console.log('Відкриття завдань...')
         }}
       >
         <span>Перейти до завдань</span>
         <span className="text-gray-400">→</span>
       </button>

       {/* Бонусний календар */}
       <div className="p-4 bg-white rounded-lg shadow">
         <div className="grid grid-cols-7 gap-2 mb-2">
           {Array.from({ length: 7 }).map((_, i) => (
             <div
               key={i}
               className="aspect-square rounded-full border-2 border-gray-200 flex items-center justify-center"
             />
           ))}
         </div>
         <p className="text-center text-blue-500 text-sm">BONUS</p>
       </div>

       {/* Список друзів */}
       <div className="p-4 bg-white rounded-lg shadow">
         <h3 className="font-semibold mb-4">Мої друзі</h3>
         <div className="space-y-3">
           {friends.map((friend, index) => (
             <div key={index} className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-200" />
               <div>
                 <p className="font-medium">{friend.username}</p>
                 <p className="text-sm text-gray-500">
                   Приєднався {new Date(friend.createdAt).toLocaleDateString()}
                 </p>
               </div>
             </div>
           ))}
         </div>
       </div>

       {/* Кнопка додавання друга */}
       <button
         type="button"
         className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
         onClick={addFriend}
       >
         Додати друга (+5000 NOT)
       </button>
     </div>
   </main>
 )
}