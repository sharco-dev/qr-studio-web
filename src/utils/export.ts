import jsPDF from 'jspdf';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import type { Block } from '../types/template';
import { generateMatrix } from '../lib/qr/matrix';
import { renderQrSvg, svgToDataUrl } from '../lib/qr/renderer';
import { buildQrOptions } from '../hooks/useQr';

export async function exportAsSvg(element: HTMLElement): Promise<void> {
  const dataUrl = await toSvg(element, { quality: 1 });
  downloadFile(dataUrl, 'template.svg');
}

export async function exportAsPng(element: HTMLElement): Promise<void> {
  const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
  downloadFile(dataUrl, 'template.png');
}

export async function exportAsJpg(element: HTMLElement): Promise<void> {
  const dataUrl = await toJpeg(element, { quality: 0.95, pixelRatio: 2 });
  downloadFile(dataUrl, 'template.jpg');
}

export async function exportAsPdf(element: HTMLElement): Promise<void> {
  const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [element.offsetWidth, element.offsetHeight],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
  pdf.save('template.pdf');
}

export async function copyToClipboard(element: HTMLElement): Promise<void> {
  try {
    const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
  } catch {
    throw new Error('Failed to copy to clipboard');
  }
}

export function generateHtmlEmail(blocks: Block[]): string {
  let body = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f5f5f5;">';
  body += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;"><tr><td align="center">';
  body += '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;margin:16px 0;">';

  for (const block of blocks) {
    body += blockToHtml(block);
  }

  body += '</table></td></tr></table></body></html>';
  return body;
}

export async function copyHtmlEmail(blocks: Block[]): Promise<void> {
  const html = generateHtmlEmail(blocks);
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob(['Email template copied'], { type: 'text/plain' }),
      }),
    ]);
  } catch {
    throw new Error('Failed to copy HTML email');
  }
}

function blockToHtml(block: Block): string {
  const padding = block.styles.padding || 16;
  const textAlign = block.styles.textAlign || 'center';
  const bgColor = block.styles.backgroundColor || '#ffffff';

  switch (block.type) {
    case 'header': {
      const hLevel = block.level;
      const tag = `h${hLevel}`;
      return `<tr><td style="padding:${padding}px;text-align:${textAlign};background-color:${bgColor};">
        <${tag} style="margin:0;font-family:Arial,sans-serif;">${block.content}</${tag}>
      </td></tr>`;
    }
    case 'text':
      return `<tr><td style="padding:${padding}px;text-align:${textAlign};background-color:${bgColor};">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;">${block.content}</p>
      </td></tr>`;
    case 'image':
      return `<tr><td style="padding:${padding}px;text-align:${textAlign};background-color:${bgColor};">
        <img src="${block.src}" alt="${block.alt}" style="max-width:100%;height:auto;" />
      </td></tr>`;
    case 'divider':
      return `<tr><td style="padding:${padding}px;background-color:${bgColor};">
        <hr style="border:none;border-top:${block.lineWidth}px ${block.lineStyle} ${block.lineColor};margin:0;" />
      </td></tr>`;
    case 'spacer':
      return `<tr><td style="padding:0;background-color:${bgColor};height:${block.height}px;font-size:1px;line-height:1px;">&nbsp;</td></tr>`;
    case 'footer':
      return `<tr><td style="padding:${padding}px;text-align:${textAlign};background-color:${bgColor};">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#666;">${block.content}</p>
      </td></tr>`;
    case 'qr': {
      try {
        const matrix = generateMatrix(block.config.url || 'https://example.com');
        if (!matrix) return '';
        const options = buildQrOptions(
          block.config.url,
          block.config.moduleStyle,
          block.config.innerEyeStyle,
          block.config.outerEyeStyle,
          block.config.fgColor,
          block.config.bgColor,
          block.config.logoUrl || '',
          block.config.logoSize,
          block.config.logoPadding || 0,
          block.config.size
        );
        const svg = renderQrSvg(matrix, options);
        const dataUrl = svgToDataUrl(svg);
        return `<tr><td style="padding:${padding}px;text-align:center;background-color:${bgColor};">
          <img src="${dataUrl}" alt="QR Code" style="width:${block.config.size}px;height:${block.config.size}px;" />
        </td></tr>`;
      } catch {
        return '';
      }
    }
    default:
      return '';
  }
}

function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}