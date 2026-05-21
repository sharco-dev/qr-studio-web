import { describe, it, expect, beforeEach } from 'vitest';
import { renderExportPreview, expectNoEditorUI, expectValidExportRoot } from './export-utils';
import { useEditorStore } from '../src/store/editorStore';
import type { Block } from '../src/types/template';

beforeEach(() => {
  useEditorStore.getState().loadState(originalState);
});

const originalState = {
  blocks: [],
  selectedBlockId: null,
  sidebarPosition: 'left' as const,
  sidebarOpen: true,
  previewMode: 'desktop' as const,
  themeMode: 'light' as const,
  templateConfig: { canvasWidth: 800, canvasHeight: 600, qrSize: 200 },
  clipboard: null,
};

const sampleBlocks: Block[] = [
  {
    id: 'test-1',
    type: 'header',
    content: 'Test Header',
    level: 1,
    styles: {
      backgroundColor: '#ffffff',
      textAlign: 'center',
      padding: 16,
      margin: 8,
      typography: { fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', color: '#000000' },
    },
  },
  {
    id: 'test-2',
    type: 'text',
    content: 'Test text content',
    styles: {
      backgroundColor: '#ffffff',
      textAlign: 'left',
      padding: 16,
      margin: 8,
      typography: { fontFamily: 'Arial', fontSize: 16, fontWeight: 'normal', color: '#333333' },
    },
  },
];

describe('Export root element', () => {
  it('renders #export-root in the DOM with absolute positioning', () => {
    const { root } = renderExportPreview();
    expect(root).not.toBeNull();
    expect(root?.id).toBe('export-root');
    expect(root?.style.position).toBe('absolute');
  });

  it('positions at (0,0) not off-screen', () => {
    const { root } = renderExportPreview();
    expect(root?.style.left).toBe('0px');
    expect(root?.style.top).toBe('0px');
  });

  it('has getExportEl returning #export-root', () => {
    renderExportPreview();
    const el = document.getElementById('export-root');
    expect(el).not.toBeNull();
  });

  it('contains no editor UI in empty state', () => {
    const { root } = renderExportPreview();
    expectNoEditorUI(root!);
  });

  it('has valid dimensions and content with blocks', () => {
    useEditorStore.setState({ blocks: sampleBlocks });
    const { root } = renderExportPreview();
    expectValidExportRoot(root!);
    expect(root!.innerHTML).toContain('Test Header');
    expect(root!.innerHTML).toContain('Test text content');
  });

  it('has correct canvas width style', () => {
    useEditorStore.setState({ blocks: sampleBlocks });
    const { root } = renderExportPreview();
    expect(root!.style.width).toBe('800px');
  });
});
