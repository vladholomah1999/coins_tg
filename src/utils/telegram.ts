export const initTelegram = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    return tg
  }
  return null
}

export const getTelegramUser = () => {
  const tg = initTelegram()
  if (tg?.initDataUnsafe?.user) {
    return {
      id: tg.initDataUnsafe.user.id.toString(),
      username: tg.initDataUnsafe.user.first_name,
      lastName: tg.initDataUnsafe.user.last_name
    }
  }
  return null
}