# Phase 1 — Foundation + Layout

## Objective
Set up state management, persistence, responsive layout, and canvas scaling.

## Tasks
- [x] Initialize Vite 6 + React 19 + TypeScript 5 project
- [x] Install all dependencies (Fabric 7, Zustand 5, zundo, idb-keyval, JSZip, Radix UI, Tailwind CSS 4)
- [x] Define TypeScript data model (`types.ts`)
- [x] Implement Zustand store with zundo temporal middleware (30 undo snapshots desktop, 15 mobile)
- [x] Implement `useViewport` hook (mobile < 768px, tablet 768-1024px, desktop > 1024px)
- [x] Implement `useCanvasMount` — vanilla JS canvas creation safe for React 19 Strict Mode
- [x] Implement `useCanvasScale` — Fabric zoom-based scaling to fit viewport
- [x] Implement IndexedDB persistence with 5s debounced autosave
- [x] Create Desktop 3-column layout (sidebar | canvas | properties)
- [x] Create Mobile stacked layout (canvas + bottom sheet + toolbar)
- [x] Create Tablet 2-column layout (collapsible sidebar)
- [x] Set CSS: `overflow: hidden`, `position: fixed`, `100dvh`, `touch-action: none`

## Key Files
- `src/types.ts` — All TypeScript interfaces
- `src/store/useCarouselStore.ts` — Zustand + zundo store
- `src/store/fileCache.ts` — Blob URL management
- `src/hooks/useViewport.ts` — Breakpoint detection
- `src/canvas/useCanvasMount.ts` — Canvas lifecycle
- `src/canvas/useCanvasScale.ts` — Responsive zoom scaling
- `src/utils/persistence.ts` — IndexedDB autosave
- `src/components/Layout/DesktopLayout.tsx`
- `src/components/Layout/MobileLayout.tsx`

## Status: COMPLETE
