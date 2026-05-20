import { useEditorStore } from '../../store/editorStore';

export function Sidebar () {
    const sidebarOpen = useEditorStore((s) => s.sidebarOpen);
    const sidebarPosition = useEditorStore((s) => s.sidebarPosition);
    const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
    const blocks = useEditorStore((s) => s.blocks);
    const updateBlock = useEditorStore((s) => s.updateBlock);
    const setSidebarPosition = useEditorStore((s) => s.setSidebarPosition);

    const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!sidebarOpen) return null;

    return (
        <section className="sidebar sidebar--left">
            <header className="sidebar__header">
                Properties
            </header>
            <div className="sidebar__content">
                <div className="sidebar__empty">
                    Select a block to edit its properties
                </div>
            </div>
            <div className="sidebar__footer">
                <button 
                    title='Toggle sidebar position'
                    className="sidebar__toggle-position"
                >
                    Right
                </button>
            </div>
        </section>
    )
}