declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        showAlert: (message: string) => void
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            username?: string
          }
        }
      }
    }
    ton?: {
      send: (method: string, params: any) => Promise<{
        hash: string
      }>
      connect: () => Promise<{
        address: string
      }>
    }
  }
}

export {}