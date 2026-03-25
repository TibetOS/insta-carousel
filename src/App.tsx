import { useEffect, useState, useCallback, type ErrorInfo, type ReactNode, Component } from 'react';
import { useViewport } from './hooks/useViewport';
import { DesktopLayout } from './components/Layout/DesktopLayout';
import { MobileLayout } from './components/Layout/MobileLayout';
import { ToastProvider, useToast } from './components/ui/Toast';
import { useCarouselStore, generateId } from './store/useCarouselStore';
import { loadState, debouncedSave, forceSave } from './utils/persistence';
import { loadTier1Fonts } from './utils/fonts';
import { normalizeImage } from './utils/exif';
import { addFile } from './store/fileCache';

// Error boundary
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The app encountered an error.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { mode } = useViewport();
  const [restored, setRestored] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { showToast } = useToast();

  // Restore from IndexedDB
  useEffect(() => {
    loadState().then(saved => {
      if (saved && saved.slides && saved.slides.length > 0) {
        setShowPrompt(true);
      } else {
        setRestored(true);
      }
    }).catch(() => setRestored(true));
  }, []);

  const handleRestore = useCallback((restore: boolean) => {
    if (restore) {
      loadState().then(saved => {
        if (saved) {
          useCarouselStore.getState().loadState(saved as any);
        }
        setRestored(true);
        setShowPrompt(false);
      });
    } else {
      setRestored(true);
      setShowPrompt(false);
    }
  }, []);

  // Autosave
  useEffect(() => {
    if (!restored) return;
    const unsub = useCarouselStore.subscribe(state => {
      debouncedSave({
        slides: state.slides,
        aspectRatio: state.aspectRatio,
        originalPositions: state.originalPositions,
        activeSlideId: state.activeSlideId,
      });
    });
    return unsub;
  }, [restored]);

  // Keyboard shortcuts
  useEffect(() => {
    if (mode === 'mobile') return;
    const store = useCarouselStore;
    const temporal = store.temporal.getState();

    const onKeyDown = (e: KeyboardEvent) => {
      const state = store.getState();
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      // Ctrl+Z / Ctrl+Shift+Z
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); temporal.undo(); return; }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); temporal.redo(); return; }
        if (e.key === 'Z') { e.preventDefault(); temporal.redo(); return; }
        if (e.key === 'd') {
          e.preventDefault();
          if (state.selectedElementId) state.duplicateElement(state.activeSlideId, state.selectedElementId);
          return;
        }
        if (e.key === 's') {
          e.preventDefault();
          forceSave({
            slides: state.slides,
            aspectRatio: state.aspectRatio,
            originalPositions: state.originalPositions,
            activeSlideId: state.activeSlideId,
          }).then(() => showToast('Saved!', 'success')).catch(() => showToast('Save failed', 'error'));
          return;
        }
      }

      // Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElementId) {
        state.removeElement(state.activeSlideId, state.selectedElementId);
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        state.setSelectedElement(null);
        return;
      }

      // Arrow nudge
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && state.selectedElementId) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const slide = state.slides.find(s => s.id === state.activeSlideId);
        const el = slide?.elements.find(el => el.id === state.selectedElementId);
        if (!el) return;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        state.updateElement(state.activeSlideId, state.selectedElementId, {
          x: el.x + dx,
          y: el.y + dy,
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, showToast]);

  // Load tier 1 fonts
  useEffect(() => {
    loadTier1Fonts();
  }, []);

  // Clipboard paste for images
  useEffect(() => {
    let lastPasteTime = 0;
    const onPaste = async (e: ClipboardEvent) => {
      const now = Date.now();
      if (now - lastPasteTime < 100) return; // Dedup
      lastPasteTime = now;

      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;
          const normalized = await normalizeImage(file);
          const fileId = generateId();
          const normalizedFile = new File([normalized], 'pasted-image.png', { type: 'image/png' });
          const url = addFile(fileId, normalizedFile);
          const state = useCarouselStore.getState();
          state.addElement(state.activeSlideId, {
            id: generateId(),
            type: 'image',
            x: 200,
            y: 200,
            width: 400,
            height: 400,
            angle: 0,
            src: url,
            fileId,
          });
          break;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  if (showPrompt) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Restore Previous Work?</h2>
          <p className="text-sm text-gray-600 mb-4">We found a saved project. Would you like to continue where you left off?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleRestore(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Restore
            </button>
            <button
              onClick={() => handleRestore(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restored) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return mode === 'mobile' ? <MobileLayout /> : <DesktopLayout mode={mode} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
