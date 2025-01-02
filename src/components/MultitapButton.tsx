import React, { useState, memo } from 'react';
import './MultitapButton.css';

type MultitapButtonProps = {
  balance: number;
  currentLevel: number;
  onMultitapUpgrade: (level: number, cost: number) => void;
}

const MultitapButton = memo<MultitapButtonProps>(({
  balance,
  currentLevel,
  onMultitapUpgrade
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getNextLevelInfo = (): { level: number; cost: number } => {
    const nextLevel = currentLevel + 1;
    const cost = nextLevel * 100;
    return { level: nextLevel, cost };
  };

  const { level: nextLevel, cost: upgradeCost } = getNextLevelInfo();

  const handleClick = (): void => {
    setShowConfirmation(true);
  };

  const handleConfirm = (): void => {
    onMultitapUpgrade(nextLevel, upgradeCost);
    setShowConfirmation(false);
  };

  const handleCancel = (): void => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        type="button"
        className="multitap-button multitap-specific"
        onClick={handleClick}
        disabled={balance < upgradeCost || currentLevel >= 100}
      >
        <div className="multitap-button-content">
          <div className="multitap-content">
            <img src="/images/multitap.png" alt="Multitap" className="multitap-icon"/>
            <div className="multitap-text">
              <span className="multitap-title">Multitap</span>
              <span className="multitap-levels">+{currentLevel} to +{nextLevel}</span>
            </div>
          </div>
          <div className="multitap-cost">
            <img src="/images/balance.png" alt="Balance" className="balance-batton"/>
            <span>{upgradeCost}</span>
            <img src="/images/arrow-right.png" alt="Arrow" className="arrow-icon"/>
          </div>
        </div>
      </button>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal multitap-modal">
            <button
              type="button"
              className="close-button"
              onClick={handleCancel}
            >
              ×
            </button>
            <img src="/images/multitap.png" alt="Multitap" className="multitap-image"/>
            <div className="multitap-info">
              Multitap дає +{nextLevel} до вашого тапу
            </div>
            <div className="price-info">
              <img src="/images/balance.png" alt="Balance" className="price-icon"/>
              <span>{upgradeCost}</span>
            </div>
            <button
              type="button"
              className="confirm-button multitap-confirm"
              onClick={handleConfirm}
              disabled={balance < upgradeCost}
            >
              Підтвердити
            </button>
          </div>
        </div>
      )}
    </>
  );
});

MultitapButton.displayName = 'MultitapButton';

export default MultitapButton;