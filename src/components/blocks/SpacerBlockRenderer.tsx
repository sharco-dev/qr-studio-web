import type { SpacerBlock } from '../../types/template';

interface Props {
  block: SpacerBlock;
}

export function SpacerBlockRenderer({ block }: Props) {
  return (
    <div
      className="spacer-block"
      style={{
        height: `${block.height}px`,
        backgroundColor: block.styles.backgroundColor,
      }}
    />
  );
}
