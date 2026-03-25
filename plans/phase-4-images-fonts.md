# Phase 4 — Images & Fonts

## Objective
Image upload with EXIF normalization, font loading with tiered strategy.

## Tasks
- [x] EXIF normalization via OffscreenCanvas (utils/exif.ts)
- [x] Image upload component with file input
- [x] Camera input support on mobile (`accept="image/*"`)
- [x] Paste deduplication (100ms guard)
- [x] Error toasts for failed uploads
- [x] Font loading: 3-step chain (link onload → fonts.load() → fonts.check())
- [x] 5s timeout with system sans-serif fallback
- [x] Tier 1 fonts: preloaded (Inter, Playfair Display, Montserrat, Oswald, Lora, Raleway)
- [x] Tier 2 fonts: lazy-loaded on demand
- [x] Mobile: only preload Tier 1

## Key Files
- `src/utils/exif.ts` — Image normalization
- `src/utils/fonts.ts` — Font loading strategy
- `src/components/ui/FontSelector.tsx` — Font picker UI
- `src/components/Properties/ImageProperties.tsx` — Image controls

## Status: COMPLETE
