import { render } from '@testing-library/react';
import { ExportPreview } from '../src/components/export/ExportPreview';
import { useEditorStore } from '../src/store/editorStore';
import type { Block } from '../src/types/template';

export function renderExportPreview() {
  const view = render(<ExportPreview />);
  const root = document.getElementById('export-root');
  return { view, root };
}

export function setTestBlocks(blocks: Block[]) {
  useEditorStore.setState({ blocks });
}

export function expectNoEditorUI(el: HTMLElement) {
  const html = el.innerHTML;
  expect(html).not.toContain('block-card__actions');
  expect(html).not.toContain('block-card--selected');
  expect(html).not.toContain('block-card__action-btn');
  expect(html).not.toContain('block-card__type-label');
  expect(html).not.toContain('editor-canvas__container');
  expect(html).not.toContain('editor-canvas__add-bottom');
  expect(html).not.toContain('add-block-menu');
}

export function expectContainsContent(html: string, content: string) {
  expect(html).toContain(content);
}

export function expectValidExportRoot(el: HTMLElement) {
  expect(el).not.toBeNull();
  expect(el.children.length).toBeGreaterThan(0);
  expect(el.style.position).toBe('absolute');
  expect(el.style.top).toBe('0px');
  expect(el.style.left).toBe('0px');
}
