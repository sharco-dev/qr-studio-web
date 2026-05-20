import type { QrMatrix, QrRenderOptions } from './types';
import { renderQrSvg, svgToDataUrl } from './renderer';

export function exportQrSvg(matrix: QrMatrix, options: QrRenderOptions): string {
  return renderQrSvg(matrix, options);
}

export function exportQrPng(matrix: QrMatrix, options: QrRenderOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svg = renderQrSvg(matrix, options);
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Canvas context not available')); return; }

    const dataUrl = svgToDataUrl(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, options.width, options.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('PNG generation failed'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load SVG for PNG export'));
    img.src = dataUrl;
  });
}

export function exportQrJpg(matrix: QrMatrix, options: QrRenderOptions, quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svg = renderQrSvg(matrix, options);
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Canvas context not available')); return; }

    const dataUrl = svgToDataUrl(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = options.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, options.width, options.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('JPG generation failed'));
      }, 'image/jpeg', quality);
    };
    img.onerror = () => reject(new Error('Failed to load SVG for JPG export'));
    img.src = dataUrl;
  });
}

export function exportQrPdf(matrix: QrMatrix, options: QrRenderOptions): Promise<Blob> {
  return exportQrPng(matrix, options);
}

export function getQrHtmlSvg(matrix: QrMatrix, options: QrRenderOptions): string {
  return renderQrSvg(matrix, options);
}

export function getQrHtmlDataUrl(matrix: QrMatrix, options: QrRenderOptions): string {
  return svgToDataUrl(renderQrSvg(matrix, options));
}

export async function copyQrPng(matrix: QrMatrix, options: QrRenderOptions): Promise<void> {
  const blob = await exportQrPng(matrix, options);
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ]);
}