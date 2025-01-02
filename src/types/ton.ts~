export interface TonWallet {
  send: (method: string, params: any) => Promise<{ hash: string }>
  connect: () => Promise<{ address: string }>
}

declare global {
  interface Window {
    ton?: TonWallet
  }
}