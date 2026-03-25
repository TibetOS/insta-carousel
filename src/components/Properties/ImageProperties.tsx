import { useCarouselStore } from '../../store/useCarouselStore';
import type { ImageElement } from '../../types';

export function ImageProperties() {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const slides = useCarouselStore(s => s.slides);
  const updateElement = useCarouselStore(s => s.updateElement);

  const slide = slides.find(s => s.id === activeSlideId);
  const element = slide?.elements.find(e => e.id === selectedElementId);
  if (!element || element.type !== 'image') return null;
  const imgEl = element as ImageElement;

  const update = (updates: Partial<ImageElement>) => {
    updateElement(activeSlideId, imgEl.id, updates);
  };

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Image Properties</h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width</label>
          <input
            type="number"
            value={Math.round(imgEl.width)}
            onChange={e => update({ width: Number(e.target.value) || 100 })}
            min={10}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          <input
            type="number"
            value={Math.round(imgEl.height)}
            onChange={e => update({ height: Number(e.target.value) || 100 })}
            min={10}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">X</label>
          <input
            type="number"
            value={Math.round(imgEl.x)}
            onChange={e => update({ x: Number(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Y</label>
          <input
            type="number"
            value={Math.round(imgEl.y)}
            onChange={e => update({ y: Number(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Rotation</label>
        <input
          type="range"
          value={imgEl.angle}
          onChange={e => update({ angle: Number(e.target.value) })}
          min={0}
          max={360}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{Math.round(imgEl.angle)}°</span>
      </div>
    </div>
  );
}
