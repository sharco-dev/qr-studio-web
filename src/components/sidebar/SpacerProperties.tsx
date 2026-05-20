import type { SpacerBlock, Block } from '../../types/template';

export function SpacerProperties({ block, onUpdate }: { block: SpacerBlock; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  return (
    <div className="sidebar__section">
      <div className="sidebar__section-title">Spacer</div>
      <div className="sidebar__field">
        <label>Height (px)</label>
        <input
          type="number"
          min={4}
          max={200}
          value={block.height}
          onChange={(e) => onUpdate(block.id, { height: Number(e.target.value) } as any)}
        />
      </div>
    </div>
  );
}