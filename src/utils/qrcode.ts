// QR Code generation and rendering
// Uses Nayuki QR Code Generator for matrix generation
// Custom SVG renderer for styling

import { generateMatrix } from '../lib/qr/matrix';
import { renderQrSvg } from '../lib/qr/renderer';
import type { QRModuleStyle } from '../types/template';

const DEFAULT_QUIET_ZONE = 4;

export const QrCodeEcc = {
  LOW: 0,
  MEDIUM: 1,
  QUARTILE: 2,
  HIGH: 3,
} as const;

export class QrCode {
  static encodeText(text: string, _ecl: number = QrCodeEcc.MEDIUM): QrCode {
    const matrix = generateMatrix(text, _ecl);
    const instance = new QrCode();
    instance.size = matrix.size;
    instance.modules = matrix.modules;
    return instance;
  }

  size: number = 0;
  modules: boolean[][] = [];

  getModule(x: number, y: number): boolean {
    return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
  }
}

export class QrSegment {
  // Stub for backward compatibility
}

export function generateQrSvg(
  text: string,
  moduleStyle: QRModuleStyle = 'square',
  fgColor: string = '#000000',
  bgColor: string = '#ffffff',
  innerEyeStyle: QRModuleStyle = 'square',
  outerEyeStyle: QRModuleStyle = 'square',
  logoUrl?: string,
  logoSize: number = 30,
  logoPadding: number = 0
): string {
  try {
    const matrix = generateMatrix(text || 'https://example.com');
    if (!matrix) return '';

    const moduleSize = 10;
    const displaySize = (matrix.size + DEFAULT_QUIET_ZONE * 2) * moduleSize;

    return renderQrSvg(matrix, {
      moduleStyle,
      innerEyeStyle,
      outerEyeStyle,
      fgColor,
      bgColor,
      logoUrl: logoUrl || '',
      logoSize,
      logoPadding: logoPadding,
      width: displaySize,
      height: displaySize,
      quietZone: DEFAULT_QUIET_ZONE,
    });
  } catch {
    return '';
  }
}