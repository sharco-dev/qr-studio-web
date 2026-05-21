import { useEditorStore } from '../../store/editorStore';
import type { Block } from '../../types/template';
import { QRBlockRenderer } from '../blocks/QRBlockRenderer';
import { TextBlockRenderer } from '../blocks/TextBlockRenderer';
import { ImageBlockRenderer } from '../blocks/ImageBlockRenderer';
import { HeaderBlockRenderer } from '../blocks/HeaderBlockRenderer';
import { FooterBlockRenderer } from '../blocks/FooterBlockRenderer';
import { DividerBlockRenderer } from '../blocks/DividerBlockRenderer';
import { SpacerBlockRenderer } from '../blocks/SpacerBlockRenderer';

function renderBlockContent(block: Block) {
  switch (block.type) {
    case 'qr': return <QRBlockRenderer block={block} />;
    case 'text': return <TextBlockRenderer block={block} />;
    case 'image': return <ImageBlockRenderer block={block} />;
    case 'header': return <HeaderBlockRenderer block={block} />;
    case 'footer': return <FooterBlockRenderer block={block} />;
    case 'divider': return <DividerBlockRenderer block={block} />;
    case 'spacer': return <SpacerBlockRenderer block={block} />;
    default: return null;
  }
}

export function ExportPreview() {
  const blocks = useEditorStore((s) => s.blocks);
  const templateConfig = useEditorStore((s) => s.templateConfig);

  return (
    <div
      id="export-root"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: templateConfig.canvasWidth,
        background: '#ffffff',
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          style={{
            backgroundColor: block.styles.backgroundColor,
            textAlign: block.styles.textAlign,
            padding: `${block.styles.padding}px`,
            margin: `${block.styles.margin}px 0`,
          }}
        >
          {renderBlockContent(block)}
        </div>
      ))}
    </div>
  );
}
