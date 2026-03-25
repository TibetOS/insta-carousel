# Phase 6 — Export

## Objective
Export carousel slides as PNG images bundled in a ZIP file.

## Tasks
- [x] Off-screen StaticCanvas at full 1080px resolution
- [x] canvasToBlob() Promise wrapper (callback-based API)
- [x] AbortController signal checked per slide
- [x] 15ms setTimeout yield between slides (UI responsiveness)
- [x] JSZip bundling with progress callback
- [x] Partial-success recovery (skip failed slides)
- [x] Export panel UI with progress bar and cancel button
- [x] Works identically on mobile and desktop

## Key Files
- `src/utils/export.ts` — Export pipeline
- `src/components/Sidebar/ExportPanel.tsx` — Export UI

## Status: COMPLETE
