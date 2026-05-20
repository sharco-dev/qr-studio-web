import { create } from 'zustand';
import type {
  Block,
  QRBlock,
  TextBlock,
  ImageBlock,
  HeaderBlock,
  FooterBlock,
  DividerBlock,
  SpacerBlock,
  BlockType,
  SidebarPosition,
  PreviewMode,
  ThemeMode,
  TemplateConfig,
  QRConfig,
  BlockStyles,
  EditorState as EditorStateType,
} from '../types/template';
import { saveState, loadState } from '../utils/persistence';

const DEFAULT_QR_CONFIG: QRConfig = {
  url: 'https://example.com',
  fgColor: '#000000',
  bgColor: '#ffffff',
  moduleStyle: 'square',
  innerEyeStyle: 'square',
  outerEyeStyle: 'square',
  logoUrl: '',
  logoSize: 30,
  logoPadding: 0,
  size: 200,
};

const DEFAULT_STYLES: BlockStyles = {
  backgroundColor: '#ffffff',
  textAlign: 'center',
  padding: 16,
  margin: 8,
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
  },
};

const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  qrSize: 200,
};

function createBlock(type: BlockType, overrides?: Record<string, unknown>): Block {
  const id = crypto.randomUUID();
  const base = { id, type, styles: { ...DEFAULT_STYLES } };

  switch (type) {
    case 'qr':
      return { ...base, type: 'qr' as const, config: { ...DEFAULT_QR_CONFIG, ...((overrides?.config as Record<string, unknown>) || {}) } } as QRBlock;
    case 'text':
      return { ...base, type: 'text' as const, content: (overrides?.content as string) || 'Enter your text here' } as TextBlock;
    case 'image':
      return { ...base, type: 'image' as const, src: (overrides?.src as string) || '', alt: (overrides?.alt as string) || '', width: (overrides?.width as number) || 300, height: (overrides?.height as number) || 200 } as ImageBlock;
    case 'header':
      return { ...base, type: 'header' as const, content: (overrides?.content as string) || 'Heading', level: (overrides?.level as number) || 1 } as HeaderBlock;
    case 'footer':
      return { ...base, type: 'footer' as const, content: (overrides?.content as string) || 'Footer content' } as FooterBlock;
    case 'divider':
      return { ...base, type: 'divider' as const, lineStyle: (overrides?.lineStyle as string) || 'solid', lineColor: (overrides?.lineColor as string) || '#cccccc', lineWidth: (overrides?.lineWidth as number) || 1 } as DividerBlock;
    case 'spacer':
      return { ...base, type: 'spacer' as const, height: (overrides?.height as number) || 20 } as SpacerBlock;
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}

export interface HistoryEntry {
  blocks: Block[];
  selectedBlockId: string | null;
}

export interface EditorStore {
  blocks: Block[];
  selectedBlockId: string | null;
  sidebarPosition: SidebarPosition;
  sidebarOpen: boolean;
  previewMode: PreviewMode;
  themeMode: ThemeMode;
  templateConfig: TemplateConfig;
  clipboard: Block | null;
  history: HistoryEntry[];
  historyIndex: number;

  addBlock: (type: BlockType, afterId?: string) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  selectBlock: (id: string | null) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;

  setSidebarPosition: (position: SidebarPosition) => void;
  toggleSidebar: () => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setTemplateConfig: (config: Partial<TemplateConfig>) => void;

  copyBlock: (id: string) => void;
  pasteBlock: (afterId?: string) => void;
  duplicateBlock: (id: string) => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  getState: () => EditorStateType;
  loadState: (state: EditorStateType) => void;
}

let historyTimer: ReturnType<typeof setTimeout> | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;

export const useEditorStore = create<EditorStore>((set, get) => {
  const savedState = loadState();
  const initialBlocks: Block[] = savedState?.blocks || [createBlock('qr')];

  const initialState: EditorStore = {
    blocks: initialBlocks,
    selectedBlockId: savedState?.selectedBlockId || null,
    sidebarPosition: savedState?.sidebarPosition || 'left',
    sidebarOpen: savedState?.sidebarOpen ?? true,
    previewMode: savedState?.previewMode || 'desktop',
    themeMode: savedState?.themeMode || 'light',
    templateConfig: savedState?.templateConfig || DEFAULT_TEMPLATE_CONFIG,
    clipboard: null,
    history: [{ blocks: initialBlocks, selectedBlockId: savedState?.selectedBlockId || null }],
    historyIndex: 0,

    addBlock: (type: BlockType, afterId?: string) => {
      const newBlock = createBlock(type);
      set((state) => {
        const idx = afterId ? state.blocks.findIndex((b) => b.id === afterId) : state.blocks.length - 1;
        const blocks = [...state.blocks];
        blocks.splice(idx + 1, 0, newBlock);
        return { blocks, selectedBlockId: newBlock.id };
      });
      setTimeout(() => get().pushHistory(), 0);
    },

    removeBlock: (id: string) => {
      const block = get().blocks.find((b) => b.id === id);
      if (block?.type === 'qr' && get().blocks.filter((b) => b.type === 'qr').length <= 1) return;
      set((state) => {
        const blocks = state.blocks.filter((b) => b.id !== id);
        const selectedBlockId = state.selectedBlockId === id ? null : state.selectedBlockId;
        return { blocks, selectedBlockId };
      });
      setTimeout(() => get().pushHistory(), 0);
    },

    updateBlock: (id: string, updates: Partial<Block>) => {
      set((state) => {
        const blocks = state.blocks.map((b) => (b.id === id ? { ...b, ...updates } as Block : b));
        return { blocks };
      });
      if (historyTimer) clearTimeout(historyTimer);
      historyTimer = setTimeout(() => {
        historyTimer = null;
        get().pushHistory();
      }, 200);
    },

    selectBlock: (id: string | null) => {
      set({ selectedBlockId: id });
    },

    moveBlockUp: (id: string) => {
      const state = get();
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return;
      const blocks = [...state.blocks];
      [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
      set({ blocks });
      setTimeout(() => get().pushHistory(), 0);
    },

    moveBlockDown: (id: string) => {
      const state = get();
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx < 0 || idx >= state.blocks.length - 1) return;
      const blocks = [...state.blocks];
      [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
      set({ blocks });
      setTimeout(() => get().pushHistory(), 0);
    },

    reorderBlocks: (blocks: Block[]) => {
      set({ blocks });
      setTimeout(() => get().pushHistory(), 0);
    },

    setSidebarPosition: (position: SidebarPosition) => {
      set({ sidebarPosition: position });
    },

    toggleSidebar: () => {
      set((s) => ({ sidebarOpen: !s.sidebarOpen }));
    },

    setPreviewMode: (mode: PreviewMode) => {
      set({ previewMode: mode });
    },

    setThemeMode: (mode: ThemeMode) => {
      set({ themeMode: mode });
    },

    setTemplateConfig: (config: Partial<TemplateConfig>) => {
      set((s) => ({ templateConfig: { ...s.templateConfig, ...config } }));
      setTimeout(() => get().pushHistory(), 0);
    },

    copyBlock: (id: string) => {
      const block = get().blocks.find((b) => b.id === id);
      if (block) set({ clipboard: { ...block, id: crypto.randomUUID() } });
    },

    pasteBlock: (afterId?: string) => {
      const state = get();
      if (!state.clipboard) return;
      const newBlock = { ...state.clipboard, id: crypto.randomUUID() } as Block;
      const idx = afterId ? state.blocks.findIndex((b) => b.id === afterId) : state.blocks.length - 1;
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, newBlock);
      set({ blocks, selectedBlockId: newBlock.id });
      setTimeout(() => get().pushHistory(), 0);
    },

    duplicateBlock: (id: string) => {
      const state = get();
      const block = state.blocks.find((b) => b.id === id);
      if (!block) return;
      const newBlock = { ...block, id: crypto.randomUUID() } as Block;
      const idx = state.blocks.findIndex((b) => b.id === id);
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, newBlock);
      set({ blocks, selectedBlockId: newBlock.id });
      setTimeout(() => get().pushHistory(), 0);
    },

    undo: () => {
      const state = get();
      if (state.historyIndex <= 0) return;
      const newIndex = state.historyIndex - 1;
      const entry = state.history[newIndex];
      set({
        blocks: JSON.parse(JSON.stringify(entry.blocks)),
        selectedBlockId: entry.selectedBlockId,
        historyIndex: newIndex,
      });
    },

    redo: () => {
      const state = get();
      if (state.historyIndex >= state.history.length - 1) return;
      const newIndex = state.historyIndex + 1;
      const entry = state.history[newIndex];
      set({
        blocks: JSON.parse(JSON.stringify(entry.blocks)),
        selectedBlockId: entry.selectedBlockId,
        historyIndex: newIndex,
      });
    },

    pushHistory: () => {
      const state = get();
      const entry: HistoryEntry = {
        blocks: JSON.parse(JSON.stringify(state.blocks)),
        selectedBlockId: state.selectedBlockId,
      };
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(entry);
      if (history.length > 50) history.shift();
      set({ history, historyIndex: history.length - 1 });
    },

    getState: () => ({
      blocks: get().blocks,
      selectedBlockId: get().selectedBlockId,
      sidebarPosition: get().sidebarPosition,
      sidebarOpen: get().sidebarOpen,
      previewMode: get().previewMode,
      themeMode: get().themeMode,
      templateConfig: get().templateConfig,
      clipboard: get().clipboard,
    }),

    loadState: (state: EditorStateType) => {
      set({
        blocks: state.blocks,
        selectedBlockId: state.selectedBlockId,
        sidebarPosition: state.sidebarPosition,
        sidebarOpen: state.sidebarOpen,
        previewMode: state.previewMode,
        themeMode: state.themeMode,
        templateConfig: state.templateConfig,
      });
    },
  };

  return initialState;
});

(window as any).__editorStore = useEditorStore;

useEditorStore.subscribe((state) => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    const { history: _h, historyIndex: _i, ...persistable } = state;
    saveState({
      blocks: persistable.blocks,
      selectedBlockId: persistable.selectedBlockId,
      sidebarPosition: persistable.sidebarPosition,
      sidebarOpen: persistable.sidebarOpen,
      previewMode: persistable.previewMode,
      themeMode: persistable.themeMode,
      templateConfig: persistable.templateConfig,
      clipboard: null,
    });
  }, 300);
});