import { useCarouselStore } from '../../store/useCarouselStore';
import { ColorPicker } from '../ui/ColorPicker';
import { FontSelector } from '../ui/FontSelector';
import type { TextElement } from '../../types';

export function TextProperties() {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const slides = useCarouselStore(s => s.slides);
  const updateElement = useCarouselStore(s => s.updateElement);

  const slide = slides.find(s => s.id === activeSlideId);
  const element = slide?.elements.find(e => e.id === selectedElementId);
  if (!element || element.type !== 'text') return null;
  const textEl = element as TextElement;

  const update = (updates: Partial<TextElement>) => {
    updateElement(activeSlideId, textEl.id, updates);
  };

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Text Properties</h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Content</label>
        <textarea
          value={textEl.text}
          onChange={e => update({ text: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded resize-none"
          rows={3}
        />
      </div>

      <FontSelector value={textEl.fontFamily} onChange={fontFamily => update({ fontFamily })} />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Size</label>
          <input
            type="number"
            value={Math.round(textEl.fontSize)}
            onChange={e => update({ fontSize: Number(e.target.value) || 16 })}
            min={8}
            max={200}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Line Height</label>
          <input
            type="number"
            value={textEl.lineHeight}
            onChange={e => update({ lineHeight: Number(e.target.value) || 1 })}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker value={textEl.fill} onChange={fill => update({ fill })} label="Color" />

        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => update({ fontWeight: textEl.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={`w-8 h-8 text-sm font-bold rounded border ${textEl.fontWeight === 'bold' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}
          >
            B
          </button>
          <button
            onClick={() => update({ fontStyle: textEl.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`w-8 h-8 text-sm italic rounded border ${textEl.fontStyle === 'italic' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}
          >
            I
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Alignment</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(align => (
            <button
              key={align}
              onClick={() => update({ textAlign: align })}
              className={`flex-1 py-1 text-xs rounded border ${textEl.textAlign === align ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
