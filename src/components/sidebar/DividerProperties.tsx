import type { DividerBlock, Block } from '../../types/template';

export function DividerProperties({ block, onUpdate }: { block: DividerBlock; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  return (
    <div className="sidebar__section">
      <div className="sidebar__section-title">Divider</div>
      <div className="sidebar__field">
        <label>Style</label>
        <select
          value={block.lineStyle}
          onChange={(e) => onUpdate(block.id, { lineStyle: e.target.value } as any)}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div className="sidebar__field">
        <label>Color</label>
        <input
          type="color"
          value={block.lineColor}
          onChange={(e) => onUpdate(block.id, { lineColor: e.target.value } as any)}
        />
      </div>
      <div className="sidebar__field">
        <label>Thickness (px)</label>
        <input
          type="number"
          min={1}
          max={10}
          value={block.lineWidth}
          onChange={(e) => onUpdate(block.id, { lineWidth: Number(e.target.value) } as any)}
        />
      </div>
    </div>
  );
}