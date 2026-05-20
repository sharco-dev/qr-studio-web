import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { AddBlockMenu } from './AddBlockMenu';
import type { Block } from '../../types/template';

export function EditorCanvas() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const previewMode = useEditorStore((s) => s.previewMode);
  const themeMode = useEditorStore((s) => s.themeMode);
  const templateConfig = useEditorStore((s) => s.templateConfig);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const moveBlockUp = useEditorStore((s) => s.moveBlockUp);
  const moveBlockDown = useEditorStore((s) => s.moveBlockDown);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const copyBlock = useEditorStore((s) => s.copyBlock);
  const addBlock = useEditorStore((s) => s.addBlock);

  const [menuAnchor, setMenuAnchor] = useState<{ afterId?: string; x: number; y: number } | null>(null);

  const isMobilePreview = previewMode === 'mobile';

  const handleMenuSelect = useCallback((type: string) => {
    if (menuAnchor) {
      addBlock(type as Block['type'], menuAnchor.afterId);
    }
    setMenuAnchor(null);
  }, [menuAnchor, addBlock]);

  useEffect(() => {
    if (!menuAnchor) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.add-block-menu')) {
        setMenuAnchor(null);
      }
    };
    const timer = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', close);
    };
  }, [menuAnchor]);

  return (
    <div
      className={`editor-canvas ${themeMode === 'dark' ? 'editor-canvas--dark' : ''}`}
      onClick={() => selectBlock(null)}
      role="region"
      aria-label="Editor canvas"
    >
      <div
        className={`editor-canvas__container ${isMobilePreview ? 'editor-canvas__container--mobile' : ''}`}
        style={{
          maxWidth: isMobilePreview ? '375px' : `${templateConfig.canvasWidth}px`,
          minHeight: '400px',
        }}
      >
        {blocks.length === 0 ? (
          <div className="editor-canvas__empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <h3>Start Building</h3>
            <p>Add blocks to your template using the <strong>+ Add Block</strong> button above.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={selectBlock}
              onMoveUp={moveBlockUp}
              onMoveDown={moveBlockDown}
              onDelete={removeBlock}
              onDuplicate={duplicateBlock}
              onCopy={copyBlock}
              onAddAfter={(id) => {
                const el = document.querySelector(`[data-block-id="${id}"]`);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  setMenuAnchor({ afterId: id, x: rect.left, y: rect.bottom + 4 });
                }
              }}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))
        )}
        {blocks.length > 0 && (
          <div className="editor-canvas__add-bottom">
            <button
              className="editor-canvas__add-bottom-btn"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const lastId = blocks[blocks.length - 1]?.id;
                setMenuAnchor({ afterId: lastId, x: rect.left, y: rect.bottom + 4 });
              }}
            >
              + Add Block at Bottom
            </button>
          </div>
        )}
      </div>
      {menuAnchor && (
        <AddBlockMenu
          x={menuAnchor.x}
          y={menuAnchor.y}
          onSelect={handleMenuSelect}
          onClose={() => setMenuAnchor(null)}
        />
      )}
    </div>
  );
}