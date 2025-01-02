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
        }) => Promise<{ address: string }>;
        sendData: (data: string) => void;
      };
    };
  }
}

export {};