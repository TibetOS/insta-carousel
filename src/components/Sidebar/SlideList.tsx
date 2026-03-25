import { useCarouselStore, createDefaultSlide } from '../../store/useCarouselStore';

export function SlideList() {
  const slides = useCarouselStore(s => s.slides);
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const setActiveSlide = useCarouselStore(s => s.setActiveSlide);
  const addSlide = useCarouselStore(s => s.addSlide);
  const removeSlide = useCarouselStore(s => s.removeSlide);
  const duplicateSlide = useCarouselStore(s => s.duplicateSlide);
  const reorderSlide = useCarouselStore(s => s.reorderSlide);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Slides ({slides.length})</h3>
        <button
          onClick={() => addSlide(createDefaultSlide())}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('text/plain', slide.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={e => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-blue-50');
            }}
            onDragLeave={e => e.currentTarget.classList.remove('bg-blue-50')}
            onDrop={e => {
              e.currentTarget.classList.remove('bg-blue-50');
              reorderSlide(e.dataTransfer.getData('text/plain'), slide.id);
            }}
            onClick={() => setActiveSlide(slide.id)}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${
              slide.id === activeSlideId ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100 border border-transparent'
            }`}
          >
            <div
              className="w-10 h-10 rounded border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: slide.backgroundColor }}
            />
            <span className="flex-1 truncate">Slide {idx + 1}</span>
            <div className="flex gap-1">
              <button
                onClick={e => { e.stopPropagation(); duplicateSlide(slide.id); }}
                className="text-gray-400 hover:text-blue-500 text-xs"
                title="Duplicate"
              >
                ⧉
              </button>
              {slides.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); removeSlide(slide.id); }}
                  className="text-gray-400 hover:text-red-500 text-xs"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
