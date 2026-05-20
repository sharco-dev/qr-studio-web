import { useMemo } from 'react';
import { generateMatrix } from '../lib/qr/matrix';
import { renderQrSvg, svgToDataUrl } from '../lib/qr/renderer';
import type { QrMatrix, QrRenderOptions } from '../lib/qr/types';
import type { QRModuleStyle } from '../types/template';

const DEFAULT_QUIET_ZONE = 4;

export function useQrMatrix(text: string): QrMatrix | null {
  return useMemo(() => {
    try {
      if (!text) return null;
      return generateMatrix(text);
    } catch {
      return null;
    }
  }, [text]);
}

export function useQrSvg(matrix: QrMatrix | null, options: QrRenderOptions): string {
  return useMemo(() => {
    if (!matrix) return '';
    try {
      return renderQrSvg(matrix, options);
    } catch {
      return '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    matrix,
    options.moduleStyle, options.innerEyeStyle, options.outerEyeStyle,
    options.fgColor, options.bgColor,
    options.logoUrl, options.logoSize, options.logoPadding,
    options.width, options.height, options.quietZone,
  ]);
}

export function useQrDataUrl(svg: string): string {
  return useMemo(() => {
    if (!svg) return '';
    return svgToDataUrl(svg);
  }, [svg]);
}

export function buildQrOptions(
  url: string,
  moduleStyle: QRModuleStyle,
  innerEyeStyle: QRModuleStyle,
  outerEyeStyle: QRModuleStyle,
  fgColor: string,
  bgColor: string,
  logoUrl: string,
  logoSize: number,
  logoPadding: number,
  displaySize: number
): QrRenderOptions {
  return {
    moduleStyle: moduleStyle || 'square',
    innerEyeStyle: innerEyeStyle || 'square',
    outerEyeStyle: outerEyeStyle || 'square',
    fgColor: fgColor || '#000000',
    bgColor: bgColor || '#ffffff',
    logoUrl: logoUrl || '',
    logoSize: logoSize || 30,
    logoPadding: logoPadding || 0,
    width: displaySize || 200,
    height: displaySize || 200,
    quietZone: DEFAULT_QUIET_ZONE,
  };
}