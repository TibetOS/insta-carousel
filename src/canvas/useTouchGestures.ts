import { useEffect, useRef, type RefObject } from 'react';
import { Canvas, Point } from 'fabric';

export function useTouchGestures(
  canvasRef: RefObject<Canvas | null>,
  minZoom = 0.5,
  maxZoom = 3
) {
  const lastDistance = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const upperEl = canvas.upperCanvasEl;
    if (!upperEl) return;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) {
        lastDistance.current = null;
        return;
      }
      e.preventDefault();

      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };

      if (lastDistance.current !== null) {
        let zoom = canvas.getZoom() * (dist / lastDistance.current);
        zoom = Math.min(Math.max(zoom, minZoom), maxZoom);
        canvas.zoomToPoint(new Point(center.x, center.y), zoom);
      }
      lastDistance.current = dist;
    };

    const onTouchEnd = () => {
      lastDistance.current = null;
    };

    upperEl.addEventListener('touchmove', onTouchMove, { passive: false });
    upperEl.addEventListener('touchend', onTouchEnd);
    return () => {
      upperEl.removeEventListener('touchmove', onTouchMove);
      upperEl.removeEventListener('touchend', onTouchEnd);
    };
  }, [canvasRef, minZoom, maxZoom]);
}
