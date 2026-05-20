import type { FooterBlock } from '../../types/template';

interface Props {
  block: FooterBlock;
}

export function FooterBlockRenderer({ block }: Props) {
  return (
    <p
      className="footer-block"
      style={{
        fontFamily: block.styles.typography.fontFamily,
        fontSize: `${block.styles.typography.fontSize}px`,
        fontWeight: block.styles.typography.fontWeight,
        color: block.styles.typography.color,
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {block.content}
    </p>
  );
}