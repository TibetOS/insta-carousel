import { templates } from '../../templates';
import { useCarouselStore } from '../../store/useCarouselStore';

interface TemplateListProps {
  onSelect?: () => void;
}

export function TemplateList({ onSelect }: TemplateListProps) {
  const loadState = useCarouselStore(s => s.loadState);
  const setActiveSlide = useCarouselStore(s => s.setActiveSlide);

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const slides = template.slides.map(s => ({
      ...s,
      id: Math.random().toString(36).substring(2, 10),
      elements: s.elements.map(e => ({ ...e, id: Math.random().toString(36).substring(2, 10) })),
    }));

    loadState({
      slides,
      aspectRatio: template.aspectRatio,
      activeSlideId: slides[0].id,
      selectedElementId: null,
    } as any);
    setActiveSlide(slides[0].id);
    onSelect?.();
  };

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <div
              className="w-full h-full flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: template.slides[0]?.backgroundColor || '#eee', color: template.slides[0]?.elements[0]?.type === 'text' ? (template.slides[0].elements[0] as any).fill : '#fff' }}
            >
              {template.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
