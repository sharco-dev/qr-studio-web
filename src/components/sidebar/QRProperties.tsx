import { useRef } from "react";
import type { QRBlock, QRModuleStyle, Block } from '../../types/template';

const MODULE_STYLES: QRModuleStyle[] = [
  'square', 'square-sm', 'rounded', 'circle', 'diamond', 'hashtag', 'heart', 'star', 
  'horizontal-line', 'vertical-line', 'circuit-board',
];

const INNER_EYE_STYLES: QRModuleStyle[] = [
  'square', 'rounded', 'rounded-sm', 'rounded-lg', 'circle',
  'diamond', 'hashtag', 'heart', 'star',
  'inpoint', 'inpoint-sm', 'inpoint-lg',
  'outpoint', 'outpoint-sm', 'outpoint-lg', 'microchip',
];

const OUTER_EYE_STYLES: QRModuleStyle[] = [
  'square', 'rounded', 'rounded-sm', 'rounded-lg', 'circle',
  'inpoint', 'inpoint-sm', 'inpoint-lg',
  'outpoint', 'outpoint-sm', 'outpoint-lg'
];

export function QRProperties({ block, onUpdate }: { block: QRBlock; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  const logoFileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onUpdate(block.id, { config: { ...block.config, logoUrl: dataUrl } } as any);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <div className="sidebar__section">
        <div className="sidebar__section-title">QR Content</div>
        <div className="sidebar__field">
          <label>URL / Content</label>
          <input
            type="text"
            value={block.config.url}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, url: e.target.value } } as any)}
          />
        </div>
        <div className="sidebar__field">
          <label>QR Size (px)</label>
          <input
            type="number"
            min={50}
            max={500}
            value={block.config.size}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, size: Number(e.target.value) } } as any)}
          />
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">QR Colors</div>
        <div className="sidebar__field">
          <label>Foreground</label>
          <input
            type="color"
            value={block.config.fgColor}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, fgColor: e.target.value } } as any)}
          />
        </div>
        <div className="sidebar__field">
          <label>Background</label>
          <input
            type="color"
            value={block.config.bgColor}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, bgColor: e.target.value } } as any)}
          />
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">QR Styles</div>
        <div className="sidebar__field">
          <label>Module Style</label>
          <select
            value={block.config.moduleStyle}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, moduleStyle: e.target.value as QRModuleStyle } } as any)}
          >
            {MODULE_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sidebar__field">
          <label>Inner Eye Style</label>
          <select
            value={block.config.innerEyeStyle}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, innerEyeStyle: e.target.value as QRModuleStyle } } as any)}
          >
            {INNER_EYE_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sidebar__field">
          <label>Outer Eye Style</label>
          <select
            value={block.config.outerEyeStyle}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, outerEyeStyle: e.target.value as QRModuleStyle } } as any)}
          >
            {OUTER_EYE_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">Logo</div>
        <div className="sidebar__field">
          <label>Logo URL</label>
          <div className="sidebar__input-row">
            <input
              type="text"
              value={block.config.logoUrl}
              placeholder="https://..."
              onChange={(e) => onUpdate(block.id, { config: { ...block.config, logoUrl: e.target.value } } as any)}
            />
            <button className="sidebar__upload-btn" type="button" onClick={() => logoFileRef.current?.click()}>
              Upload
            </button>
          </div>
          <input ref={logoFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
        </div>
        <div className="sidebar__field">
          <label>Logo Size (px)</label>
          <input
            type="number"
            min={10}
            max={200}
            value={block.config.logoSize}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, logoSize: Number(e.target.value) } } as any)}
          />
        </div>
        <div className="sidebar__field">
          <label>Logo Padding (px)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={block.config.logoPadding}
            onChange={(e) => onUpdate(block.id, { config: { ...block.config, logoPadding: Number(e.target.value) } } as any)}
          />
        </div>
      </div>
    </>
  );
}