import { useRef } from 'react';
import type { ImageBlock, Block } from '../../types/template';

export function ImageProperties({ block, onUpdate }: { block: ImageBlock; onUpdate: (id: string, updates: Partial<Block>) => void }) {
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onUpdate(block.id, { src: dataUrl } as any);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="sidebar__section">
      <div className="sidebar__section-title">Image</div>
      <div className="sidebar__field">
        <label>Image URL</label>
        <div className="sidebar__input-row">
          <input
            type="text"
            value={block.src}
            placeholder="https://..."
            onChange={(e) => onUpdate(block.id, { src: e.target.value } as any)}
          />
          <button className="sidebar__upload-btn" type="button" onClick={() => imageFileRef.current?.click()}>
            Upload
          </button>
        </div>
        <input ref={imageFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
      </div>
      <div className="sidebar__field">
        <label>Alt Text</label>
        <input
          type="text"
          value={block.alt}
          onChange={(e) => onUpdate(block.id, { alt: e.target.value } as any)}
        />
      </div>
      <div className="sidebar__field">
        <label>Width (px)</label>
        <input
          type="number"
          min={50}
          max={800}
          value={block.width}
          onChange={(e) => onUpdate(block.id, { width: Number(e.target.value) } as any)}
        />
      </div>
      <div className="sidebar__field">
        <label>Height (px)</label>
        <input
          type="number"
          min={50}
          max={800}
          value={block.height}
          onChange={(e) => onUpdate(block.id, { height: Number(e.target.value) } as any)}
        />
      </div>
    </div>
  );
}
