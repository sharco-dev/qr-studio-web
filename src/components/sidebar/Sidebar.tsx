import { useEditorStore } from '../../store/editorStore';
import { BlockProperties } from './BlockProperties';

export function Sidebar() {
  const sidebarOpen = useEditorStore((s) => s.sidebarOpen);
  const sidebarPosition = useEditorStore((s) => s.sidebarPosition);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const previewMode = useEditorStore((s) => s.previewMode);
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const setSidebarPosition = useEditorStore((s) => s.setSidebarPosition);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!sidebarOpen) return null;

  return (
    <div className={`sidebar sidebar--${sidebarPosition}`}>
      <div className="sidebar__header">
        Properties
        <div className="topbar__group">
          <button
            className={`topbar__btn ${previewMode === 'mobile' ? 'topbar__btn--active' : ''}`}
            onClick={() => setPreviewMode('mobile')}
            title="Mobile preview"
          >
            📱
          </button>
          <button
            className={`topbar__btn ${previewMode === 'desktop' ? 'topbar__btn--active' : ''}`}
            onClick={() => setPreviewMode('desktop')}
            title="Desktop preview"
          >
            🖥
          </button>
        </div>
      </div>
      <div className="sidebar__content">
        {!selectedBlock ? (
          <div className="sidebar__empty">Select a block to edit its properties</div>
        ) : (
          <BlockProperties block={selectedBlock} onUpdate={updateBlock} />
        )}
      </div>
      <div className="sidebar__footer">
        <button
          className="sidebar__toggle-position"
          onClick={() => setSidebarPosition(sidebarPosition === 'left' ? 'right' : 'left')}
          title="Toggle sidebar position"
        >
          {sidebarPosition === 'left' ? '→ Move to Right' : '← Move to Left'}
        </button>
      </div>
    </div>
  );
}
