import type { QrMatrix, QrRenderOptions } from './types';
import { getModulePath } from './shapes';
import { renderFinderEyes } from './eyes';

export function isFinderModule(size: number, row: number, col: number): boolean {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= size - 7;
  const inBottomLeft = row >= size - 7 && col < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

export function renderQrSvg(matrix: QrMatrix, options: QrRenderOptions): string {
  const { size, modules } = matrix;
  const {
    moduleStyle, innerEyeStyle, outerEyeStyle,
    fgColor, bgColor, logoUrl, logoSize, logoPadding,
    width, height, quietZone,
  } = options;

  const moduleSize = 10;
  const imageSize = (size + quietZone * 2) * moduleSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageSize} ${imageSize}" width="${width}" height="${height}">\n`;
  svg += `  <rect width="${imageSize}" height="${imageSize}" fill="${bgColor}" />\n`;
  svg += `  <g fill="${fgColor}">\n`;

  let moduleElements = '';
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!modules[row][col]) continue;
      if (isFinderModule(size, row, col)) continue;

      const x = (col + quietZone) * moduleSize;
      const y = (row + quietZone) * moduleSize;
      moduleElements += `    ${getModulePath(x, y, moduleSize, moduleStyle)}\n`;
    }
  }
  svg += moduleElements;

  const eyeElements = renderFinderEyes(modules, size, quietZone, moduleSize, innerEyeStyle, outerEyeStyle);
  svg += eyeElements;

  svg += '  </g>\n';

  if (logoUrl) {
    const logoTotalSize = logoSize + logoPadding * 2;
    const logoX = (imageSize - logoTotalSize) / 2;
    const logoY = (imageSize - logoTotalSize) / 2;

    if (logoPadding > 0) {
      svg += `  <rect x="${logoX}" y="${logoY}" width="${logoTotalSize}" height="${logoTotalSize}" fill="${bgColor}" />\n`;
    }
    svg += `  <image href="${logoUrl}" x="${logoX + logoPadding}" y="${logoY + logoPadding}" width="${logoSize}" height="${logoSize}" />\n`;
  }

  svg += '</svg>';
  return svg;
}

export function svgToDataUrl(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function hasQrContentChanged(
  prev: { url: string },
  next: { url: string }
): boolean {
  return prev.url !== next.url;
}

export function hasQrStyleChanged(
  prev: QrRenderOptions,
  next: QrRenderOptions
): boolean {
  return prev.moduleStyle !== next.moduleStyle
    || prev.innerEyeStyle !== next.innerEyeStyle
    || prev.outerEyeStyle !== next.outerEyeStyle
    || prev.fgColor !== next.fgColor
    || prev.bgColor !== next.bgColor
    || prev.logoUrl !== next.logoUrl
    || prev.logoSize !== next.logoSize
    || prev.logoPadding !== next.logoPadding
    || prev.width !== next.width
    || prev.height !== next.height
    || prev.quietZone !== next.quietZone;
}