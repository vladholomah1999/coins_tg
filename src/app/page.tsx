'use client'

import { useState, useEffect } from 'react'

interface TelegramUser {
 id: number
 first_name: string
 username?: string
}

export default function Home() {
 const [balance, setBalance] = useState<number>(0)
 const [telegramId, setTelegramId] = useState<string>('')
 const [username, setUsername] = useState<string>('Користувач')
 const [friends, setFriends] = useState<Array<{ username: string, createdAt: string }>>([])

 useEffect(() => {
   const initializeUser = async () => {
     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
       const tg = window.Telegram.WebApp
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
           }
         } catch (error) {
           console.error('Failed to initialize user:', error)
         }
       }
     }
   }

   initializeUser()
 }, [])

 const addFriend = async () => {
   if (!telegramId) return

   try {
     const response = await fetch('/api/user/addFriend', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ telegramId })
     })

     const data = await response.json()
     if (data.success) {
       setBalance(Number(data.balance))
       setFriends(data.friends || [])
     }
   } catch (error) {
     console.error('Failed to add friend:', error)
   }
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

       {/* Кнопка гаманця */}
       <button
         type="button"
         className="w-full p-4 bg-white rounded-lg shadow text-left font-medium hover:bg-gray-50 transition-colors"
         onClick={() => {
           console.log('Підключення гаманця...')
         }}
       >
         Підключити гаманець
       </button>

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