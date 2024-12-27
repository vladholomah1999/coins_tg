import { useEffect, useState } from 'react'

export const useTelegram = () => {
  const [telegramData, setTelegramData] = useState({
    id: '',
    username: '',
    ready: false
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      if (tg.initDataUnsafe?.user) {
        setTelegramData({
          id: tg.initDataUnsafe.user.id.toString(),
          username: tg.initDataUnsafe.user.first_name,
          ready: true
        })
      }
    }
  }, [])

  return telegramData
}