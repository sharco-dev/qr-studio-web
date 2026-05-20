export type QRModuleStyle =
  | 'square'
  | 'square-sm'
  | 'rounded'
  | 'rounded-sm'
  | 'rounded-lg'
  | 'circle'
  | 'diamond'
  | 'hashtag'
  | 'heart'
  | 'star'
  | 'inpoint'
  | 'inpoint-sm'
  | 'inpoint-lg'
  | 'outpoint'
  | 'outpoint-sm'
  | 'outpoint-lg'
  | 'horizontal-line'
  | 'vertical-line'
  | 'circuit-board'
  | 'microchip';

export type BlockType = 'qr' | 'text' | 'image' | 'header' | 'footer' | 'divider' | 'spacer';

export type TextAlign = 'left' | 'center' | 'right'
export type FontWeight = 'normal' | 'bold' | 'light';
export type SidebarPosition = 'left' | 'right';
export type PreviewMode = 'mobile' | 'desktop';
export type ThemeMode = 'light' | 'dark';

export interface QRConfig {
  url: string;
  fgColor: string;
  bgColor: string;
  moduleStyle: QRModuleStyle;
  innerEyeStyle: QRModuleStyle;
  outerEyeStyle: QRModuleStyle;
  logoUrl: string;
  logoSize: number;
  logoPadding: number;
  size: number;
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
}

export interface BlockStyles {
  backgroundColor: string;
  textAlign: TextAlign;
  padding: number;
  margin: number;
  typography: TypographySettings;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  styles: BlockStyles;
}

export interface QRBlock extends BaseBlock {
  type: 'qr';
  config: QRConfig;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  content: string;
  level: 1 | 2 | 3;
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  content: string;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  lineStyle: 'solid' | 'dashed' | 'dotted';
  lineColor: string;
  lineWidth: number;
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  height: number;
}

export type Block = QRBlock | TextBlock | ImageBlock | HeaderBlock | FooterBlock | DividerBlock | SpacerBlock;

export interface TemplateConfig {
  canvasWidth: number;
  canvasHeight: number;
  qrSize: number;
}

export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  sidebarPosition: SidebarPosition;
  sidebarOpen: boolean;
  previewMode: PreviewMode;
  themeMode: ThemeMode;
  templateConfig: TemplateConfig;
  clipboard: Block | null;
}