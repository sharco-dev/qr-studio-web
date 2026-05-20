const BLOCK_TYPES = [
  { type: 'text', icon: 'T', label: 'Text' },
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'header', icon: 'H', label: 'Header' },
  { type: 'footer', icon: 'F', label: 'Footer' },
  { type: 'divider', icon: '—', label: 'Divider' },
  { type: 'spacer', icon: '⬚', label: 'Spacer' },
  { type: 'qr', icon: '▣', label: 'QR Code' },
];

interface Props {
  x: number;
  y: number;
  onSelect: (type: string) => void;
  onClose: () => void;
}

export function AddBlockMenu({ x, y, onSelect }: Props) {
  return (
    <div className="add-block-menu" style={{ position: 'fixed', left: `${Math.min(x, window.innerWidth - 180)}px`, top: `${y}px`, zIndex: 1000 }}>
      <div className="add-block-menu__header">Add Block</div>
      {BLOCK_TYPES.map((bt) => (
        <button key={bt.type} className="add-block-menu__item" onClick={() => onSelect(bt.type)}>
          <span className="add-block-menu__icon">{bt.icon}</span>
          <span>{bt.label}</span>
        </button>
      ))}
    </div>
  );
}