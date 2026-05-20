export type ShapePathFn = (x: number, y: number, s: number) => string;

/*
 * ─── Data Module Shapes ────────────────────────────────────
 */
const DATA_MODULE_SHAPES: Record<string, ShapePathFn> = {
  'square': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" />`,

  'square-sm': (x, y, s) => {
    const p = s * 0.125;
    return `<rect x="${x + p}" y="${y + p}" width="${s * 0.75}" height="${s * 0.75}" />`;
  },

  'rounded': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.25}" />`,

  'circle': (x, y, s) =>
    `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2 - 0.5}" />`,

  'diamond': (x, y, s) =>
    `<polygon points="${x + s / 2},${y} ${x + s},${y + s / 2} ${x + s / 2},${y + s} ${x},${y + s / 2}" />`,

  'hashtag': (x, y, s) => {
    const w1 = s * 0.15;
    const w2 = s * 0.15;
    const g1 = s * 0.25;
    const g2 = s * 0.6;
    return (
      `<rect x="${x + g1}" y="${y}" width="${w1}" height="${s}" />` +
      `<rect x="${x + g2}" y="${y}" width="${w2}" height="${s}" />` +
      `<rect x="${x}" y="${y + g1}" width="${s}" height="${w1}" />` +
      `<rect x="${x}" y="${y + g2}" width="${s}" height="${w2}" />`
    );
  },

  'heart': (x, y, s) =>
    `<path d="M${x + s / 2} ${y + s * 0.15} ` +
    `C${x + s * 0.6} ${y} ${x + s} ${y + s * 0.05} ${x + s} ${y + s * 0.4} ` +
    `C${x + s} ${y + s * 0.75} ${x + s / 2} ${y + s} ${x + s / 2} ${y + s} ` +
    `C${x + s / 2} ${y + s} ${x} ${y + s * 0.75} ${x} ${y + s * 0.4} ` +
    `C${x} ${y + s * 0.05} ${x + s * 0.4} ${y} ${x + s / 2} ${y + s * 0.15} Z" />`,

  'star': (x, y, s) => {
    const cx = x + s / 2;
    const cy = y + s / 2;
    const r = s / 2;
    const r2 = s * 0.19;
    const pts = [0, 1, 2, 3, 4].flatMap((i) => {
      const outer = -Math.PI / 2 + i * (2 * Math.PI) / 5;
      const inner = outer + Math.PI / 5;
      return [
        `${cx + r * Math.cos(outer)},${cy + r * Math.sin(outer)}`,
        `${cx + r2 * Math.cos(inner)},${cy + r2 * Math.sin(inner)}`,
      ];
    }).join(' ');
    return `<polygon points="${pts}" />`;
  },

  'leaf': (x, y, s) =>
    `<path d="M${x} ${y + s} Q${x + s * 0.5} ${y + s * 0.5} ${x + s} ${y} L${x + s} ${y + s} Z" />`,

  'pinched-square': (x, y, s) =>
    `<path d="M${x + 1} ${y} L${x + s - 1} ${y} ` +
    `Q${x + s} ${y} ${x + s} ${y + 1} ` +
    `L${x + s} ${y + s - 1} ` +
    `Q${x + s} ${y + s} ${x + s - 1} ${y + s} ` +
    `L${x + 1} ${y + s} ` +
    `Q${x} ${y + s} ${x} ${y + s - 1} ` +
    `L${x} ${y + 1} ` +
    `Q${x} ${y} ${x + 1} ${y} Z" />`,

  'horizontal-line': (x, y, s) => {
    const h = s * 0.25;
    return `<rect x="${x}" y="${y + (s - h) / 2}" width="${s}" height="${h}" />`;
  },

  'vertical-line': (x, y, s) => {
    const w = s * 0.25;
    return `<rect x="${x + (s - w) / 2}" y="${y}" width="${w}" height="${s}" />`;
  },

  'circuit-board': (x, y, s) => {
    const cx = s * 0.3;
    const cy = s * 0.3;
    const tw = s * 0.1;
    return (
      `<rect x="${x + (s - cx) / 2}" y="${y + (s - cy) / 2}" width="${cx}" height="${cy}" />` +
      `<rect x="${x}" y="${y + s / 2 - tw / 2}" width="${(s - cx) / 2}" height="${tw}" />` +
      `<rect x="${x + (s + cx) / 2}" y="${y + s / 2 - tw / 2}" width="${(s - cx) / 2}" height="${tw}" />` +
      `<rect x="${x + s / 2 - tw / 2}" y="${y}" width="${tw}" height="${(s - cy) / 2}" />` +
      `<rect x="${x + s / 2 - tw / 2}" y="${y + (s + cy) / 2}" width="${tw}" height="${(s - cy) / 2}" />`
    );
  },
};

/*
 * ─── Finder Inner Shapes ───────────────────────────────────
 * Each generates ONE unified shape covering the full 3×3 inner block.
 */
const FINDER_INNER_SHAPES: Record<string, ShapePathFn> = {
  'square': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" />`,

  'rounded': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.25}" />`,

  'rounded-sm': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.125}" />`,

  'rounded-lg': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.375}" />`,

  'circle': (x, y, s) =>
    `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2 - 0.5}" />`,

  'diamond': (x, y, s) =>
    `<polygon points="${x + s / 2},${y} ${x + s},${y + s / 2} ${x + s / 2},${y + s} ${x},${y + s / 2}" />`,

  'hashtag': (x, y, s) => {
    const w1 = s * 0.15;
    const w2 = s * 0.15;
    const g1 = s * 0.25;
    const g2 = s * 0.6;
    return (
      `<rect x="${x + g1}" y="${y}" width="${w1}" height="${s}" />` +
      `<rect x="${x + g2}" y="${y}" width="${w2}" height="${s}" />` +
      `<rect x="${x}" y="${y + g1}" width="${s}" height="${w1}" />` +
      `<rect x="${x}" y="${y + g2}" width="${s}" height="${w2}" />`
    );
  },

  'heart': (x, y, s) =>
    `<path d="M${x + s / 2} ${y + s * 0.15} ` +
    `C${x + s * 0.6} ${y} ${x + s} ${y + s * 0.05} ${x + s} ${y + s * 0.4} ` +
    `C${x + s} ${y + s * 0.75} ${x + s / 2} ${y + s} ${x + s / 2} ${y + s} ` +
    `C${x + s / 2} ${y + s} ${x} ${y + s * 0.75} ${x} ${y + s * 0.4} ` +
    `C${x} ${y + s * 0.05} ${x + s * 0.4} ${y} ${x + s / 2} ${y + s * 0.15} Z" />`,

  'star': (x, y, s) => {
    const cx = x + s / 2;
    const cy = y + s / 2;
    const r = s / 2;
    const r2 = s * 0.19;
    const pts = [0, 1, 2, 3, 4].flatMap((i) => {
      const outer = -Math.PI / 2 + i * (2 * Math.PI) / 5;
      const inner = outer + Math.PI / 5;
      return [
        `${cx + r * Math.cos(outer)},${cy + r * Math.sin(outer)}`,
        `${cx + r2 * Math.cos(inner)},${cy + r2 * Math.sin(inner)}`,
      ];
    }).join(' ');
    return `<polygon points="${pts}" />`;
  },

  'inpoint': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s * 0.5} ${y + s * 0.25} L${x + s} ${y} L${x + s * 0.75} ${y + s * 0.5} L${x + s} ${y + s} L${x + s * 0.5} ${y + s * 0.75} L${x} ${y + s} L${x + s * 0.25} ${y + s * 0.5} Z" />`,

  'inpoint-sm': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s * 0.5} ${y + s * 0.15} L${x + s} ${y} L${x + s * 0.85} ${y + s * 0.5} L${x + s} ${y + s} L${x + s * 0.5} ${y + s * 0.85} L${x} ${y + s} L${x + s * 0.15} ${y + s * 0.5} Z" />`,

  'inpoint-lg': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s * 0.5} ${y + s * 0.35} L${x + s} ${y} L${x + s * 0.65} ${y + s * 0.5} L${x + s} ${y + s} L${x + s * 0.5} ${y + s * 0.65} L${x} ${y + s} L${x + s * 0.35} ${y + s * 0.5} Z" />`,

  'outpoint': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} L${x + s * 0.65} ${y + s * 0.35} L${x + s} ${y + s * 0.5} L${x + s * 0.65} ${y + s * 0.65} L${x + s * 0.5} ${y + s} L${x + s * 0.35} ${y + s * 0.65} L${x} ${y + s * 0.5} L${x + s * 0.35} ${y + s * 0.35} Z" />`,

  'outpoint-sm': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} L${x + s * 0.6} ${y + s * 0.4} L${x + s} ${y + s * 0.5} L${x + s * 0.6} ${y + s * 0.6} L${x + s * 0.5} ${y + s} L${x + s * 0.4} ${y + s * 0.6} L${x} ${y + s * 0.5} L${x + s * 0.4} ${y + s * 0.4} Z" />`,

  'outpoint-lg': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} L${x + s * 0.7} ${y + s * 0.3} L${x + s} ${y + s * 0.5} L${x + s * 0.7} ${y + s * 0.7} L${x + s * 0.5} ${y + s} L${x + s * 0.3} ${y + s * 0.7} L${x} ${y + s * 0.5} L${x + s * 0.3} ${y + s * 0.3} Z" />`,

  'leaf': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} C${x + s} ${y + s * 0.3} ${x + s} ${y + s * 0.7} ${x + s * 0.5} ${y + s} C${x} ${y + s * 0.7} ${x} ${y + s * 0.3} ${x + s * 0.5} ${y} Z" />`,

  'leaf-sm': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} C${x + s * 0.85} ${y + s * 0.35} ${x + s * 0.85} ${y + s * 0.65} ${x + s * 0.5} ${y + s} C${x + s * 0.15} ${y + s * 0.65} ${x + s * 0.15} ${y + s * 0.35} ${x + s * 0.5} ${y} Z" />`,

  'leaf-lg': (x, y, s) =>
    `<path d="M${x + s * 0.5} ${y} C${x + s} ${y + s * 0.25} ${x + s} ${y + s * 0.75} ${x + s * 0.5} ${y + s} C${x} ${y + s * 0.75} ${x} ${y + s * 0.25} ${x + s * 0.5} ${y} Z" />`,

  'pinched-square': (x, y, s) =>
    `<path d="M${x + 1} ${y} L${x + s - 1} ${y} ` +
    `Q${x + s} ${y} ${x + s} ${y + 1} ` +
    `L${x + s} ${y + s - 1} ` +
    `Q${x + s} ${y + s} ${x + s - 1} ${y + s} ` +
    `L${x + 1} ${y + s} ` +
    `Q${x} ${y + s} ${x} ${y + s - 1} ` +
    `L${x} ${y + 1} ` +
    `Q${x} ${y} ${x + 1} ${y} Z" />`,

  'microchip': (x, y, s) => {
    const p = s * 0.12;
    const inner = s * 0.76;
    const pinW = s * 0.12;
    const pinH = s * 0.1;
    return (
      `<rect x="${x + p}" y="${y + p}" width="${inner}" height="${inner}" rx="${s * 0.06}" />` +
      `<rect x="${x + s / 2 - pinW / 2}" y="${y}" width="${pinW}" height="${pinH}" />` +
      `<rect x="${x + s / 2 - pinW / 2}" y="${y + s - pinH}" width="${pinW}" height="${pinH}" />` +
      `<rect x="${x}" y="${y + s / 2 - pinW / 2}" width="${pinH}" height="${pinW}" />` +
      `<rect x="${x + s - pinH}" y="${y + s / 2 - pinW / 2}" width="${pinH}" height="${pinW}" />` +
      `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.15}" />`
    );
  },
};

/*
 * ─── Finder Outer Shapes ───────────────────────────────────
 */
const FINDER_OUTER_SHAPES: Record<string, ShapePathFn> = {
  'square': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" />`,

  'rounded': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.25}" />`,

  'rounded-sm': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.125}" />`,

  'rounded-lg': (x, y, s) =>
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.375}" />`,

  'circle': (x, y, s) =>
    `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2 - 0.5}" />`,

  'inpoint': (x, y, s) =>
    `<path d="M${x + s} ${y + s} L${x} ${y + s} L${x} ${y} Z" />`,

  'inpoint-sm': (x, y, s) =>
    `<path d="M${x + s} ${y + s} L${x} ${y + s} Q${x + s * 0.25} ${y + s * 0.5} ${x} ${y} L${x + s} ${y} Z" />`,

  'inpoint-lg': (x, y, s) =>
    `<path d="M${x + s} ${y + s} L${x} ${y + s} Q${x} ${y + s * 0.5} ${x} ${y} L${x + s} ${y} Z" />`,

  'outpoint': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s} ${y} L${x} ${y + s} Z" />`,

  'outpoint-sm': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s} ${y} Q${x + s * 0.5} ${y + s * 0.25} ${x + s} ${y + s} L${x} ${y + s} Z" />`,

  'outpoint-lg': (x, y, s) =>
    `<path d="M${x} ${y} L${x + s} ${y} Q${x + s} ${y + s * 0.5} ${x + s} ${y + s} L${x} ${y + s} Z" />`,

  'leaf': (x, y, s) =>
    `<path d="M${x} ${y + s} Q${x + s * 0.5} ${y + s * 0.5} ${x + s} ${y} L${x + s} ${y + s} Z" />`,

  'leaf-sm': (x, y, s) =>
    `<path d="M${x} ${y + s} Q${x + s * 0.25} ${y + s * 0.5} ${x + s} ${y} L${x + s} ${y + s} Z" />`,

  'leaf-lg': (x, y, s) =>
    `<path d="M${x} ${y + s} Q${x + s * 0.75} ${y + s * 0.5} ${x + s} ${y} L${x + s} ${y + s} Z" />`,

  'pinched-square': (x, y, s) =>
    `<path d="M${x + 1} ${y} L${x + s - 1} ${y} ` +
    `Q${x + s} ${y} ${x + s} ${y + 1} ` +
    `L${x + s} ${y + s - 1} ` +
    `Q${x + s} ${y + s} ${x + s - 1} ${y + s} ` +
    `L${x + 1} ${y + s} ` +
    `Q${x} ${y + s} ${x} ${y + s - 1} ` +
    `L${x} ${y + 1} ` +
    `Q${x} ${y} ${x + 1} ${y} Z" />`,
};

/*
 * ─── Resolvers ─────────────────────────────────────────────
 */

export function getModulePath(x: number, y: number, s: number, style: string): string {
  const fn = DATA_MODULE_SHAPES[style] || DATA_MODULE_SHAPES['square'];
  return fn(x, y, s);
}

export function getFinderInnerPath(x: number, y: number, s: number, style: string): string {
  const fn = FINDER_INNER_SHAPES[style] || FINDER_INNER_SHAPES['square'];
  return fn(x, y, s);
}

export function getFinderOuterPath(x: number, y: number, s: number, style: string): string {
  const fn = FINDER_OUTER_SHAPES[style] || FINDER_OUTER_SHAPES['square'];
  return fn(x, y, s);
}

export const DATA_MODULE_STYLE_LIST = Object.keys(DATA_MODULE_SHAPES);
export const FINDER_INNER_STYLE_LIST = Object.keys(FINDER_INNER_SHAPES);
export const FINDER_OUTER_STYLE_LIST = Object.keys(FINDER_OUTER_SHAPES);

/*
 * ─── Unified Outer Ring ────────────────────────────────────
 * Generates a single SVG path for the outer ring (7×7 minus 5×5)
 * for every outer eye style. No more per-module rendering.
 */

export function getUnifiedOuterRing(
  cx: number,
  cy: number,
  m: number,
  style: string,
): string {
  const ox = cx - 3 * m;
  const oy = cy - 3 * m;
  const os = 7 * m;
  const ix = cx - 2 * m;
  const iy = cy - 2 * m;
  const is = 5 * m;

  if (style === 'square') {
    return `<path fill-rule="evenodd" d="M${ox} ${oy} L${ox + os} ${oy} L${ox + os} ${oy + os} L${ox} ${oy + os} Z M${ix} ${iy} L${ix + is} ${iy} L${ix + is} ${iy + is} L${ix} ${iy + is} Z" />`;
  }

  if (style === 'circle') {
    const outerR = 3.5 * m;
    const innerR = 2.5 * m;
    const ccx = cx + 0.5 * m;
    const ccy = cy + 0.5 * m;
    return `<path fill-rule="evenodd" d="M${ccx} ${ccy - outerR} A${outerR} ${outerR} 0 1 0 ${ccx} ${ccy + outerR} A${outerR} ${outerR} 0 1 0 ${ccx} ${ccy - outerR} Z M${ccx} ${ccy - innerR} A${innerR} ${innerR} 0 1 0 ${ccx} ${ccy + innerR} A${innerR} ${innerR} 0 1 0 ${ccx} ${ccy - innerR} Z" />`;
  }

  if (style === 'rounded-sm' || style === 'rounded' || style === 'rounded-lg') {
    const r = style === 'rounded-sm' ? 0.5 * m : style === 'rounded' ? 1.0 * m : 1.5 * m;
    return `<path fill-rule="evenodd" d="` +
      `M${ox + r} ${oy} L${ox + os - r} ${oy} ` +
      `A${r} ${r} 0 0 1 ${ox + os} ${oy + r} ` +
      `L${ox + os} ${oy + os - r} ` +
      `A${r} ${r} 0 0 1 ${ox + os - r} ${oy + os} ` +
      `L${ox + r} ${oy + os} ` +
      `A${r} ${r} 0 0 1 ${ox} ${oy + os - r} ` +
      `L${ox} ${oy + r} ` +
      `A${r} ${r} 0 0 1 ${ox + r} ${oy} Z ` +
      `M${ix + r} ${iy} L${ix + is - r} ${iy} ` +
      `A${r} ${r} 0 0 0 ${ix + is} ${iy + r} ` +
      `L${ix + is} ${iy + is - r} ` +
      `A${r} ${r} 0 0 0 ${ix + is - r} ${iy + is} ` +
      `L${ix + r} ${iy + is} ` +
      `A${r} ${r} 0 0 0 ${ix} ${iy + is - r} ` +
      `L${ix} ${iy + r} ` +
      `A${r} ${r} 0 0 0 ${ix + r} ${iy} Z" />`;
  }

  if (style === 'pinched-square') {
    const p = 0.12 * m;
    return `<path fill-rule="evenodd" d="` +
      `M${ox + p} ${oy} L${ox + os - p} ${oy} ` +
      `Q${ox + os} ${oy} ${ox + os} ${oy + p} ` +
      `L${ox + os} ${oy + os - p} ` +
      `Q${ox + os} ${oy + os} ${ox + os - p} ${oy + os} ` +
      `L${ox + p} ${oy + os} ` +
      `Q${ox} ${oy + os} ${ox} ${oy + os - p} ` +
      `L${ox} ${oy + p} ` +
      `Q${ox} ${oy} ${ox + p} ${oy} Z ` +
      `M${ix + p} ${iy} L${ix + is - p} ${iy} ` +
      `Q${ix + is} ${iy} ${ix + is} ${iy + p} ` +
      `L${ix + is} ${iy + is - p} ` +
      `Q${ix + is} ${iy + is} ${ix + is - p} ${iy + is} ` +
      `L${ix + p} ${iy + is} ` +
      `Q${ix} ${iy + is} ${ix} ${iy + is - p} ` +
      `L${ix} ${iy + p} ` +
      `Q${ix} ${iy} ${ix + p} ${iy} Z" />`;
  }

  if (style.startsWith('inpoint')) {
    const d = style === 'inpoint-sm' ? 0.3 * m : style === 'inpoint' ? 0.5 * m : 0.7 * m;
    return `<path fill-rule="evenodd" d="M${ox} ${oy} L${ox + os} ${oy} L${ox + os} ${oy + os} L${ox} ${oy + os} Z ` +
      `M${ix} ${iy} L${ix + 2 * m} ${iy} L${ix + 2.5 * m} ${iy + d} L${ix + 3 * m} ${iy} ` +
      `L${ix + is} ${iy} L${ix + is} ${iy + 2 * m} L${ix + is - d} ${iy + 2.5 * m} L${ix + is} ${iy + 3 * m} ` +
      `L${ix + is} ${iy + is} L${ix + 3 * m} ${iy + is} L${ix + 2.5 * m} ${iy + is - d} L${ix + 2 * m} ${iy + is} ` +
      `L${ix} ${iy + is} L${ix} ${iy + 3 * m} L${ix + d} ${iy + 2.5 * m} L${ix} ${iy + 2 * m} Z" />`;
  }

  if (style.startsWith('outpoint')) {
    const d = style === 'outpoint-sm' ? 0.3 * m : style === 'outpoint' ? 0.5 * m : 0.7 * m;
    return `<path fill-rule="evenodd" d="M${ox} ${oy + 2 * m} L${ox + 2 * m} ${oy} ` +
      `L${ox + 2.5 * m} ${oy - d} L${ox + 3 * m} ${oy} ` +
      `L${ox + os} ${oy} L${ox + os} ${oy + 2 * m} L${ox + os + d} ${oy + 2.5 * m} L${ox + os} ${oy + 3 * m} ` +
      `L${ox + os} ${oy + os} L${ox + 3 * m} ${oy + os} L${ox + 2.5 * m} ${oy + os + d} L${ox + 2 * m} ${oy + os} ` +
      `L${ox} ${oy + os} L${ox} ${oy + 3 * m} L${ox - d} ${oy + 2.5 * m} L${ox} ${oy + 2 * m} Z ` +
      `M${ix} ${iy} L${ix + is} ${iy} L${ix + is} ${iy + is} L${ix} ${iy + is} Z" />`;
  }

  if (style.startsWith('leaf')) {
    const d = style === 'leaf-sm' ? 0.2 * m : style === 'leaf' ? 0.35 * m : 0.5 * m;
    return `<path fill-rule="evenodd" d="M${ox} ${oy} Q${ox + 2.5 * m} ${oy - d} ${ox + os} ${oy} ` +
      `Q${ox + os + d} ${oy + 2.5 * m} ${ox + os} ${oy + os} ` +
      `Q${ox + 2.5 * m} ${oy + os + d} ${ox} ${oy + os} ` +
      `Q${ox - d} ${oy + 2.5 * m} ${ox} ${oy} Z ` +
      `M${ix} ${iy} Q${ix + 2.5 * m} ${iy + d} ${ix + is} ${iy} ` +
      `Q${ix + is - d} ${iy + 2.5 * m} ${ix + is} ${iy + is} ` +
      `Q${ix + 2.5 * m} ${iy + is - d} ${ix} ${iy + is} ` +
      `Q${ix + d} ${iy + 2.5 * m} ${ix} ${iy} Z" />`;
  }

  return `<path fill-rule="evenodd" d="M${ox} ${oy} L${ox + os} ${oy} L${ox + os} ${oy + os} L${ox} ${oy + os} Z M${ix} ${iy} L${ix + is} ${iy} L${ix + is} ${iy + is} L${ix} ${iy + is} Z" />`;
}