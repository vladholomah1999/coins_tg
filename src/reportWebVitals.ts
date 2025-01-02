import { type Metric } from 'web-vitals';

const reportWebVitals = async (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    try {
      const webVitals = await import('web-vitals');
      webVitals.onCLS(onPerfEntry);
      webVitals.onFID(onPerfEntry);
      webVitals.onFCP(onPerfEntry);
      webVitals.onLCP(onPerfEntry);
      webVitals.onTTFB(onPerfEntry);
    } catch (error) {
      console.error('Failed to load web-vitals', error);
    }
  }
};

export default reportWebVitals;