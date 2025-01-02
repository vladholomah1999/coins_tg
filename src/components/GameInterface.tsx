import React, { useState, useCallback, memo } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import BottomMenu from './BottomMenu';

type GameInterfaceProps = {
  // Якщо є додаткові пропси, додамо їх сюди
}

const GameInterface: React.FC<GameInterfaceProps> = memo(() => {
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('userScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : 1500;
  });

  const maxEnergy = 1500;
  const [currentView, setCurrentView] = useState('mine');
  const [turboActive, setTurboActive] = useState(false);
  const [multitapLevel, setMultitapLevel] = useState(() => {
    const savedLevel = localStorage.getItem('multitapLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });

  const handleClick = useCallback(() => {
    if (energy > 0) {
      const increment = turboActive ? multitapLevel * 5 : multitapLevel;
      setScore(prevScore => {
        const newScore = prevScore + increment;
        localStorage.setItem('userScore', newScore.toString());
        return newScore;
      });

      setEnergy(prevEnergy => {
        const newEnergy = Math.max(prevEnergy - multitapLevel, 0);
        localStorage.setItem('energy', newEnergy.toString());
        return newEnergy;
      });
    }
  }, [energy, turboActive, multitapLevel]);

  const handleMenuItemClick = useCallback((item: string) => {
    setCurrentView(item);
  }, []);

  const handleSettingsClick = useCallback(() => {
    console.log('Settings clicked');
  }, []);

  return (
    <div className="game-interface">
      <EnergyBar
        energy={energy}
        maxEnergy={maxEnergy}
        onSettingsClick={handleSettingsClick}
      />
      <CoinBalance balance={score} />
      <div className="badge">Silver</div>
      <div className="center-content">
        <ExchangeDisplay
          onClick={handleClick}
          turboActive={turboActive}
          multitapLevel={multitapLevel}
        />
        <div className="exchange-text">Your Exchange</div>
      </div>
      <BottomMenu
        activeItem={currentView}
        onMenuItemClick={handleMenuItemClick}
      />
    </div>
  );
});

GameInterface.displayName = 'GameInterface';

export default GameInterface;