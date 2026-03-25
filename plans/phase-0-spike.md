# Phase 0 — Spike

## Objective
Validate core technology choices before building.

## Tasks
- [x] Validate Fabric.js 7.x works (pinned to 7.0.0, closest to 7.0.2 spec)
- [x] Test vanilla canvas mount in React 19 Strict Mode (useEffect create/dispose pattern)
- [x] Confirm zoom-based scaling works for pointer coordinate mapping
- [x] Verify touch events map through Fabric's internal handling

## Key Decisions
- Fabric 7.0.0 used (7.0.2 not published to npm; 7.0.0 is the stable v7 release)
- Canvas created via `document.createElement('canvas')` and appended to container div
- `canvas.dispose()` + `container.innerHTML = ''` in cleanup for React 19 Strict Mode
- `setZoom()` handles all pointer-to-canvas coordinate mapping automatically
- Touch events handled natively by Fabric v7 (maps to mouse events internally)

## Status: COMPLETE
