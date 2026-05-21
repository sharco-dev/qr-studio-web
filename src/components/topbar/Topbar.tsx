import { useState } from "react"
import { useEditorStore } from '../../store/editorStore';
import { AddBlockMenu } from "../canvas/AddBlockMenu";

export function Topbar () {

    const addBlock = useEditorStore((s) => s.addBlock);
    const blocks = useEditorStore((s) => s.blocks);
    const undo = useEditorStore((s) => s.undo);
    const redo = useEditorStore((s) => s.redo);
    const historyIndex = useEditorStore((s) => s.historyIndex);
    const history = useEditorStore((s) => s.history);
    const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
    const sidebarOpen = useEditorStore((s) => s.sidebarOpen);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [addBtnPos, setAddBtnPos] = useState({ x: 0, y: 0 });
    
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const getExportEl = (): HTMLElement | null => {
        return document.getElementById('export-root');
    };

    const handleExport = async (format: string) => {
        setExportOpen(false);
        const el = getExportEl();
        if (!el) return;

        if (el.clientWidth === 0 || el.children.length === 0) {
            console.warn('Export root has no content or zero width');
            return;
        }

        try {
            switch (format) {
                case 'svg': {
                    const { exportAsSvg } = await import('../../utils/export.ts');
                    await exportAsSvg(el);
                    break;
                }
                case 'png': {
                    const { exportAsPng } = await import('../../utils/export.ts');
                    await exportAsPng(el);
                    break;
                }
                case 'jpg': {
                    const { exportAsJpg } = await import('../../utils/export.ts');
                    await exportAsJpg(el);
                    break;
                }
                case 'pdf': {
                    const { exportAsPdf } = await import('../../utils/export.ts');
                    await exportAsPdf(el);
                    break;
                }
                case 'html': {
                    const { generateHtmlEmail } = await import('../../utils/export.ts');
                    const html = generateHtmlEmail(blocks);
                    const blob = new Blob([html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'template.html';
                    a.click();
                    URL.revokeObjectURL(url);
                    break;
                }
                case 'copy-png': {
                    const { copyToClipboard } = await import('../../utils/export.ts');
                    await copyToClipboard(el);
                    break;
                }
                case 'copy-html': {
                    const { copyHtmlEmail } = await import('../../utils/export.ts');
                    await copyHtmlEmail(blocks);
                    break;
                }
            }
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <header className="topbar">
            <div className="topbar__left">
                <button
                    className="topbar__btn"
                    onClick={toggleSidebar}
                    title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                >
                    {sidebarOpen ? '◀' : '▶'}
                </button>
                <h2>qr-studio</h2>
            </div>
            <div className="topbar__right">
                <div className="topbar__group">
                    <button
                        className="topbar__btn topbar__btn--primary"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setAddBtnPos({ x: rect.left, y: rect.bottom + 4 });
                            setAddMenuOpen(true);
                        }}
                    >
                        + Add Block
                    </button>

                    <div className="topbar__dropdown-wrapper">
                        <button
                            className="topbar__btn"
                            onClick={() => setExportOpen(!exportOpen)}
                        >
                            Export ▾
                        </button>
                        {exportOpen && (
                            <div className="topbar__dropdown">
                                <button className="topbar__dropdown-item" onClick={() => handleExport('svg')}>Export SVG</button>
                                <button className="topbar__dropdown-item" onClick={() => handleExport('png')}>Export PNG</button>
                                <button className="topbar__dropdown-item" onClick={() => handleExport('jpg')}>Export JPG</button>
                                <button className="topbar__dropdown-item" onClick={() => handleExport('pdf')}>Export PDF</button>
                                <button className="topbar__dropdown-item" onClick={() => handleExport('html')}>Export HTML</button>
                                <div className="topbar__dropdown-divider" />
                                <button className="topbar__dropdown-item" onClick={() => handleExport('copy-png')}>Copy PNG</button>
                                <button className="topbar__dropdown-item" onClick={() => handleExport('copy-html')}>Copy HTML</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="topbar__group">
                    <button className="topbar__btn" disabled={!canUndo} onClick={undo} title="Undo">
                        ↩
                    </button>
                    <button className="topbar__btn" disabled={!canRedo} onClick={redo} title="Redo">
                        ↪
                    </button>
                </div>
            </div>
            { addMenuOpen && (
                <>
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setAddMenuOpen(false)} />
                    <AddBlockMenu
                        x={addBtnPos.x}
                        y={addBtnPos.y}
                        onSelect={(type) => {
                        addBlock(type as any);
                        setAddMenuOpen(false);
                        }}
                        onClose={() => setAddMenuOpen(false)}
                    />
                </>
            )}
            { exportOpen && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                    onClick={() => setExportOpen(false)}
                />
            )}
        </header>
    );
}