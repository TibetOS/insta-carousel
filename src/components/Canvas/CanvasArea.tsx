import { useRef } from 'react';
import { useCanvasMount } from '../../canvas/useCanvasMount';
import { useCanvasScale } from '../../canvas/useCanvasScale';
import { useCanvasSync } from '../../canvas/useCanvasSync';
import { useTouchGestures } from '../../canvas/useTouchGestures';
import { useCarouselStore } from '../../store/useCarouselStore';
import type { ViewMode } from '../../types';

interface CanvasAreaProps {
  mode: ViewMode;
}

export function CanvasArea({ mode }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useCanvasMount(containerRef);
  const aspectRatio = useCarouselStore(s => s.aspectRatio);

  useCanvasScale(canvasRef, aspectRatio, containerRef, mode);
  useCanvasSync(canvasRef);
  useTouchGestures(canvasRef);

  return (
    <div
      ref={containerRef}
      className="canvas-container flex-1 flex items-center justify-center bg-gray-100 overflow-hidden relative"
      style={{ minHeight: 0 }}
    />
  );
}
