# Phase 3 — Sync + Touch

## Objective
Bidirectional canvas-store sync, touch gestures, and scale normalization.

## Tasks
- [x] Bidirectional sync (useCanvasSync): Store → Canvas rebuild, Canvas → Store on object:modified
- [x] Epsilon guard: < 0.5 normal, < 1.5 when angle !== 0
- [x] Scale normalization: scaleX/scaleY → width/height (text: scaleY → fontSize)
- [x] Flush registry: synchronous flush of text debounces before slide switch
- [x] isSyncing ref counter in try/finally
- [x] Blob URL management (fileCache.ts)
- [x] Pinch-to-zoom (useTouchGestures) — adjusts Fabric zoom, not CSS
- [x] Double-tap-to-edit text (300ms threshold)
- [x] Larger touch corners on mobile (cornerSize: 20, touchCornerSize: 24)
- [x] selection:created/updated/cleared → store sync
- [x] text:changed debounced 300ms

## Key Files
- `src/canvas/useCanvasSync.ts` — Bidirectional sync engine
- `src/canvas/useTouchGestures.ts` — Pinch-to-zoom
- `src/store/fileCache.ts` — Blob URL lifecycle

## Status: COMPLETE
