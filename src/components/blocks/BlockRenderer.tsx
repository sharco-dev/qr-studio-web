import { useEffect, useRef, memo } from 'react';
import type { Block } from '../../types/template';
import { TextBlockRenderer } from './TextBlockRenderer';
import { ImageBlockRenderer } from './ImageBlockRenderer';
import { HeaderBlockRenderer } from './HeaderBlockRenderer';
import { FooterBlockRenderer } from './FooterBlockRenderer';
import { DividerBlockRenderer } from './DividerBlockRenderer';
import { SpacerBlockRenderer } from './SpacerBlockRenderer';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCopy: (id: string) => void;
  onAddAfter: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const BlockRenderer = memo(function BlockRenderer({ block, isSelected, onSelect, onMoveUp, onMoveDown, onDelete, onDuplicate, onCopy, onAddAfter, isFirst, isLast }: BlockRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block} />;
      case 'image':
        return <ImageBlockRenderer block={block} />;
      case 'header':
        return <HeaderBlockRenderer block={block} />;
      case 'footer':
        return <FooterBlockRenderer block={block} />;
      case 'divider':
        return <DividerBlockRenderer block={block} />;
      case 'spacer':
        return <SpacerBlockRenderer block={block} />;
      default:
        return null;
    }
  };

  const canDelete = block.type !== 'qr';

  return (
    <div
      ref={ref}
      className={`block-card ${isSelected ? 'block-card--selected' : ''}`}
      data-block-id={block.id}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(block.id); }}
    >
      <div className="block-card__actions">
        <button className="block-card__action-btn" title="Add block after" onClick={(e) => { e.stopPropagation(); onAddAfter(block.id); }}>+</button>
        <span className="block-card__type-label">{block.type}</span>
        <div className="block-card__actions-right">
          <button className="block-card__action-btn" title="Move up" disabled={isFirst} onClick={(e) => { e.stopPropagation(); onMoveUp(block.id); }}>↑</button>
          <button className="block-card__action-btn" title="Move down" disabled={isLast} onClick={(e) => { e.stopPropagation(); onMoveDown(block.id); }}>↓</button>
          <button className="block-card__action-btn" title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }}>⧉</button>
          <button className="block-card__action-btn" title="Copy" onClick={(e) => { e.stopPropagation(); onCopy(block.id); }}>📋</button>
          {canDelete && (
            <button className="block-card__action-btn block-card__action-btn--danger" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}>×</button>
          )}
        </div>
      </div>
      <div className="block-card__content" style={{
        backgroundColor: block.styles.backgroundColor,
        textAlign: block.styles.textAlign,
        padding: `${block.styles.padding}px`,
        margin: `${block.styles.margin}px 0`,
      }}>
        {renderContent()}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.block === nextProps.block &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFirst === nextProps.isFirst &&
    prevProps.isLast === nextProps.isLast;
});