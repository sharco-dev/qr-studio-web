import type { TextBlock, HeaderBlock, FooterBlock, Block } from '../../types/template';

export function ContentProperties({ block, onUpdate }: { block: TextBlock | HeaderBlock | FooterBlock; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  const isHeader = block.type === 'header';
  const headerBlock = block as HeaderBlock;

  return (
    <div className="sidebar__section">
      <div className="sidebar__section-title">Content</div>
      {isHeader && (
        <div className="sidebar__field">
          <label>Level</label>
          <select
            value={headerBlock.level}
            onChange={(e) => onUpdate(block.id, { level: Number(e.target.value) } as any)}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
      )}
      <div className="sidebar__field">
        <label>Text</label>
        <textarea
          rows={3}
          value={block.content}
          onChange={(e) => onUpdate(block.id, { content: e.target.value } as any)}
        />
      </div>
    </div>
  );
}
