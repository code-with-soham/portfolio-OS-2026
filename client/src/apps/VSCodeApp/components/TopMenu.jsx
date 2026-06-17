import React, { useState, useRef, useEffect } from 'react';
import { MENU_ITEMS } from '../config/menuItems';
import vscodeIco from '../../../assets/icons/apps/vscode.svg';

export default function TopMenu({ onMenuAction }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuHover = (menuName) => {
    if (activeMenu) {
      setActiveMenu(menuName);
    }
  };

  const handleMenuClick = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleAction = (e, actionId) => {
    e.stopPropagation();
    setActiveMenu(null);
    if (onMenuAction) {
      onMenuAction(actionId);
    }
  };

  return (
    <div className="vscode-top-menu" ref={menuRef}>
      <img src={vscodeIco} alt="VS Code" width="16" height="16" style={{ margin: '0 10px', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
      {Object.keys(MENU_ITEMS).map(menuName => (
        <div 
          key={menuName} 
          className={`vscode-menu-item ${activeMenu === menuName ? 'active' : ''}`}
          onClick={() => handleMenuClick(menuName)}
          onMouseEnter={() => handleMenuHover(menuName)}
        >
          {menuName}
          {activeMenu === menuName && (
            <div className="vscode-dropdown-menu">
              {MENU_ITEMS[menuName].map((item, idx) => (
                item.divider ? (
                  <div key={`div-${idx}`} className="vscode-menu-divider"></div>
                ) : (
                  <div key={item.id} className="vscode-dropdown-item" onClick={(e) => handleAction(e, item.id)}>
                    <span className="vscode-menu-label">{item.label}</span>
                    {item.shortcut && <span className="vscode-menu-shortcut">{item.shortcut}</span>}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="vscode-menu-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', opacity: 0.7, pointerEvents: 'none' }}>
        VS Code - Portfolio OS
      </div>
    </div>
  );
}
