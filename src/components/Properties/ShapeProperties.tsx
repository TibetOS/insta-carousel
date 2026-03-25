import { useCarouselStore } from '../../store/useCarouselStore';
import { ColorPicker } from '../ui/ColorPicker';
import type { ShapeElement } from '../../types';

export function ShapeProperties() {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const slides = useCarouselStore(s => s.slides);
  const updateElement = useCarouselStore(s => s.updateElement);

  const slide = slides.find(s => s.id === activeSlideId);
  const element = slide?.elements.find(e => e.id === selectedElementId);
  if (!element || element.type !== 'shape') return null;
  const shapeEl = element as ShapeElement;

  const update = (updates: Partial<ShapeElement>) => {
    // Circle invariant: width must === height
    if (shapeEl.shapeType === 'circle') {
      if ('width' in updates && !('height' in updates)) {
        updates.height = updates.width;
      }
      if ('height' in updates && !('width' in updates)) {
        updates.width = updates.height;
      }
    }
    updateElement(activeSlideId, shapeEl.id, updates);
  };

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Shape Properties</h3>

      <div className="flex items-center gap-3">
        <ColorPicker value={shapeEl.fill} onChange={fill => update({ fill })} label="Fill" />
        <ColorPicker value={shapeEl.stroke} onChange={stroke => update({ stroke })} label="Stroke" />
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stroke W</label>
          <input
            type="number"
            value={shapeEl.strokeWidth}
            onChange={e => update({ strokeWidth: Number(e.target.value) || 0 })}
            min={0}
            max={20}
            className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {shapeEl.shapeType === 'circle' ? 'Size' : 'Width'}
          </label>
          <input
            type="number"
            value={Math.round(shapeEl.width)}
            onChange={e => update({ width: Number(e.target.value) || 50 })}
            min={10}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
        {shapeEl.shapeType !== 'circle' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(shapeEl.height)}
              onChange={e => update({ height: Number(e.target.value) || 50 })}
              min={10}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Rotation</label>
        <input
          type="range"
          value={shapeEl.angle}
          onChange={e => update({ angle: Number(e.target.value) })}
          min={0}
          max={360}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{Math.round(shapeEl.angle)}°</span>
      </div>
    </div>
  );
}
