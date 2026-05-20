export function Sidebar () {
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