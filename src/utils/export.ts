import { StaticCanvas, FabricImage, Textbox, Rect, Circle } from 'fabric';
import JSZip from 'jszip';
import type { Slide, SlideElement, AspectRatio } from '../types';
import { restoreUrl } from '../store/fileCache';

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      'image/png'
    );
  });
}

async function renderSlide(
  slide: Slide,
  aspectRatio: AspectRatio,
  signal?: AbortSignal
): Promise<Blob> {
  const canvasW = 1080;
  const canvasH = aspectRatio === '1:1' ? 1080 : 1350;

  const staticCanvas = new StaticCanvas(undefined, {
    width: canvasW,
    height: canvasH,
    enableRetinaScaling: false,
  });

  staticCanvas.backgroundColor = slide.backgroundColor;

  for (const element of slide.elements) {
    if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
    const obj = await elementToFabricObject(element);
    if (obj) staticCanvas.add(obj);
  }

  staticCanvas.renderAll();
  const blob = await canvasToBlob(staticCanvas.toCanvasElement());
  staticCanvas.dispose();
  return blob;
}

async function elementToFabricObject(element: SlideElement) {
  switch (element.type) {
    case 'text': {
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
    }
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
    case 'shape': {
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
}

function yieldToMain(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 15));
}

export async function exportSlides(
  slides: Slide[],
  aspectRatio: AspectRatio,
  onProgress?: (current: number, total: number) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const zip = new JSZip();
  const results: { index: number; blob: Blob | null }[] = [];

  for (let i = 0; i < slides.length; i++) {
    if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
    onProgress?.(i, slides.length);

    try {
      const blob = await renderSlide(slides[i], aspectRatio, signal);
      results.push({ index: i, blob });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err;
      results.push({ index: i, blob: null });
    }

    await yieldToMain();
  }

  for (const { index, blob } of results) {
    if (blob) {
      zip.file(`slide-${String(index + 1).padStart(2, '0')}.png`, blob);
    }
  }

  onProgress?.(slides.length, slides.length);
  return zip.generateAsync({ type: 'blob' });
}
