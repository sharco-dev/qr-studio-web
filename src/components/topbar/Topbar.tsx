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
    const previewMode = useEditorStore((s) => s.previewMode);
    const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [addBtnPos, setAddBtnPos] = useState({ x: 0, y: 0 });

    return (
        <header className="topbar">
            <div className="topbar__left">
                <div className="topbar__group">
                    <button
                    className="topbar__btn"
                >
                    {'▶'}
                </button>
                <h2>qr-studio</h2>
                </div>
            </div>
            <div className="topbar__right">
                <div className="topbar__group">
                    <button
                        className="topbar__btn topbar__btn--primary"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            console.log("EVENTO")
                            setAddBtnPos({ x: rect.left, y: rect.bottom + 4 });
                            setAddMenuOpen(true);
                        }}
                    >
                        + Add Block
                    </button>
                    <div className="topbar__dropdworn-wrapper">
                        <button className="topbar__btn">
                            Save
                        </button>
                        { exportOpen && (
                            <div className="topbar__dropdown">
                                <button className="topbar__dropdown-item"></button>
                                <button className="topbar__dropdown-item"></button>
                                <button className="topbar__dropdown-item"></button>
                                <div className="topbar__dropdown-divider"></div>
                                <button className="topbar__dropdown-item"></button>
                                <button className="topbar__dropdown-item"></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            { addMenuOpen && (
                <>
                <div 
                    style={{ position: 'fixed', top: 100, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
                    onClick={() => setAddMenuOpen(false)} 
                />
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
        </header>
    )
}