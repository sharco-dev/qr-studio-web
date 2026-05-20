import { getFinderInnerPath, getUnifiedOuterRing } from './shapes';

export function renderFinderEyes(
  modules: boolean[][],
  size: number,
  quietZone: number,
  moduleSize: number,
  innerEyeStyle: string,
  outerEyeStyle: string,
): string {
  let svg = '';

  const finderCenters = [
    { row: 3, col: 3 },
    { row: 3, col: size - 4 },
    { row: size - 4, col: 3 },
  ];

  for (const { row: centerRow, col: centerCol } of finderCenters) {
    const centerX = (centerCol + quietZone) * moduleSize;
    const centerY = (centerRow + quietZone) * moduleSize;

    svg += `    ${getUnifiedOuterRing(centerX, centerY, moduleSize, outerEyeStyle)}\n`;

    if (modules[centerRow][centerCol]) {
      const innerX = (centerCol - 1 + quietZone) * moduleSize;
      const innerY = (centerRow - 1 + quietZone) * moduleSize;
      const innerS = 3 * moduleSize;
      svg += `    ${getFinderInnerPath(innerX, innerY, innerS, innerEyeStyle)}\n`;
    }
  }

  return svg;
}