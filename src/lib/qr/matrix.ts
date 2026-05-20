// QR matrix generation using Nayuki QR Code Generator
// https://github.com/nayuki/QR-Code-generator

import type { QrMatrix } from './types';

const QrCodeEcc = {
  LOW: 0,
  MEDIUM: 1,
  QUARTILE: 2,
  HIGH: 3,
} as const;

// ECC ordinal (0-3) -> formatBits for QR format encoding
const ECC_FORMAT_BITS = [1, 0, 3, 2];

class QrCode {
  readonly version: number;
  readonly size: number;
  readonly modules: boolean[][];
  private readonly isFunction: boolean[][];
  private readonly eclIndex: number;

  constructor(version: number, ecl: number, dataCodewords: number[], msk: number) {
    if (version < 1 || version > 40) throw new RangeError('Version out of range');
    if (msk < -1 || msk > 7) throw new RangeError('Mask out of range');
    this.version = version;
    this.size = version * 4 + 17;
    this.eclIndex = ecl;

    this.modules = [];
    this.isFunction = [];
    for (let i = 0; i < this.size; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < this.size; j++) row.push(false);
      this.modules.push(row.slice());
      this.isFunction.push(row.slice());
    }

    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);

    if (msk === -1) {
      let minPenalty = 1000000000;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          msk = i;
          minPenalty = penalty;
        }
        this.applyMask(i);
      }
    }

    this.mask = msk;
    this.applyMask(msk);
    this.drawFormatBits(msk);
  }

  readonly mask: number;

  getModule(x: number, y: number): boolean {
    return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);

    const alignPatPos = this.getAlignmentPatternPositions();
    const numAlign = alignPatPos.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (!(i === 0 && j === 0 || i === 0 && j === numAlign - 1 || i === numAlign - 1 && j === 0))
          this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
      }
    }
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFormatBits(mask: number): void {
    const formatBits = ECC_FORMAT_BITS[this.eclIndex];
    const data = formatBits << 3 | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = (data << 10 | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, ((bits >>> i) & 1) !== 0);
    this.setFunctionModule(8, 7, ((bits >>> 6) & 1) !== 0);
    this.setFunctionModule(8, 8, ((bits >>> 7) & 1) !== 0);
    this.setFunctionModule(7, 8, ((bits >>> 8) & 1) !== 0);
    for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, ((bits >>> i) & 1) !== 0);

    for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, ((bits >>> i) & 1) !== 0);
    for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, ((bits >>> i) & 1) !== 0);
    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    const bits = this.version << 12 | rem;
    for (let i = 0; i < 18; i++) {
      const color = ((bits >>> i) & 1) !== 0;
      const a = this.size - 11 + i % 3;
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++)
        this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ver = this.version;
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[this.eclIndex][ver];
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[this.eclIndex][ver];
    const rawCodewords = Math.floor(getNumRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - rawCodewords % numBlocks;
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: number[][] = [];
    const rsDiv = reedSolomonComputeDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
      k += dat.length;
      const ecc = reedSolomonComputeRemainder(dat, rsDiv);
      if (i < numShortBlocks) dat.push(0);
      blocks.push(dat.concat(ecc));
    }

    const result: number[] = [];
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, j) => {
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks)
          result.push(block[i]);
      });
    }
    return result;
  }

  private drawCodewords(data: number[]): void {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert = false;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = x * y % 2 + x * y % 3 === 0; break;
          case 6: invert = (x * y % 2 + x * y % 3) % 2 === 0; break;
          case 7: invert = ((x + y) % 2 + x * y % 3) % 2 === 0; break;
        }
        if (!this.isFunction[y][x] && invert)
          this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;

    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runX = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) {
          runX++;
          if (runX === 5) result += 3;
          else if (runX > 5) result++;
        } else {
          this.finderPenaltyAddHistory(runX, runHistory);
          if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * 40;
          runColor = this.modules[y][x];
          runX = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * 40;
    }

    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runY = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) {
          runY++;
          if (runY === 5) result += 3;
          else if (runY > 5) result++;
        } else {
          this.finderPenaltyAddHistory(runY, runHistory);
          if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * 40;
          runColor = this.modules[y][x];
          runY = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * 40;
    }

    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.modules[y][x];
        if (color === this.modules[y][x + 1] && color === this.modules[y + 1][x] && color === this.modules[y + 1][x + 1])
          result += 3;
      }
    }

    let dark = 0;
    for (const row of this.modules) dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
    const total = this.size * this.size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    if (k >= 0) result += k * 10;

    return result;
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) return [];
    const numAlign = Math.floor(this.version / 7) + 2;
    const step = Math.floor((this.version * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
    const result: number[] = [6];
    for (let pos = this.size - 7; result.length < numAlign; pos -= step)
      result.splice(1, 0, pos);
    return result;
  }

  private finderPenaltyCountPatterns(runHistory: number[]): number {
    const n = runHistory[1];
    const core = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 && runHistory[4] === n && runHistory[5] === n;
    return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0)
         + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
  }

  private finderPenaltyTerminateAndCount(currentRunColor: boolean, currentRunLength: number, runHistory: number[]): number {
    if (currentRunColor) {
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      currentRunLength = 0;
    }
    currentRunLength += this.size;
    this.finderPenaltyAddHistory(currentRunLength, runHistory);
    return this.finderPenaltyCountPatterns(runHistory);
  }

  private finderPenaltyAddHistory(currentRunLength: number, runHistory: number[]): void {
    if (runHistory[0] === 0) currentRunLength += this.size;
    runHistory.pop();
    runHistory.unshift(currentRunLength);
  }
}

function getNumRawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function getNumDataCodewords(ver: number, eclIndex: number): number {
  return Math.floor(getNumRawDataModules(ver) / 8)
    - ECC_CODEWORDS_PER_BLOCK[eclIndex][ver]
    * NUM_ERROR_CORRECTION_BLOCKS[eclIndex][ver];
}

function reedSolomonComputeDivisor(degree: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < degree - 1; i++) result.push(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonComputeRemainder(data: number[], divisor: number[]): number[] {
  const result: number[] = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coef, i) => result[i] ^= reedSolomonMultiply(coef, factor));
  }
  return result;
}

function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11D);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

// Ordered by ECC ordinal: 0=LOW, 1=MEDIUM, 2=QUARTILE, 3=HIGH
const ECC_CODEWORDS_PER_BLOCK: number[][] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];

const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

class QrSegment {
  readonly mode: { modeBits: number; numCharCountBits: (ver: number) => number };
  readonly numChars: number;
  private readonly bitData: number[];

  constructor(mode: { modeBits: number; numCharCountBits: (ver: number) => number }, numChars: number, bitData: number[]) {
    this.mode = mode;
    this.numChars = numChars;
    this.bitData = bitData.slice();
  }

  getData(): number[] {
    return this.bitData.slice();
  }

  static makeBytes(data: number[]): QrSegment {
    const bb: number[] = [];
    for (const b of data) {
      for (let i = 7; i >= 0; i--) bb.push((b >>> i) & 1);
    }
    return new QrSegment(QrSegment.Mode.BYTE, data.length, bb);
  }

  static makeNumeric(digits: string): QrSegment {
    const bb: number[] = [];
    for (let i = 0; i < digits.length;) {
      const n = Math.min(digits.length - i, 3);
      const val = parseInt(digits.substring(i, i + n), 10);
      const bits = n * 3 + 1;
      for (let j = bits - 1; j >= 0; j--) bb.push((val >>> j) & 1);
      i += n;
    }
    return new QrSegment(QrSegment.Mode.NUMERIC, digits.length, bb);
  }

  static makeAlphanumeric(text: string): QrSegment {
    const bb: number[] = [];
    let i: number;
    for (i = 0; i + 2 <= text.length; i += 2) {
      let temp = ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
      temp += ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
      for (let j = 10; j >= 0; j--) bb.push((temp >>> j) & 1);
    }
    if (i < text.length) {
      const val = ALPHANUMERIC_CHARSET.indexOf(text.charAt(i));
      for (let j = 5; j >= 0; j--) bb.push((val >>> j) & 1);
    }
    return new QrSegment(QrSegment.Mode.ALPHANUMERIC, text.length, bb);
  }

  static makeSegments(text: string): QrSegment[] {
    if (text === '') return [];
    if (QrSegment.isNumeric(text)) return [QrSegment.makeNumeric(text)];
    if (QrSegment.isAlphanumeric(text)) return [QrSegment.makeAlphanumeric(text)];
    return [QrSegment.makeBytes(toUtf8ByteArray(text))];
  }

  static isNumeric(text: string): boolean {
    return /^[0-9]*$/.test(text);
  }

  static isAlphanumeric(text: string): boolean {
    return /^[A-Z0-9 $%*+./:.-]*$/.test(text);
  }

  static getTotalBits(segs: QrSegment[], version: number): number {
    let result = 0;
    for (const seg of segs) {
      const ccbits = seg.mode.numCharCountBits(version);
      if (seg.numChars >= (1 << ccbits)) return Infinity;
      result += 4 + ccbits + seg.bitData.length;
    }
    return result;
  }

  static Mode = {
    NUMERIC: { modeBits: 0x1, numCharCountBits: (ver: number) => [10, 12, 14][Math.floor((ver + 7) / 17)] },
    ALPHANUMERIC: { modeBits: 0x2, numCharCountBits: (ver: number) => [9, 11, 13][Math.floor((ver + 7) / 17)] },
    BYTE: { modeBits: 0x4, numCharCountBits: (ver: number) => [8, 16, 16][Math.floor((ver + 7) / 17)] },
    KANJI: { modeBits: 0x8, numCharCountBits: (ver: number) => [8, 10, 12][Math.floor((ver + 7) / 17)] },
    ECI: { modeBits: 0x7, numCharCountBits: () => 0 },
  };
}

const ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

function toUtf8ByteArray(str: string): number[] {
  str = encodeURI(str);
  const result: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) !== '%') result.push(str.charCodeAt(i));
    else {
      result.push(parseInt(str.substring(i + 1, i + 3), 16));
      i += 2;
    }
  }
  return result;
}

function appendBits(val: number, len: number, bb: number[]): void {
  for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1);
}

function encodeSegments(segs: QrSegment[], ecl: number, minVersion = 1, maxVersion = 40): QrCode {
  let version: number;

  for (version = minVersion; ; version++) {
    const dataCapacityBits = getNumDataCodewords(version, ecl) * 8;
    const usedBits = QrSegment.getTotalBits(segs, version);
    if (usedBits <= dataCapacityBits) {
      break;
    }
    if (version >= maxVersion) throw new Error('Data too long');
  }

  const bb: number[] = [];
  for (const seg of segs) {
    appendBits(seg.mode.modeBits, 4, bb);
    appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
    for (const b of seg.getData()) bb.push(b);
  }

  const dataCapacityBits = getNumDataCodewords(version, ecl) * 8;
  appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
  appendBits(0, (8 - bb.length % 8) % 8, bb);

  for (let padByte = 0xEC; bb.length < dataCapacityBits; padByte ^= 0xEC ^ 0x11)
    appendBits(padByte, 8, bb);

  const dataCodewords: number[] = [];
  while (dataCodewords.length * 8 < bb.length) dataCodewords.push(0);
  bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << (7 - (i & 7)));

  const qr = new QrCode(version, ecl, dataCodewords, -1);
  return qr;
}

export function generateMatrix(text: string, ecl: number = QrCodeEcc.MEDIUM): QrMatrix {
  if (!text) throw new Error('Cannot generate QR matrix for empty text');
  const segs = QrSegment.makeSegments(text);
  const qr = encodeSegments(segs, ecl);
  return {
    size: qr.size,
    modules: qr.modules.map(row => [...row]),
  };
}