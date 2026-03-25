import { create } from 'zustand';
import { temporal } from 'zundo';
import type { CarouselStore, Slide, SlideElement, AspectRatio } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function createDefaultSlide(): Slide {
  return {
    id: generateId(),
    backgroundColor: '#ffffff',
    elements: [],
  };
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const initialSlide = createDefaultSlide();

const useCarouselStore = create<CarouselStore>()(
  temporal(
    (set, get) => ({
      slides: [initialSlide],
      activeSlideId: initialSlide.id,
      selectedElementId: null,
      aspectRatio: '1:1' as AspectRatio,
      originalPositions: {},
      isExporting: false,

      setActiveSlide: (id: string) => {
        set({ activeSlideId: id, selectedElementId: null });
      },

      setSelectedElement: (id: string | null) => {
        set({ selectedElementId: id });
      },

      setAspectRatio: (ratio: AspectRatio) => {
        const state = get();
        const canvasH1 = state.aspectRatio === '1:1' ? 1080 : 1350;
        const canvasH2 = ratio === '1:1' ? 1080 : 1350;
        const scale = canvasH2 / canvasH1;

        const newOriginalPositions = { ...state.originalPositions };
        const newSlides = state.slides.map(slide => ({
          ...slide,
          elements: slide.elements.map(el => {
            if (!newOriginalPositions[el.id]) {
              newOriginalPositions[el.id] = { x: el.x, y: el.y, width: el.width, height: el.height };
            }
            return { ...el, y: el.y * scale };
          }),
        }));

        set({ aspectRatio: ratio, slides: newSlides, originalPositions: newOriginalPositions });
      },

      addSlide: (slide?: Slide) => {
        const newSlide = slide || createDefaultSlide();
        set(state => ({
          slides: [...state.slides, newSlide],
          activeSlideId: newSlide.id,
        }));
      },

      removeSlide: (id: string) => {
        set(state => {
          if (state.slides.length <= 1) return state;
          const idx = state.slides.findIndex(s => s.id === id);
          const newSlides = state.slides.filter(s => s.id !== id);
          const newActiveId = state.activeSlideId === id
            ? newSlides[Math.min(idx, newSlides.length - 1)].id
            : state.activeSlideId;
          return { slides: newSlides, activeSlideId: newActiveId, selectedElementId: null };
        });
      },

      duplicateSlide: (id: string) => {
        set(state => {
          const idx = state.slides.findIndex(s => s.id === id);
          if (idx === -1) return state;
          const source = state.slides[idx];
          const newSlide: Slide = {
            ...source,
            id: generateId(),
            elements: source.elements.map(el => ({ ...el, id: generateId() })),
          };
          const newSlides = [...state.slides];
          newSlides.splice(idx + 1, 0, newSlide);
          return { slides: newSlides, activeSlideId: newSlide.id };
        });
      },

      reorderSlide: (fromId: string, toId: string) => {
        set(state => {
          if (fromId === toId) return state;
          const slides = [...state.slides];
          const fromIdx = slides.findIndex(s => s.id === fromId);
          const toIdx = slides.findIndex(s => s.id === toId);
          if (fromIdx === -1 || toIdx === -1) return state;
          const [moved] = slides.splice(fromIdx, 1);
          slides.splice(toIdx, 0, moved);
          return { slides };
        });
      },

      updateSlideBackground: (slideId: string, color: string) => {
        set(state => ({
          slides: state.slides.map(s =>
            s.id === slideId ? { ...s, backgroundColor: color } : s
          ),
        }));
      },

      addElement: (slideId: string, element: SlideElement) => {
        set(state => ({
          slides: state.slides.map(s =>
            s.id === slideId ? { ...s, elements: [...s.elements, element] } : s
          ),
        }));
      },

      removeElement: (slideId: string, elementId: string) => {
        set(state => ({
          slides: state.slides.map(s =>
            s.id === slideId ? { ...s, elements: s.elements.filter(e => e.id !== elementId) } : s
          ),
          selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        }));
      },

      updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => {
        set(state => ({
          slides: state.slides.map(s =>
            s.id === slideId
              ? {
                  ...s,
                  elements: s.elements.map(e =>
                    e.id === elementId ? { ...e, ...updates } as SlideElement : e
                  ),
                }
              : s
          ),
        }));
      },

      moveElementZ: (slideId: string, elementId: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
        set(state => ({
          slides: state.slides.map(s => {
            if (s.id !== slideId) return s;
            const elements = [...s.elements];
            const idx = elements.findIndex(e => e.id === elementId);
            if (idx === -1) return s;
            const [el] = elements.splice(idx, 1);
            switch (direction) {
              case 'up': elements.splice(Math.min(idx + 1, elements.length), 0, el); break;
              case 'down': elements.splice(Math.max(idx - 1, 0), 0, el); break;
              case 'top': elements.push(el); break;
              case 'bottom': elements.unshift(el); break;
            }
            return { ...s, elements };
          }),
        }));
      },

      duplicateElement: (slideId: string, elementId: string) => {
        set(state => {
          const slide = state.slides.find(s => s.id === slideId);
          if (!slide) return state;
          const el = slide.elements.find(e => e.id === elementId);
          if (!el) return state;
          const newEl = { ...el, id: generateId(), x: el.x + 20, y: el.y + 20 };
          return {
            slides: state.slides.map(s =>
              s.id === slideId ? { ...s, elements: [...s.elements, newEl] } : s
            ),
            selectedElementId: newEl.id,
          };
        });
      },

      setIsExporting: (val: boolean) => set({ isExporting: val }),

      loadState: (state: Partial<CarouselStore>) => set(state),
    }),
    {
      limit: isMobile ? 15 : 30,
      partialize: (state) => ({
        slides: state.slides,
        aspectRatio: state.aspectRatio,
        originalPositions: state.originalPositions,
      }),
    }
  )
);

export { useCarouselStore, generateId, createDefaultSlide };
