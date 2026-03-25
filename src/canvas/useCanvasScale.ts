import { useEffect, type RefObject } from 'react';
import type { Canvas } from 'fabric';
import type { AspectRatio, ViewMode } from '../types';

export function useCanvasScale(
  canvasRef: RefObject<Canvas | null>,
  aspectRatio: AspectRatio,
  containerRef: RefObject<HTMLDivElement | null>,
  mode: ViewMode
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const canvasW = 1080;
    const canvasH = aspectRatio === '1:1' ? 1080 : 1350;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const padding = mode === 'mobile' ? 8 : 32;
      const availW = rect.width - padding * 2;
      const availH = rect.height - padding * 2;
      const scale = Math.min(availW / canvasW, availH / canvasH, 1);

      canvas.setZoom(scale);
      canvas.setDimensions({
        width: canvasW * scale,
        height: canvasH * scale,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasRef, aspectRatio, containerRef, mode]);
}
