import React, { useState, useEffect } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import Exchange from './components/Exchange';
import Settings from './components/Settings';
import Boost from './components/Boost';
import Levels from './components/Levels';
import Card from './components/Card';
import { BoostProvider } from './BoostContext';
import { EnergyProvider, useEnergy } from './EnergyContext';
import Earn from './components/Earn';
import Friends from './components/Friends';
import { useTelegram } from './hooks/useTelegram';
import { getUserData, updateUserCoins, updateUserLevel } from './api';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('mine');
  const [selectedExchange, setSelectedExchange] = useState({
    name: 'Holmah',
    logo: '/images/holmah.png'
  });

  // Модифікований стан для балансу з підтримкою синхронізації
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('userScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  const [multitapLevel, setMultitapLevel] = useState(() => {
    const savedLevel = localStorage.getItem('multitapLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });

  const [energyRecoveryRate, setLocalEnergyRecoveryRate] = useState(() => {
    const savedRate = localStorage.getItem('energyRecoveryRate');
    return savedRate ? parseInt(savedRate, 10) : 5;
  });

  const { maxEnergy, setMaxEnergy, refillEnergy, setEnergyRecoveryRate } = useEnergy();
  const [rewardsReceived, setRewardsReceived] = useState(false);
  const [lastRewardLevel, setLastRewardLevel] = useState(() => {
    return localStorage.getItem('lastRewardLevel') || '';
  });

  const { tg } = useTelegram();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Функція для синхронізації балансу з БД з дебаунсингом
  const syncBalanceWithDB = async (newBalance: number) => {
    if (isUpdating) return;

    const userId = tg?.initDataUnsafe?.user?.id?.toString() || localStorage.getItem('userId');
    if (!userId) return;

    setIsUpdating(true);
    try {
      const difference = newBalance - score;
      await updateUserCoins(userId, difference);
      console.log('Balance synchronized with database:', newBalance);
    } catch (error) {
      console.error('Error synchronizing balance:', error);
      // Повертаємо попереднє значення у випадку помилки
      setScore(score);
      localStorage.setItem('userScore', score.toString());
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    console.log('AppContent mounted');
    console.log('Telegram WebApp:', tg);

    const initializeUser = async () => {
      const userId = tg?.initDataUnsafe?.user?.id?.toString() || localStorage.getItem('userId');
      if (userId && !isInitialized) {
        try {
          const userData = await getUserData(userId);
          console.log('User data received:', userData);

          // Оновлюємо локальний стан з даними з бази
          const dbScore = parseInt(userData.coins);
          setScore(dbScore);
          localStorage.setItem('userScore', dbScore.toString());

          // Завантажуємо інші налаштування
          const savedMultitapLevel = localStorage.getItem('multitapLevel');
          const savedMaxEnergy = localStorage.getItem('maxEnergy');
          const savedEnergyRecoveryRate = localStorage.getItem('energyRecoveryRate');

          setMultitapLevel(savedMultitapLevel ? parseInt(savedMultitapLevel) : 1);
          setMaxEnergy(savedMaxEnergy ? parseInt(savedMaxEnergy) : 1500);
          setLocalEnergyRecoveryRate(savedEnergyRecoveryRate ? parseInt(savedEnergyRecoveryRate) : 5);
          setEnergyRecoveryRate(savedEnergyRecoveryRate ? parseInt(savedEnergyRecoveryRate) : 5);

          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
    };

    initializeUser();
  }, [tg, setMaxEnergy, setEnergyRecoveryRate, isInitialized]);

  const handleScoreChange = async (increment: number) => {
    if (isUpdating) return;

    setScore(prevScore => {
      const newScore = prevScore + increment;
      localStorage.setItem('userScore', newScore.toString());

      // Запускаємо синхронізацію з невеликою затримкою для уникнення частих оновлень
      const timeoutId = setTimeout(() => {
        syncBalanceWithDB(newScore);
      }, 1000);

      return newScore;
    });
  };

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
  };

  const handleBinanceClick = () => {
    setCurrentView('exchange');
  };

  const handleExchangeSelect = (exchangeName: string) => {
    const newExchange = {
      name: exchangeName,
      logo: exchangeName === 'Holmah'
        ? '/images/holmah.png'
        : `/images/${exchangeName.toLowerCase()}${exchangeName === 'Binance' ? '-logo' : ''}.png`
    };
    setSelectedExchange(newExchange);
    setCurrentView('mine');
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleMultitapUpgrade = async (level: number, cost: number) => {
    if (score >= cost && !isUpdating) {
      setScore(prevScore => {
        const newScore = prevScore - cost;
        localStorage.setItem('userScore', newScore.toString());
        syncBalanceWithDB(newScore);
        return newScore;
      });
      setMultitapLevel(level);
      localStorage.setItem('multitapLevel', level.toString());
    }
  };

  const handleEnergyBoostUpgrade = async (newMaxEnergy: number, cost: number) => {
    if (score >= cost && !isUpdating) {
      setScore(prevScore => {
        const newScore = prevScore - cost;
        localStorage.setItem('userScore', newScore.toString());
        syncBalanceWithDB(newScore);
        return newScore;
      });
      setMaxEnergy(newMaxEnergy);
      localStorage.setItem('maxEnergy', newMaxEnergy.toString());
      refillEnergy();
    }
  };

  const handleEnergyRecoveryUpgrade = async (newRate: number, cost: number) => {
    if (score >= cost && !isUpdating) {
      setScore(prevScore => {
        const newScore = prevScore - cost;
        localStorage.setItem('userScore', newScore.toString());
        syncBalanceWithDB(newScore);
        return newScore;
      });
      setLocalEnergyRecoveryRate(newRate);
      setEnergyRecoveryRate(newRate);
      localStorage.setItem('energyRecoveryRate', newRate.toString());
    }
  };

  const getLevelInfo = (score: number) => {
    if (score < 5000) return { name: 'Silver', reward: 1000 };
    if (score < 25000) return { name: 'Gold', reward: 10000 };
    if (score < 100000) return { name: 'Platinum', reward: 15000 };
    if (score < 1000000) return { name: 'Diamond', reward: 30000 };
    if (score < 2000000) return { name: 'Epic', reward: 50000 };
    return { name: 'Legendary', reward: 5000000 };
  };

  const handleRewardsClick = async () => {
    if (!rewardsReceived && !isUpdating) {
      const currentLevel = getLevelInfo(score);
      setScore(prevScore => {
        const newScore = prevScore + currentLevel.reward;
        localStorage.setItem('userScore', newScore.toString());
        syncBalanceWithDB(newScore);
        return newScore;
      });
      setRewardsReceived(true);
      setLastRewardLevel(currentLevel.name);
      localStorage.setItem('lastRewardLevel', currentLevel.name);

      // Оновлюємо рівень у базі даних
      const userId = tg?.initDataUnsafe?.user?.id?.toString() || localStorage.getItem('userId');
      if (userId) {
        try {
          await updateUserLevel(userId, currentLevel.name);
        } catch (error) {
          console.error('Error updating user level:', error);
        }
      }
    }
  };

  useEffect(() => {
    const currentLevel = getLevelInfo(score);
    if (currentLevel.name !== lastRewardLevel) {
      setRewardsReceived(false);
    }
  }, [score, lastRewardLevel]);

  const renderView = () => {
    switch(currentView) {
      case 'levels':
        return <Levels />;
      case 'settings':
        return <Settings />;
      case 'exchange':
        return <Exchange
          onExchangeSelect={handleExchangeSelect}
          selectedExchange={selectedExchange.name}
          onScoreChange={handleScoreChange}
          balance={score}
        />;
      case 'friends':
        return <Friends />;
      case 'boost':
        return <Boost
          balance={score}
          setCurrentView={setCurrentView}
          onMultitapUpgrade={handleMultitapUpgrade}
          onEnergyBoostUpgrade={handleEnergyBoostUpgrade}
          onEnergyRecoveryUpgrade={handleEnergyRecoveryUpgrade}
          currentLevel={multitapLevel}
          currentMaxEnergy={maxEnergy}
          currentEnergyRecoveryRate={energyRecoveryRate}
          onRewardsClick={handleRewardsClick}
          rewardsReceived={rewardsReceived}
        />;
      case 'earn':
        return <Earn />;
      case 'card':
        return <Card
          balance={score}
          activeMenuItem={currentView}
          onMenuItemClick={handleMenuItemClick}
        />;
      case 'mine':
      default:
        return <Clicker
          onBinanceClick={handleBinanceClick}
          selectedExchange={selectedExchange}
          onSettingsClick={handleSettingsClick}
          score={score}
          onScoreChange={handleScoreChange}
          onLevelClick={() => setCurrentView('levels')}
          multitapLevel={multitapLevel}
        />;
    }
  };

  return (
    <div className="App">
      <div className="game-interface">
        {renderView()}
        {currentView !== 'card' && (
          <BottomMenu activeItem={currentView} onMenuItemClick={handleMenuItemClick} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BoostProvider>
      <EnergyProvider>
        <AppContent />
      </EnergyProvider>
    </BoostProvider>
  );
}

export default App;