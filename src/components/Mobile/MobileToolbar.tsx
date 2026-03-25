import { useRef } from 'react';
import { useCarouselStore, generateId } from '../../store/useCarouselStore';
import { useToast } from '../ui/Toast';
import { normalizeImage } from '../../utils/exif';
import { addFile } from '../../store/fileCache';
import type { TextElement, ImageElement } from '../../types';

export function MobileToolbar() {
  const activeSlideId = useCarouselStore(s => s.activeSlideId);
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const addElement = useCarouselStore(s => s.addElement);
  const removeElement = useCarouselStore(s => s.removeElement);
  const duplicateElement = useCarouselStore(s => s.duplicateElement);
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
      text: 'Tap to edit',
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

  const deleteSelected = () => {
    if (selectedElementId) {
      removeElement(activeSlideId, selectedElementId);
    }
  };

  const btnClass = "w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-sm active:scale-95 transition-transform";

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
      <button onClick={() => store.undo()} className={btnClass} title="Undo">↩</button>
      <button onClick={() => store.redo()} className={btnClass} title="Redo">↪</button>
      <button onClick={addText} className={btnClass} title="Add Text">T</button>
      <button onClick={() => fileInputRef.current?.click()} className={btnClass} title="Add Image">
        🖼
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </button>
      {selectedElementId && (
        <>
          <button onClick={deleteSelected} className={`${btnClass} text-red-500`} title="Delete">✕</button>
          <button onClick={() => duplicateElement(activeSlideId, selectedElementId)} className={btnClass} title="Duplicate">⧉</button>
        </>
      )}
    </div>
  );
}
