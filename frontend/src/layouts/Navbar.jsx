import React from 'react';
import './Navbar.css';

function Navbar({ children }) {
    const leftChildren = React.Children.toArray(children).filter(child => child.type === Navbar.Left);
    const centerChildren = React.Children.toArray(children).filter(child => child.type === Navbar.Center);
    const rightChildren = React.Children.toArray(children).filter(child => child.type === Navbar.Right);

    console.log(leftChildren);

    return (
      <div className="Navbar">
          <div className='Navbar__left'>
            {leftChildren}
          </div>
          <div className='Navbar__center'>
            {centerChildren}
          </div>
          <div className='Navbar__right'>
            {rightChildren}
          </div>
      </div>
    );
}

Navbar.Left = ({ children }) => <>{children}</>;
Navbar.Center = ({ children }) => <>{children}</>;
Navbar.Right = ({ children }) => <>{children}</>;

export default Navbar;