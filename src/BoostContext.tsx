import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

type BoostContextType = {
  turboCount: number;
  turboTimer: number;
  cooldownTimer: number;
  isTurboActive: boolean;
  activateTurbo: () => void;
  setTurboCount: React.Dispatch<React.SetStateAction<number>>;
}

const BoostContext = createContext<BoostContextType | undefined>(undefined);

type BoostProviderProps = {
  children: React.ReactNode;
}

export const BoostProvider: React.FC<BoostProviderProps> = ({ children }) => {
  const [turboCount, setTurboCount] = useState(() => {
    const savedTurboCount = localStorage.getItem('turboCount');
    const lastActivation = localStorage.getItem('turboLastActivation');

    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed >= 60) {
        localStorage.removeItem('turboLastActivation');
        return 3;
      }
    }
    return savedTurboCount ? parseInt(savedTurboCount, 10) : 3;
  });

  const [turboTimer, setTurboTimer] = useState(0);
  const [cooldownTimer, setCooldownTimer] = useState(() => {
    const lastActivation = localStorage.getItem('turboLastActivation');
    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed < 60) {
        return Math.max(60 - Math.floor(timePassed), 0);
      }
    }
    return 0;
  });

  const [isTurboActive, setIsTurboActive] = useState(false);

  // Зберігання turboCount в localStorage
  useEffect(() => {
    localStorage.setItem('turboCount', turboCount.toString());
  }, [turboCount]);

  const activateTurbo = useCallback(() => {
    if (turboCount > 0 && turboTimer === 0 && cooldownTimer === 0) {
      setTurboCount(prev => prev - 1);
      setTurboTimer(20);
      setIsTurboActive(true);
      console.log('Turbo activated');

      if (turboCount === 1) {
        localStorage.setItem('turboLastActivation', Date.now().toString());
      }
    }
  }, [turboCount, turboTimer, cooldownTimer]);

  // Ефект для обробки таймерів
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (turboTimer > 0) {
      interval = setInterval(() => {
        setTurboTimer(prev => {
          if (prev === 1) {
            setIsTurboActive(false);
            console.log('Turbo deactivated');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev === 1) {
            setTurboCount(3);
            localStorage.removeItem('turboLastActivation');
            console.log('Cooldown finished, attempts reset to 3');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [turboTimer, cooldownTimer]);

  // Ефект для запуску кулдауну
  useEffect(() => {
    if (turboCount === 0 && turboTimer === 0 && cooldownTimer === 0) {
      setCooldownTimer(60);
      console.log('Starting cooldown');
    }
  }, [turboCount, turboTimer, cooldownTimer]);

  // Синхронізація з localStorage при зміні стану
  useEffect(() => {
    const syncToLocalStorage = () => {
      if (turboCount < 3) {
        localStorage.setItem('turboLastActivation', Date.now().toString());
      } else {
        localStorage.removeItem('turboLastActivation');
      }
      localStorage.setItem('turboCount', turboCount.toString());
    };

    syncToLocalStorage();
  }, [turboCount]);

  const value = {
    turboCount,
    turboTimer,
    cooldownTimer,
    isTurboActive,
    activateTurbo,
    setTurboCount
  };

  return (
    <BoostContext.Provider value={value}>
      {children}
    </BoostContext.Provider>
  );
};

export const useBoost = (): BoostContextType => {
  const context = useContext(BoostContext);
  if (context === undefined) {
    throw new Error('useBoost must be used within a BoostProvider');
  }
  return context;
};

// Додаємо експорт за замовчуванням
export default BoostProvider;