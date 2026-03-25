import { useState, useRef } from 'react';
import { useCarouselStore } from '../../store/useCarouselStore';
import { exportSlides } from '../../utils/export';
import { useToast } from '../ui/Toast';

export function ExportPanel() {
  const slides = useCarouselStore(s => s.slides);
  const aspectRatio = useCarouselStore(s => s.aspectRatio);
  const setIsExporting = useCarouselStore(s => s.setIsExporting);
  const [progress, setProgress] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { showToast } = useToast();

  const handleExport = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setProgress(null);
      setIsExporting(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsExporting(true);
    setProgress(0);

    try {
      const blob = await exportSlides(
        slides,
        aspectRatio,
        (current, total) => setProgress(Math.round((current / total) * 100)),
        controller.signal
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'carousel.zip';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export complete!', 'success');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        showToast('Export cancelled', 'info');
      } else {
        showToast('Export failed', 'error');
      }
    } finally {
      abortRef.current = null;
      setProgress(null);
      setIsExporting(false);
    }
  };

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Export</h3>
      <p className="text-xs text-gray-500 mb-3">
        Export all {slides.length} slides as PNG images in a ZIP file.
      </p>
      <button
        onClick={handleExport}
        className={`w-full py-2 px-4 rounded text-white font-medium text-sm ${
          progress !== null ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {progress !== null ? `Cancel (${progress}%)` : 'Export as ZIP'}
      </button>
    </div>
  );
}
