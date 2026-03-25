import { useState, useEffect } from 'react';
import type { ViewMode } from '../types';

export function useViewport(): { mode: ViewMode; width: number; height: number } {
  const [state, setState] = useState(() => ({
    mode: getMode(window.innerWidth),
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqTablet = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');

    const update = () => {
      setState({
        mode: getMode(window.innerWidth),
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    mqMobile.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    window.addEventListener('resize', update);

    return () => {
      mqMobile.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return state;
}

function getMode(width: number): ViewMode {
  if (width < 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}
