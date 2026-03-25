export type AspectRatio = '1:1' | '4:5';
export type ElementType = 'text' | 'image' | 'shape';
export type ViewMode = 'mobile' | 'tablet' | 'desktop';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  locked?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  fill: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  fileId: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rect' | 'circle';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export type SlideElement = TextElement | ImageElement | ShapeElement;

export interface Slide {
  id: string;
  backgroundColor: string;
  elements: SlideElement[];
}

export interface CarouselState {
  slides: Slide[];
  activeSlideId: string;
  selectedElementId: string | null;
  aspectRatio: AspectRatio;
  originalPositions: Record<string, { x: number; y: number; width: number; height: number }>;
  isExporting: boolean;
}

export interface CarouselActions {
  setActiveSlide: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  addSlide: (slide?: Slide) => void;
  removeSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  reorderSlide: (fromId: string, toId: string) => void;
  updateSlideBackground: (slideId: string, color: string) => void;
  addElement: (slideId: string, element: SlideElement) => void;
  removeElement: (slideId: string, elementId: string) => void;
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  moveElementZ: (slideId: string, elementId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  duplicateElement: (slideId: string, elementId: string) => void;
  setIsExporting: (val: boolean) => void;
  loadState: (state: Partial<CarouselState>) => void;
}

export type CarouselStore = CarouselState & CarouselActions;

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  slides: Slide[];
  aspectRatio: AspectRatio;
}
