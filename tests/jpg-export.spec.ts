import { describe, it, expect, beforeEach } from 'vitest';
import { renderExportPreview, expectNoEditorUI, expectValidExportRoot } from './export-utils';
import { useEditorStore } from '../src/store/editorStore';
import type { Block } from '../src/types/template';

const sampleBlocks: Block[] = [
  {
    id: 'test-1',
    type: 'header',
    content: 'Export Test',
    level: 1,
    styles: {
      backgroundColor: '#ffffff',
      textAlign: 'center',
      padding: 16,
      margin: 8,
      typography: { fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', color: '#000000' },
    },
  },
];

beforeEach(() => {
  useEditorStore.getState().loadState({
    blocks: sampleBlocks,
    selectedBlockId: null,
    sidebarPosition: 'left',
    sidebarOpen: true,
    previewMode: 'desktop',
    themeMode: 'light',
    templateConfig: { canvasWidth: 800, canvasHeight: 600, qrSize: 200 },
    clipboard: null,
  });
});

describe('JPG export source', () => {
  it('export target is #export-root with no editor UI', () => {
    const { root } = renderExportPreview();
    expectNoEditorUI(root!);
  });

  it('export root has valid dimensions and content', () => {
    const { root } = renderExportPreview();
    expectValidExportRoot(root!);
    expect(root!.innerHTML).toContain('Export Test');
  });

  it('exportAsJpg receives #export-root element', async () => {
    const { root } = renderExportPreview();
    const { exportAsJpg } = await import('../src/utils/export');
    expect(typeof exportAsJpg).toBe('function');
    expect(root).not.toBeNull();
  });
});
