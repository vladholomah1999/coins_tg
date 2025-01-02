import React, { useCallback, useEffect } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import ExchangeButton from './ExchangeButton';
import { useBoost } from '../BoostContext';
import { useEnergy } from '../EnergyContext';
import { updateUserLevel } from '../api';
import { useTelegram } from '../hooks/useTelegram';

type ClickerProps = {
  onBinanceClick: () => void;
  selectedExchange: {
    name: string;
    logo: string;
  };
  onSettingsClick: () => void;
  score: number;
  onScoreChange: (increment: number) => void;
  onLevelClick: () => void;
  multitapLevel: number;
}

const getLevelInfo = (score: number) => {
  if (score < 5000) return { name: 'Silver', icon: '/images/silver.png' };
  if (score < 25000) return { name: 'Gold', icon: '/images/gold.png' };
  if (score < 100000) return { name: 'Platinum', icon: '/images/platinum.png' };
  if (score < 1000000) return { name: 'Diamond', icon: '/images/diamond.png' };
  if (score < 2000000) return { name: 'Epic', icon: '/images/epic.png' };
  return { name: 'Legendary', icon: '/images/legendary.png' };
};

const Clicker: React.FC<ClickerProps> = ({
  onBinanceClick,
  selectedExchange,
  onSettingsClick,
  score,
  onScoreChange,
  onLevelClick,
  multitapLevel,
}) => {
  const { isTurboActive } = useBoost();
  const { energy, maxEnergy, decreaseEnergy } = useEnergy();
  const { tg } = useTelegram();
  const levelInfo = getLevelInfo(score);

  const updateLevel = useCallback(async () => {
    if (tg?.initDataUnsafe?.user?.id) {
      try {
        await updateUserLevel(tg.initDataUnsafe.user.id.toString(), levelInfo.name);
      } catch (error) {
        console.error('Error updating user level:', error);
      }
    }
  }, [levelInfo.name, tg?.initDataUnsafe?.user?.id]);

  useEffect(() => {
    void updateLevel();
  }, [updateLevel]);

  const handleClick = useCallback(() => {
    if (energy >= multitapLevel || isTurboActive) {
      const baseIncrement = multitapLevel;
      const increment = isTurboActive ? baseIncrement * 5 : baseIncrement;

      onScoreChange(increment);

      if (!isTurboActive) {
        decreaseEnergy(multitapLevel);
      }
    }
  }, [
    energy,
    isTurboActive,
    multitapLevel,
    onScoreChange,
    decreaseEnergy
  ]);

  return (
    <div className="clicker">
      <EnergyBar
        energy={energy}
        maxEnergy={maxEnergy}
        onSettingsClick={onSettingsClick}
      />
      <CoinBalance balance={score}/>
      <button
        type="button"
        className="level-button"
        onClick={onLevelClick}
      >
        <img src={levelInfo.icon} alt={levelInfo.name} className="level-icon"/>
        <span className="level-name">{levelInfo.name}</span>
        <img src="/images/arrow-right.png" alt=">" className="arrow-icon"/>
      </button>
      <div className="center-content">
        <ExchangeDisplay
          onClick={handleClick}
          turboActive={isTurboActive}
          multitapLevel={multitapLevel}
        />
        <div className="exchange-info">
          <div className="exchange-text">Your Exchange</div>
          <ExchangeButton
            onClick={onBinanceClick}
            logo={selectedExchange.logo}
            name={selectedExchange.name}
            isMainView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Clicker;