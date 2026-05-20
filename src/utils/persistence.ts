import type { EditorState } from '../types/template';

const STORAGE_KEY = 'qr-mvp-editor-state';

export function saveState(state: EditorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e: unknown) {
    console.error(`Error ocurred during state save: ${e}`)
  }
}

export function loadState(): EditorState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as EditorState;
    }
  } catch (e: unknown) {
    console.error(`Error ocurred during loading state: ${e}`)
  }
  return null;
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e: unknown) {
    console.error(`Error ocurred during clearing state: ${e}`)
  }
}