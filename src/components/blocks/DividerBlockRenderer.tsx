import type { DividerBlock } from '../../types/template';

interface Props {
  block: DividerBlock;
}

export function DividerBlockRenderer({ block }: Props) {
  return (
    <hr
      className="divider-block"
      style={{
        border: 'none',
        borderTop: `${block.lineWidth}px ${block.lineStyle} ${block.lineColor}`,
        margin: 0,
        width: '100%',
      }}
    />
  );
}