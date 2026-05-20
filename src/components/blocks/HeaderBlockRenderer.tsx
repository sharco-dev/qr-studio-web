import type { HeaderBlock } from '../../types/template';

interface Props {
  block: HeaderBlock;
}

export function HeaderBlockRenderer({ block }: Props) {
  const style = {
    fontFamily: block.styles.typography.fontFamily,
    fontWeight: block.styles.typography.fontWeight,
    color: block.styles.typography.color,
    margin: 0,
    lineHeight: 1.3,
  };

  switch (block.level) {
    case 1:
      return <h1 style={style}>{block.content}</h1>;
    case 2:
      return <h2 style={style}>{block.content}</h2>;
    case 3:
      return <h3 style={style}>{block.content}</h3>;
    default:
      return <h1 style={style}>{block.content}</h1>;
  }
}