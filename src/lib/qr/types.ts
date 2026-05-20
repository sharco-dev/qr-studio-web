import type { QRModuleStyle } from '../../types/template';

export interface QrMatrix {
  size: number;
  modules: boolean[][];
}

export interface QrRenderOptions {
  moduleStyle: QRModuleStyle;
  innerEyeStyle: QRModuleStyle;
  outerEyeStyle: QRModuleStyle;
  fgColor: string;
  bgColor: string;
  logoUrl: string;
  logoSize: number;
  logoPadding: number;
  width: number;
  height: number;
  quietZone: number;
}

export interface QrSvgComponents {
  background: string;
  modules: string;
  eyes: string;
  logo: string;
}