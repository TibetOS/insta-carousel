import { useRef, useState, useCallback } from 'react';
import { useCarouselStore, createDefaultSlide } from '../../store/useCarouselStore';

export function SlideStrip() {
  const slides = useCarouselStore(s => s.slides);
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const setActiveSlide = useCarouselStore(s => s.setActiveSlide);
  const addSlide = useCarouselStore(s => s.addSlide);
  const reorderSlide = useCarouselStore(s => s.reorderSlide);

  const [dragId, setDragId] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent, slideId: string) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    longPressTimer.current = setTimeout(() => {
      setDragId(slideId);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragId) {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > 5 || dy > 5) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }
    }
  }, [dragId]);

  const onPointerUp = useCallback((e: React.PointerEvent, targetId: string) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (dragId && dragId !== targetId) {
      reorderSlide(dragId, targetId);
    }
    setDragId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, [dragId, reorderSlide]);

  return (
    <div className="flex items-center gap-2 px-2 py-2 overflow-x-auto bg-white border-t border-gray-200">
      {slides.map((slide, idx) => (
        <button
          key={slide.id}
          onPointerDown={e => onPointerDown(e, slide.id)}
          onPointerMove={onPointerMove}
          onPointerUp={e => onPointerUp(e, slide.id)}
          onClick={() => setActiveSlide(slide.id)}
          className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 transition-all ${
            slide.id === activeSlideId ? 'border-blue-500 shadow-md' : 'border-gray-200'
          } ${dragId === slide.id ? 'opacity-50 scale-95' : ''}`}
          style={{ backgroundColor: slide.backgroundColor }}
        >
          <span className="text-[10px] text-gray-500">{idx + 1}</span>
        </button>
      ))}
      <button
        onClick={() => addSlide(createDefaultSlide())}
        className="flex-shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xl"
      >
        +
      </button>
    </div>
  );
}
