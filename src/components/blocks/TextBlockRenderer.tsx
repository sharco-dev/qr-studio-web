import type { TextBlock } from '../../types/template';

interface Props {
  block: TextBlock;
}

export function TextBlockRenderer({ block }: Props) {
  return (
    <p
      className="text-block"
      style={{
        fontFamily: block.styles.typography.fontFamily,
        fontSize: `${block.styles.typography.fontSize}px`,
        fontWeight: block.styles.typography.fontWeight,
        color: block.styles.typography.color,
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {block.content}
    </p>
  );
}
