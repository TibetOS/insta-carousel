import { get as idbGet, set as idbSet } from 'idb-keyval';
import type { CarouselState } from '../types';

const STORE_KEY = 'insta-carousel-state';
const SAVE_DEBOUNCE = 5000;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

type PersistableState = Pick<CarouselState, 'slides' | 'aspectRatio' | 'originalPositions' | 'activeSlideId'>;

export async function saveState(state: PersistableState): Promise<void> {
  try {
    await idbSet(STORE_KEY, state);
  } catch (err) {
    console.error('Failed to save state:', err);
    throw err;
  }
}

export function debouncedSave(state: PersistableState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState(state).catch(() => {});
  }, SAVE_DEBOUNCE);
}

export function forceSave(state: PersistableState): Promise<void> {
  if (saveTimer) clearTimeout(saveTimer);
  return saveState(state);
}

export async function loadState(): Promise<PersistableState | null> {
  try {
    const data = await idbGet(STORE_KEY);
    return data || null;
  } catch {
    return null;
  }
}

export async function clearState(): Promise<void> {
  try {
    await idbSet(STORE_KEY, undefined);
  } catch {
    // ignore
  }
}
