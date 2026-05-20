import { useRef } from 'react';
import type { ImageBlock } from '../../types/template';
import { useEditorStore } from '../../store/editorStore';

interface Props {
  block: ImageBlock;
}

export function ImageBlockRenderer({ block }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateBlock(block.id, { src: dataUrl } as any);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="image-block" style={{ display: 'flex', justifyContent: 'center' }}>
      {block.src ? (
        <img
          src={block.src}
          alt={block.alt}
          style={{
            maxWidth: '100%',
            width: block.width || 'auto',
            height: block.height || 'auto',
            borderRadius: '4px',
          }}
        />
      ) : (
        <>
          <div className="image-block__placeholder" onClick={() => fileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') fileRef.current?.click(); }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Click to add image</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        </>
      )}
    </div>
  );
}