import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Константи
const INITIAL_ENERGY = 1500;
const INITIAL_REFILL_COUNT = 3;
const REFILL_COOLDOWN = 60; // в секундах
const INITIAL_RECOVERY_RATE = 5000; // в мілісекундах

type EnergyContextType = {
  energy: number;
  maxEnergy: number;
  energyRefillCount: number;
  energyRefillCooldown: number;
  energyRecoveryRate: number;
  activateEnergyRefill: () => void;
  decreaseEnergy: (amount?: number) => void;
  setMaxEnergy: (newMaxEnergy: number) => void;
  refillEnergy: () => void;
  setEnergyRecoveryRate: (newRate: number) => void;
  setEnergyRefillCount: React.Dispatch<React.SetStateAction<number>>;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

type EnergyProviderProps = {
  children: React.ReactNode;
}

export const EnergyProvider: React.FC<EnergyProviderProps> = ({ children }) => {
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : INITIAL_ENERGY;
  });

  const [maxEnergy, setMaxEnergy] = useState(() => {
    const savedMaxEnergy = localStorage.getItem('maxEnergy');
    return savedMaxEnergy ? parseInt(savedMaxEnergy, 10) : INITIAL_ENERGY;
  });

  const [energyRefillCount, setEnergyRefillCount] = useState(() => {
    const savedCount = localStorage.getItem('energyRefillCount');
    const lastActivation = localStorage.getItem('energyLastActivation');

    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed >= REFILL_COOLDOWN) {
        localStorage.removeItem('energyLastActivation');
        return INITIAL_REFILL_COUNT;
      }
    }
    return savedCount ? parseInt(savedCount, 10) : INITIAL_REFILL_COUNT;
  });

  const [energyRefillCooldown, setEnergyRefillCooldown] = useState(() => {
    const lastActivation = localStorage.getItem('energyLastActivation');
    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed < REFILL_COOLDOWN) {
        return Math.max(REFILL_COOLDOWN - Math.floor(timePassed), 0);
      }
    }
    return 0;
  });

  const [energyRecoveryRate, setEnergyRecoveryRate] = useState(() => {
    const savedRate = localStorage.getItem('energyRecoveryRate');
    return savedRate ? parseInt(savedRate, 10) : INITIAL_RECOVERY_RATE;
  });

  // Зберігання стану в localStorage
  useEffect(() => {
    localStorage.setItem('energy', energy.toString());
  }, [energy]);

  useEffect(() => {
    localStorage.setItem('maxEnergy', maxEnergy.toString());
  }, [maxEnergy]);

  useEffect(() => {
    localStorage.setItem('energyRefillCount', energyRefillCount.toString());
  }, [energyRefillCount]);

  useEffect(() => {
    localStorage.setItem('energyRecoveryRate', energyRecoveryRate.toString());
  }, [energyRecoveryRate]);

  // Активація поповнення енергії
  const activateEnergyRefill = useCallback(() => {
    if (energyRefillCount > 0 && energyRefillCooldown === 0) {
      setEnergyRefillCount(prev => prev - 1);
      setEnergy(maxEnergy);
      console.log('Energy refilled');

      if (energyRefillCount === 1) {
        setEnergyRefillCooldown(REFILL_COOLDOWN);
        localStorage.setItem('energyLastActivation', Date.now().toString());
      }
    }
  }, [energyRefillCount, energyRefillCooldown, maxEnergy]);

  // Зменшення енергії
  const decreaseEnergy = useCallback((amount: number = 1) => {
    setEnergy(prev => Math.max(prev - amount, 0));
  }, []);

  // Автоматичне відновлення енергії
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => {
        const newEnergy = Math.min(prev + 1, maxEnergy);
        localStorage.setItem('energy', newEnergy.toString());
        return newEnergy;
      });
    }, energyRecoveryRate);

    return () => clearInterval(interval);
  }, [maxEnergy, energyRecoveryRate]);

  // Повне поповнення енергії
  const refillEnergy = useCallback(() => {
    setEnergy(maxEnergy);
    localStorage.setItem('energy', maxEnergy.toString());
  }, [maxEnergy]);

  // Оновлення максимальної енергії
  const updateMaxEnergy = useCallback((newMaxEnergy: number) => {
    setMaxEnergy(newMaxEnergy);
    setEnergy(newMaxEnergy);
    localStorage.setItem('maxEnergy', newMaxEnergy.toString());
    localStorage.setItem('energy', newMaxEnergy.toString());
  }, []);

  // Оновлення швидкості відновлення
  const updateEnergyRecoveryRate = useCallback((newRate: number) => {
    setEnergyRecoveryRate(newRate);
    localStorage.setItem('energyRecoveryRate', newRate.toString());
  }, []);

  // Обробка кулдауну поповнення енергії
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (energyRefillCooldown > 0) {
      interval = setInterval(() => {
        setEnergyRefillCooldown(prev => {
          if (prev === 1) {
            setEnergyRefillCount(INITIAL_REFILL_COUNT);
            localStorage.removeItem('energyLastActivation');
            console.log('Energy refill cooldown finished, attempts reset to 3');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [energyRefillCooldown]);

  const value = {
    energy,
    maxEnergy,
    energyRefillCount,
    energyRefillCooldown,
    energyRecoveryRate,
    activateEnergyRefill,
    decreaseEnergy,
    setMaxEnergy: updateMaxEnergy,
    refillEnergy,
    setEnergyRecoveryRate: updateEnergyRecoveryRate,
    setEnergyRefillCount
  };

  return (
    <EnergyContext.Provider value={value}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = (): EnergyContextType => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};

export default EnergyProvider;