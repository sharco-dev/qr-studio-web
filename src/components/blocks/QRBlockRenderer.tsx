import { useQrMatrix, useQrSvg, useQrDataUrl } from '../../hooks/useQr';
import { buildQrOptions } from '../../hooks/useQr';
import type { QRBlock } from '../../types/template';

interface Props {
  block: QRBlock;
}

export function QRBlockRenderer({ block }: Props) {
  const c = block.config;

  const matrix = useQrMatrix(c.url || 'https://example.com');

  const options = buildQrOptions(
    c.url,
    c.moduleStyle,
    c.innerEyeStyle,
    c.outerEyeStyle,
    c.fgColor,
    c.bgColor,
    c.logoUrl,
    c.logoSize,
    c.logoPadding || 0,
    c.size
  );

  const svg = useQrSvg(matrix, options);
  const dataUrl = useQrDataUrl(svg);

  return (
    <div
      className="qr-block"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code"
          className="qr-block__img"
          style={{ width: c.size, height: c.size }}
        />
      ) : (
        <div className="qr-block__placeholder">QR Code</div>
      )}
      <div className="qr-block__url">{block.config.url}</div>
    </div>
  );
}