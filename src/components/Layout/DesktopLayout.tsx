import { useRef } from 'react';
import { CanvasArea } from '../Canvas/CanvasArea';
import { TemplateList } from '../Sidebar/TemplateList';
import { SlideList } from '../Sidebar/SlideList';
import { ExportPanel } from '../Sidebar/ExportPanel';
import { PropertiesPanel } from '../Properties/PropertiesPanel';
import { useCarouselStore, generateId } from '../../store/useCarouselStore';
import { normalizeImage } from '../../utils/exif';
import { addFile } from '../../store/fileCache';
import { useToast } from '../ui/Toast';
import type { TextElement, ShapeElement, ImageElement, ViewMode } from '../../types';

interface DesktopLayoutProps {
  mode: ViewMode;
}

export function DesktopLayout({ mode }: DesktopLayoutProps) {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const addElement = useCarouselStore(s => s.addElement);
  const removeElement = useCarouselStore(s => s.removeElement);
  const duplicateElement = useCarouselStore(s => s.duplicateElement);
  const moveElementZ = useCarouselStore(s => s.moveElementZ);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const store = useCarouselStore.temporal.getState();

  const addText = () => {
    const el: TextElement = {
      id: generateId(),
      type: 'text',
      x: 200,
      y: 400,
      width: 680,
      height: 80,
      angle: 0,
      text: 'Double-click to edit',
      fontSize: 48,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
    };
    addElement(activeSlideId, el);
  };

  const addShape = (shapeType: 'rect' | 'circle') => {
    const size = shapeType === 'circle' ? 200 : 200;
    const el: ShapeElement = {
      id: generateId(),
      type: 'shape',
      x: 400,
      y: 400,
      width: size,
      height: size,
      angle: 0,
      shapeType,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    };
    addElement(activeSlideId, el);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const normalized = await normalizeImage(file);
      const fileId = generateId();
      const normalizedFile = new File([normalized], file.name, { type: 'image/png' });
      const url = addFile(fileId, normalizedFile);
      const el: ImageElement = {
        id: generateId(),
        type: 'image',
        x: 200,
        y: 200,
        width: 400,
        height: 400,
        angle: 0,
        src: url,
        fileId,
      };
      addElement(activeSlideId, el);
    } catch {
      showToast('Failed to load image', 'error');
    }
    e.target.value = '';
  };

  const sidebarWidth = mode === 'tablet' ? 'w-16' : 'w-[280px]';
  const showSidebarContent = mode !== 'tablet';

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${sidebarWidth} flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto`}>
        {showSidebarContent ? (
          <>
            <div className="p-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800">Carousel Maker</h2>
            </div>
            <TemplateList />
            <div className="border-t border-gray-200" />
            <SlideList />
            <div className="border-t border-gray-200" />
            <ExportPanel />
          </>
        ) : (
          <div className="flex flex-col items-center py-4 gap-4 text-xs text-gray-500">
            <button title="Templates" className="p-2 hover:bg-gray-100 rounded">T</button>
            <button title="Slides" className="p-2 hover:bg-gray-100 rounded">S</button>
            <button title="Export" className="p-2 hover:bg-gray-100 rounded">E</button>
          </div>
        )}
      </div>

      {/* Canvas + Toolbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
          <button onClick={() => store.undo()} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50" title="Undo (Ctrl+Z)">Undo</button>
          <button onClick={() => store.redo()} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50" title="Redo (Ctrl+Shift+Z)">Redo</button>
          <div className="w-px h-5 bg-gray-200" />
          <button onClick={addText} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">+ Text</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            + Image
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </button>
          <button onClick={() => addShape('rect')} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">+ Rect</button>
          <button onClick={() => addShape('circle')} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">+ Circle</button>
          {selectedElementId && (
            <>
              <div className="w-px h-5 bg-gray-200" />
              <button onClick={() => duplicateElement(activeSlideId, selectedElementId)} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Duplicate</button>
              <button onClick={() => removeElement(activeSlideId, selectedElementId)} className="px-2 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">Delete</button>
              <div className="w-px h-5 bg-gray-200" />
              <button onClick={() => moveElementZ(activeSlideId, selectedElementId, 'up')} className="px-1.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" title="Move up">↑</button>
              <button onClick={() => moveElementZ(activeSlideId, selectedElementId, 'down')} className="px-1.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" title="Move down">↓</button>
              <button onClick={() => moveElementZ(activeSlideId, selectedElementId, 'top')} className="px-1.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" title="Move to top">⤒</button>
              <button onClick={() => moveElementZ(activeSlideId, selectedElementId, 'bottom')} className="px-1.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" title="Move to bottom">⤓</button>
            </>
          )}
        </div>

        {/* Canvas */}
        <CanvasArea mode={mode} />
      </div>

      {/* Properties */}
      {mode === 'desktop' && (
        <div className="w-[260px] flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
          <PropertiesPanel />
        </div>
      )}
    </div>
  );
}
