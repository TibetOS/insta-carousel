import { useState, useRef, useEffect, useCallback } from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { PropertiesPanel } from '../Properties/PropertiesPanel';
import { TemplateList } from '../Sidebar/TemplateList';
import { ExportPanel } from '../Sidebar/ExportPanel';

type SheetState = 'collapsed' | 'half' | 'full';

const HEIGHTS: Record<SheetState, string> = {
  collapsed: '80px',
  half: '40vh',
  full: '85vh',
};

export function BottomSheet() {
  const [state, setState] = useState<SheetState>('collapsed');
  const [tab, setTab] = useState<'properties' | 'templates' | 'export'>('templates');
  const selectedElementId = useCarouselStore(s => s.selectedElementId);
  const dragStartY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Auto-expand on selection
  useEffect(() => {
    if (selectedElementId) {
      setState('half');
      setTab('properties');
    } else if (state === 'half') {
      setState('collapsed');
    }
  }, [selectedElementId]);

  // Virtual keyboard handling
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const keyboardHeight = window.innerHeight - vv.height;
      if (keyboardHeight > 150) {
        setState('collapsed');
      }
    };
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - e.clientY;
    dragStartY.current = null;

    if (dy > 50) {
      // Swipe up
      setState(prev => prev === 'collapsed' ? 'half' : prev === 'half' ? 'full' : prev);
    } else if (dy < -50) {
      // Swipe down
      setState(prev => prev === 'full' ? 'half' : prev === 'half' ? 'collapsed' : prev);
    }
  }, []);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-[height] duration-300 ease-out z-30 flex flex-col"
      style={{ height: HEIGHTS[state] }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="flex justify-center pt-2 pb-1 cursor-grab touch-none"
      >
        <div className="w-10 h-1 rounded-full bg-gray-300" />
      </div>

      {/* Tabs */}
      {state !== 'collapsed' && (
        <div className="flex border-b border-gray-200 px-2">
          {(['templates', 'properties', 'export'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-medium ${
                tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {state === 'collapsed' ? null : (
          <>
            {tab === 'templates' && <TemplateList onSelect={() => setState('collapsed')} />}
            {tab === 'properties' && <PropertiesPanel />}
            {tab === 'export' && <ExportPanel />}
          </>
        )}
      </div>
    </div>
  );
}
