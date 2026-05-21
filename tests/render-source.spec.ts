import { describe, it, expect, beforeEach } from 'vitest';
import { renderExportPreview, expectNoEditorUI, expectValidExportRoot } from './export-utils';
import { useEditorStore } from '../src/store/editorStore';
import type { Block } from '../src/types/template';

const multilineState = {
  blocks: [
    { id: 'h1', type: 'header' as const, content: 'Company Name', level: 1, styles: { backgroundColor: '#ffffff', textAlign: 'center', padding: 16, margin: 8, typography: { fontFamily: 'Arial', fontSize: 28, fontWeight: 'bold', color: '#111111' } } },
    { id: 't1', type: 'text' as const, content: 'Description text here', styles: { backgroundColor: '#ffffff', textAlign: 'center', padding: 16, margin: 8, typography: { fontFamily: 'Arial', fontSize: 16, fontWeight: 'normal', color: '#333333' } } },
    { id: 'd1', type: 'divider' as const, lineStyle: 'solid' as const, lineColor: '#cccccc', lineWidth: 1, styles: { backgroundColor: '#ffffff', textAlign: 'center', padding: 16, margin: 8, typography: { fontFamily: 'Arial', fontSize: 16, fontWeight: 'normal', color: '#333333' } } },
    { id: 'f1', type: 'footer' as const, content: 'Footer content', styles: { backgroundColor: '#ffffff', textAlign: 'center', padding: 16, margin: 8, typography: { fontFamily: 'Arial', fontSize: 12, fontWeight: 'normal', color: '#666666' } } },
  ],
  selectedBlockId: null,
  sidebarPosition: 'left' as const,
  sidebarOpen: true,
  previewMode: 'desktop' as const,
  themeMode: 'light' as const,
  templateConfig: { canvasWidth: 800, canvasHeight: 600, qrSize: 200 },
  clipboard: null,
};

beforeEach(() => {
  useEditorStore.getState().loadState(multilineState);
});

describe('Render source validation', () => {
  it('export root contains all block types without editor UI', () => {
    const { root } = renderExportPreview();
    expectNoEditorUI(root!);
    expectValidExportRoot(root!);
    expect(root!.innerHTML).toContain('Company Name');
    expect(root!.innerHTML).toContain('Description text here');
    expect(root!.innerHTML).toContain('hr');
    expect(root!.innerHTML).toContain('Footer content');
  });

  it('export root uses absolute positioning at (0,0) with z-index -1', () => {
    const { root } = renderExportPreview();
    expect(root!.style.position).toBe('absolute');
    expect(root!.style.top).toBe('0px');
    expect(root!.style.left).toBe('0px');
    expect(root!.style.zIndex).toBe('-1');
  });

  it('export root has pointer-events: none for no interaction', () => {
    const { root } = renderExportPreview();
    expect(root!.style.pointerEvents).toBe('none');
  });

  it('all export formats share the same render source (#export-root)', () => {
    renderExportPreview();
    const exportRoot = document.getElementById('export-root');
    expect(exportRoot).not.toBeNull();

    const editorContainer = document.querySelector('.editor-canvas__container');
    expect(exportRoot).not.toBe(editorContainer);
  });

  it('editor canvas container is not used as export source', () => {
    renderExportPreview();
    const exportRoot = document.getElementById('export-root');
    expect(exportRoot).not.toBeNull();
    expectNoEditorUI(exportRoot!);
  });
});
