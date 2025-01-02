import React, { useState, useRef, useCallback, memo } from 'react';
import TurboVideo from './TurboVideo';
import './ExchangeDisplay.css';

type ExchangeDisplayProps = {
  onClick: () => void;
  turboActive: boolean;
  multitapLevel: number;
}

type Animation = {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

type ButtonCoordsType = {
  x: number;
  y: number;
  identifier: number;
}

const ExchangeDisplay = memo<ExchangeDisplayProps>(({
  onClick,
  turboActive,
  multitapLevel
}) => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickTime = useRef<Record<number, number>>({});

  const addAnimation = useCallback((x: number, y: number): void => {
    const newAnimation: Animation = {
      id: Date.now() + Math.random(),
      x,
      y,
      createdAt: Date.now()
    };
    setAnimations(prev => [...prev, newAnimation]);
  }, []);

  const handleButtonTransform = useCallback((coords: ButtonCoordsType): void => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const touchX = coords.x - rect.left;
    const touchY = coords.y - rect.top;

    const angleX = (centerY - touchY) / centerY * 20;
    const angleY = (touchX - centerX) / centerX * 20;

    buttonRef.current.style.transform =
      `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(0.95)`;

    addAnimation(touchX, touchY);

    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    }, 150);
  }, [addAnimation]);

  const handleInteraction = useCallback((coords: ButtonCoordsType): void => {
    const now = Date.now();
    if (now - (lastClickTime.current[coords.identifier] || 0) < 50) return;

    lastClickTime.current[coords.identifier] = now;
    handleButtonTransform(coords);
    onClick();
  }, [handleButtonTransform, onClick]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    handleInteraction({
      x: e.clientX,
      y: e.clientY,
      identifier: e.pointerId
    });
  }, [handleInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    Array.from(e.touches).forEach(touch => {
      handleInteraction({
        x: touch.clientX,
        y: touch.clientY,
        identifier: touch.identifier
      });
    });
  }, [handleInteraction]);

  // Очищення старих анімацій
  React.useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setAnimations(prevAnimations =>
        prevAnimations.filter(anim => now - anim.createdAt < 1000)
      );
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="exchange-display">
      <div className="tap-button-container">
        <TurboVideo isActive={turboActive} />
        <button
          ref={buttonRef}
          type="button"
          className="tap-button"
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
        >
          <img
            src="/images/tap.png"
            alt="Tap"
            className="tap-image"
            width={64}
            height={64}
          />
          {animations.map((anim) => (
            <div
              key={anim.id}
              className="plus-one"
              style={{
                left: anim.x,
                top: anim.y,
                opacity: 1 - (Date.now() - anim.createdAt) / 1000
              }}
            >
              +{turboActive ? multitapLevel * 5 : multitapLevel}
            </div>
          ))}
        </button>
      </div>
    </div>
  );
});

ExchangeDisplay.displayName = 'ExchangeDisplay';

export default ExchangeDisplay;