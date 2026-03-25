import { useEffect, useRef, type RefObject } from 'react';
import { Canvas } from 'fabric';

export function useCanvasMount(containerRef: RefObject<HTMLDivElement | null>) {
  const canvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = document.createElement('canvas');
    container.appendChild(el);

    const isMobile = window.innerWidth < 768;

    const canvas = new Canvas(el, {
      width: 1080,
      height: 1080,
      enableRetinaScaling: false,
      allowTouchScrolling: false,
      selection: true,
    });

    // Touch-friendly corners
    const cornerSize = isMobile ? 20 : 13;
    canvas.getObjects().forEach(obj => {
      obj.set({
        cornerSize,
        touchCornerSize: 24,
        transparentCorners: false,
        cornerColor: '#2B579A',
        cornerStrokeColor: '#fff',
        borderColor: '#2B579A',
      });
    });

    canvasRef.current = canvas;

    return () => {
      canvas.dispose();
      canvasRef.current = null;
      if (container) container.innerHTML = '';
    };
  }, [containerRef]);

  return canvasRef;
}
