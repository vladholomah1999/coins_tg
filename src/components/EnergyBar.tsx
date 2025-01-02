import React, { useEffect, useRef, memo, useCallback } from 'react';
import './EnergyBar.css';

type EnergyBarProps = {
  energy: number;
  maxEnergy: number;
  onSettingsClick: () => void;
}

type SparkleStyles = {
  left: string;
  top: string;
  animationDuration: string;
}

const createSparkleStyles = (): SparkleStyles => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 1 + 0.5}s`
});

const EnergyBar = memo<EnergyBarProps>(({
  energy,
  maxEnergy,
  onSettingsClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkleInterval = useRef<NodeJS.Timeout>();
  const percentage = (energy / maxEnergy) * 100;

  const createSparkle = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const styles = createSparkleStyles();

    Object.assign(sparkle.style, {
      left: styles.left,
      top: styles.top,
      animationDuration: styles.animationDuration
    });

    const handleAnimationEnd = () => {
      sparkle.remove();
    };

    sparkle.addEventListener('animationend', handleAnimationEnd, { once: true });
    container.appendChild(sparkle);
  }, []);

  const clearSparkles = useCallback((container: HTMLDivElement) => {
    const sparkles = container.getElementsByClassName('sparkle');
    Array.from(sparkles).forEach(sparkle => sparkle.remove());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    sparkleInterval.current = setInterval(createSparkle, 300);

    return () => {
      if (sparkleInterval.current) {
        clearInterval(sparkleInterval.current);
      }
      clearSparkles(container);
    };
  }, [createSparkle, clearSparkles]);

  const formatEnergyValue = useCallback((value: number): string => {
    return value.toLocaleString();
  }, []);

  const handleSettingsClick = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    onSettingsClick();
  }, [onSettingsClick]);

  return (
    <div className="energy-bar" ref={containerRef}>
      <div className="energy-content">
        <img
          src="/images/energy.png"
          alt="Energy"
          className="energy-icon"
          width={24}
          height={24}
        />
        <span className="energy-balance">
          {formatEnergyValue(energy)}/{formatEnergyValue(maxEnergy)}
        </span>
        <div className="energy-fill-container">
          <div
            className="energy-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className="settings-button"
        onClick={handleSettingsClick}
        aria-label="Settings"
      >
        <img
          src="/images/setting.png"
          alt="Settings"
          className="settings-icon"
          width={24}
          height={24}
        />
      </button>

      {/* Індикатор низької енергії */}
      {percentage < 20 && (
        <div className="low-energy-warning" role="alert">
          <span className="warning-pulse" />
        </div>
      )}
    </div>
  );
});

EnergyBar.displayName = 'EnergyBar';

export default EnergyBar;