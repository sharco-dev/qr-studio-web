import { useState } from "react"

export function Topbar () {

    const [exportOpen, setExportOpen] = useState(false)

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
                    <button className="topbar__btn topbar__btn--primary">
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
        </header>
    )
}