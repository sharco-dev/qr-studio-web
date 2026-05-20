import type { 
    QRBlock, 
    TextBlock, 
    HeaderBlock, 
    FooterBlock, 
    ImageBlock, 
    DividerBlock, 
    SpacerBlock, 
    Block, 
    QRModuleStyle, 
    TextAlign, 
    FontWeight 
} from '../../types/template';
import { ContentProperties } from './ContentProperties';
import { ImageProperties } from './ImageProperties';
import { DividerProperties } from './DividerProperties';
import { SpacerProperties } from './SpacerProperties';


export function BlockProperties({ block, onUpdate }: { block: Block; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  return (
    <div className="sidebar__properties">
      <div className="sidebar__section">
        <div className="sidebar__section-title">Background</div>
        <div className="sidebar__field">
          <label>Background Color</label>
          <input
            type="color"
            value={block.styles.backgroundColor}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, backgroundColor: e.target.value } } as any)}
          />
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">Layout</div>
        <div className="sidebar__field">
          <label>Text Align</label>
          <select
            value={block.styles.textAlign}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, textAlign: e.target.value as TextAlign } } as any)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="sidebar__field">
          <label>Padding (px)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={block.styles.padding}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, padding: Number(e.target.value) } } as any)}
          />
        </div>
        <div className="sidebar__field">
          <label>Margin (px)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={block.styles.margin}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, margin: Number(e.target.value) } } as any)}
          />
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">Typography</div>
        <div className="sidebar__field">
          <label>Font Family</label>
          <select
            value={block.styles.typography.fontFamily}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, typography: { ...block.styles.typography, fontFamily: e.target.value } } } as any)}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          </select>
        </div>
        <div className="sidebar__field">
          <label>Font Size (px)</label>
          <input
            type="number"
            min={8}
            max={72}
            value={block.styles.typography.fontSize}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, typography: { ...block.styles.typography, fontSize: Number(e.target.value) } } } as any)}
          />
        </div>
        <div className="sidebar__field">
          <label>Font Weight</label>
          <select
            value={block.styles.typography.fontWeight}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, typography: { ...block.styles.typography, fontWeight: e.target.value as FontWeight } } } as any)}
          >
            <option value="light">Light</option>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
        <div className="sidebar__field">
          <label>Text Color</label>
          <input
            type="color"
            value={block.styles.typography.color}
            onChange={(e) => onUpdate(block.id, { styles: { ...block.styles, typography: { ...block.styles.typography, color: e.target.value } } } as any)}
          />
        </div>
      </div>

      {block.type === 'qr' && <QRProperties block={block as QRBlock} onUpdate={onUpdate} />}
      {(block.type === 'text' || block.type === 'header' || block.type === 'footer') && <ContentProperties block={block as TextBlock | HeaderBlock | FooterBlock} onUpdate={onUpdate} />}
      {block.type === 'image' && <ImageProperties block={block as ImageBlock} onUpdate={onUpdate} />}
      {block.type === 'divider' && <DividerProperties block={block as DividerBlock} onUpdate={onUpdate} />}
      {block.type === 'spacer' && <SpacerProperties block={block as SpacerBlock} onUpdate={onUpdate} />}
    </div>
  );
}