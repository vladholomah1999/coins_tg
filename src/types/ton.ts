export interface TonWalletResult {
  address: string;
  transaction?: string;
}

declare global {
  interface Window {
    ton?: {
      send: (method: string, params: any) => Promise<any>;
      connect: () => Promise<{ address: string }>;
    };
  }
}