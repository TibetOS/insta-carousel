import { useCarouselStore } from '../../store/useCarouselStore';
import { TextProperties } from './TextProperties';
import { ImageProperties } from './ImageProperties';
import { ShapeProperties } from './ShapeProperties';
import { ColorPicker } from '../ui/ColorPicker';

export function PropertiesPanel() {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const slides = useCarouselStore(s => s.slides);
  const updateSlideBackground = useCarouselStore(s => s.updateSlideBackground);
  const aspectRatio = useCarouselStore(s => s.aspectRatio);
  const setAspectRatio = useCarouselStore(s => s.setAspectRatio);

  const slide = slides.find(s => s.id === activeSlideId);
  const element = slide?.elements.find(e => e.id === selectedElementId);

  return (
    <div className="h-full overflow-y-auto">
      {/* Slide properties always shown */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Slide</h3>
        <div className="flex items-center gap-3">
          <ColorPicker
            value={slide?.backgroundColor || '#ffffff'}
            onChange={color => updateSlideBackground(activeSlideId, color)}
            label="Background"
          />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={e => setAspectRatio(e.target.value as '1:1' | '4:5')}
              className="px-2 py-1.5 text-sm border border-gray-300 rounded bg-white"
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="4:5">4:5 (Portrait)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Element-specific properties */}
      {element?.type === 'text' && <TextProperties />}
      {element?.type === 'image' && <ImageProperties />}
      {element?.type === 'shape' && <ShapeProperties />}

      {!element && (
        <div className="p-3 text-xs text-gray-400 text-center mt-8">
          Select an element on the canvas to edit its properties
        </div>
      )}
    </div>
  );
}
