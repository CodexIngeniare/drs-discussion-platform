import React from 'react';
import './Sidebar.css';

function Sidebar({ children }) {
    const topChildren = React.Children.toArray(children).filter(child => child.type === Sidebar.Top);
    const bottomChildren = React.Children.toArray(children).filter(child => child.type === Sidebar.Bottom);

    return (
      <aside className="Sidebar">
        <div className="Sidebar__top-section">
          {topChildren}
        </div>
        <div className="Sidebar__bottom-section">
          {bottomChildren}
        </div>
      </aside>
    );
}

Sidebar.Top = ({ children }) => <>{children}</>;
Sidebar.Bottom = ({ children }) => <>{children}</>;

export default Sidebar;