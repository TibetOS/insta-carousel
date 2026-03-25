import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { Canvas, Textbox, FabricImage, Rect, Circle } from 'fabric';
import type { Slide, SlideElement, TextElement } from '../types';
import type { FabricObject } from 'fabric';
import { useCarouselStore } from '../store/useCarouselStore';
import { restoreUrl } from '../store/fileCache';

const EPSILON = 0.5;
const EPSILON_ROTATED = 1.5;

export function useCanvasSync(canvasRef: RefObject<Canvas | null>) {
  const isSyncing = useRef(0);
  const pendingFlushes = useRef<Map<string, () => void>>(new Map());
  const activeSlideIdRef = useRef<string>('');
  const selectedElementIdRef = useRef<string | null>(null);

  const flushAllDebounces = useCallback(() => {
    for (const flush of pendingFlushes.current.values()) {
      flush();
    }
    pendingFlushes.current.clear();
  }, []);

  // Store → Canvas: rebuild on slide change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const unsubscribe = useCarouselStore.subscribe(
      (state) => {
        if (isSyncing.current > 0) return;

        const slide = state.slides.find(s => s.id === state.activeSlideId);
        if (!slide) return;

        // If slide changed, flush debounces and rebuild
        if (activeSlideIdRef.current !== state.activeSlideId) {
          flushAllDebounces();
          activeSlideIdRef.current = state.activeSlideId;
          rebuildCanvas(canvas, slide);
          return;
        }

        // Otherwise sync individual changes with epsilon guard
        syncCanvasObjects(canvas, slide);

        // Update selection
        if (selectedElementIdRef.current !== state.selectedElementId) {
          selectedElementIdRef.current = state.selectedElementId;
          if (state.selectedElementId) {
            const obj = canvas.getObjects().find(
              o => o.get('data')?.elementId === state.selectedElementId
            );
            if (obj) canvas.setActiveObject(obj);
          } else {
            canvas.discardActiveObject();
          }
          canvas.requestRenderAll();
        }
      }
    );

    // Initialize
    const state = useCarouselStore.getState();
    activeSlideIdRef.current = state.activeSlideId;
    const slide = state.slides.find(s => s.id === state.activeSlideId);
    if (slide) rebuildCanvas(canvas, slide);

    return () => unsubscribe();
  }, [canvasRef, flushAllDebounces]);

  // Canvas → Store
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const onModified = (e: { target?: FabricObject }) => {
      const obj = e.target;
      if (!obj) return;
      const elementId = obj.get('data')?.elementId;
      if (!elementId) return;

      isSyncing.current++;
      try {
        const state = useCarouselStore.getState();
        const updates = normalizeAndExtract(obj);
        state.updateElement(state.activeSlideId, elementId, updates);
      } finally {
        isSyncing.current--;
      }
    };

    const onTextChanged = (e: { target?: FabricObject }) => {
      const obj = e.target as Textbox;
      if (!obj) return;
      const elementId = obj.get('data')?.elementId;
      if (!elementId) return;

      // Clear existing debounce
      const existing = pendingFlushes.current.get(elementId);
      if (existing) {
        // Cancel the timeout - we'll set a new one
      }

      const timerId = setTimeout(() => {
        isSyncing.current++;
        try {
          const state = useCarouselStore.getState();
          state.updateElement(state.activeSlideId, elementId, { text: obj.text || '' } as Partial<SlideElement>);
        } finally {
          isSyncing.current--;
        }
        pendingFlushes.current.delete(elementId);
      }, 300);

      pendingFlushes.current.set(elementId, () => {
        clearTimeout(timerId);
        isSyncing.current++;
        try {
          const state = useCarouselStore.getState();
          state.updateElement(state.activeSlideId, elementId, { text: obj.text || '' } as Partial<SlideElement>);
        } finally {
          isSyncing.current--;
        }
      });
    };

    const onSelectionCreated = (e: { selected?: FabricObject[] }) => {
      const obj = e.selected?.[0];
      if (!obj) return;
      const elementId = obj.get('data')?.elementId;
      useCarouselStore.getState().setSelectedElement(elementId || null);
    };

    const onSelectionCleared = () => {
      useCarouselStore.getState().setSelectedElement(null);
    };

    // Double-tap to edit text on mobile
    let lastTapTime = 0;
    const onMouseDown = (opt: { e: Event; target?: FabricObject }) => {
      if (!isMobile) return;
      if (!('touches' in opt.e)) return;
      const now = Date.now();
      if (now - lastTapTime < 300 && opt.target?.type === 'textbox') {
        canvas.setActiveObject(opt.target);
        (opt.target as Textbox).enterEditing();
      }
      lastTapTime = now;
    };

    canvas.on('object:modified', onModified as any);
    canvas.on('text:changed', onTextChanged as any);
    canvas.on('selection:created', onSelectionCreated as any);
    canvas.on('selection:updated', onSelectionCreated as any);
    canvas.on('selection:cleared', onSelectionCleared);
    canvas.on('mouse:down', onMouseDown as any);

    return () => {
      canvas.off('object:modified', onModified as any);
      canvas.off('text:changed', onTextChanged as any);
      canvas.off('selection:created', onSelectionCreated as any);
      canvas.off('selection:updated', onSelectionCreated as any);
      canvas.off('selection:cleared', onSelectionCleared);
      canvas.off('mouse:down', onMouseDown as any);
    };
  }, [canvasRef]);

  return { flushAllDebounces };
}

function normalizeAndExtract(obj: FabricObject): Partial<SlideElement> {
  if (obj.type === 'textbox') {
    const tb = obj as Textbox;
    const newWidth = (tb.width || 200) * (tb.scaleX || 1);
    const newFontSize = (tb.fontSize || 40) * (tb.scaleY || 1);
    tb.set({ scaleX: 1, scaleY: 1, width: newWidth, fontSize: newFontSize });
    tb.setCoords();
    return {
      x: tb.left || 0,
      y: tb.top || 0,
      width: newWidth,
      height: tb.height || 0,
      fontSize: newFontSize,
      angle: tb.angle || 0,
    } as Partial<TextElement>;
  }

  const newWidth = (obj.width || 100) * (obj.scaleX || 1);
  const newHeight = (obj.height || 100) * (obj.scaleY || 1);
  obj.set({ scaleX: 1, scaleY: 1, width: newWidth, height: newHeight });
  obj.setCoords();
  return {
    x: obj.left || 0,
    y: obj.top || 0,
    width: newWidth,
    height: newHeight,
    angle: obj.angle || 0,
  };
}

function needsUpdate(a: number, b: number, angle: number): boolean {
  const eps = angle !== 0 ? EPSILON_ROTATED : EPSILON;
  return Math.abs(a - b) >= eps;
}

function syncCanvasObjects(canvas: Canvas, slide: Slide) {
  canvas.backgroundColor = slide.backgroundColor;

  const objects = canvas.getObjects();
  for (const element of slide.elements) {
    const obj = objects.find(o => o.get('data')?.elementId === element.id);
    if (!obj) continue;

    const angle = element.angle || 0;
    let changed = false;

    if (needsUpdate(obj.left || 0, element.x, angle)) { obj.set('left', element.x); changed = true; }
    if (needsUpdate(obj.top || 0, element.y, angle)) { obj.set('top', element.y); changed = true; }
    if (needsUpdate(obj.angle || 0, angle, angle)) { obj.set('angle', angle); changed = true; }

    if (element.type === 'text') {
      const tb = obj as Textbox;
      if (tb.text !== element.text) { tb.set('text', element.text); changed = true; }
      if (tb.fill !== element.fill) { tb.set('fill', element.fill); changed = true; }
      if (tb.fontFamily !== element.fontFamily) { tb.set('fontFamily', element.fontFamily); changed = true; }
      if (tb.fontSize !== element.fontSize) { tb.set('fontSize', element.fontSize); changed = true; }
      if (tb.fontWeight !== element.fontWeight) { tb.set('fontWeight', element.fontWeight); changed = true; }
      if (tb.fontStyle !== element.fontStyle) { tb.set('fontStyle', element.fontStyle); changed = true; }
      if (tb.textAlign !== element.textAlign) { tb.set('textAlign', element.textAlign); changed = true; }
    }

    if (element.type === 'shape') {
      if (obj.fill !== element.fill) { obj.set('fill', element.fill); changed = true; }
      if (obj.stroke !== element.stroke) { obj.set('stroke', element.stroke); changed = true; }
      if (obj.strokeWidth !== element.strokeWidth) { obj.set('strokeWidth', element.strokeWidth); changed = true; }
    }

    if (changed) {
      obj.setCoords();
    }
  }

  canvas.requestRenderAll();
}

async function rebuildCanvas(canvas: Canvas, slide: Slide) {
  canvas.clear();
  canvas.backgroundColor = slide.backgroundColor;

  const isMobile = window.innerWidth < 768;
  const cornerSize = isMobile ? 20 : 13;

  for (const element of slide.elements) {
    const obj = await createFabricObject(element);
    if (obj) {
      obj.set('data', { elementId: element.id });
      obj.set({
        cornerSize,
        touchCornerSize: 24,
        transparentCorners: false,
        cornerColor: '#2B579A',
        cornerStrokeColor: '#fff',
        borderColor: '#2B579A',
      });
      if (element.locked) {
        obj.set({ lockMovementX: true, lockMovementY: true, lockRotation: true, lockScalingX: true, lockScalingY: true });
      }
      // Hide mid-edge controls for shapes
      if (element.type === 'shape') {
        obj.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false });
      }
      canvas.add(obj);
    }
  }

  canvas.requestRenderAll();
}

async function createFabricObject(element: SlideElement) {
  switch (element.type) {
    case 'text':
      return new Textbox(element.text, {
        left: element.x,
        top: element.y,
        width: element.width,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        fill: element.fill,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        angle: element.angle,
      });
    case 'image': {
      const url = restoreUrl(element.fileId) || element.src;
      try {
        const img = await FabricImage.fromURL(url);
        img.set({
          left: element.x,
          top: element.y,
          angle: element.angle,
        });
        img.scaleToWidth(element.width);
        return img;
      } catch {
        return null;
      }
    }
    case 'shape':
      if (element.shapeType === 'circle') {
        return new Circle({
          left: element.x,
          top: element.y,
          radius: element.width / 2,
          fill: element.fill,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          angle: element.angle,
        });
      }
      return new Rect({
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        angle: element.angle,
      });
  }
}
