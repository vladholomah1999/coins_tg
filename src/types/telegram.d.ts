declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        showAlert: (message: string) => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
        openTonWallet: (params: {
          address: string;
          amount?: string;
          comment?: string;
          payload?: string;
        }) => Promise<{
          address: string;
          transaction?: string;
        }>;
        sendData: (data: string) => void;
      };
    };
  }
}

export {};