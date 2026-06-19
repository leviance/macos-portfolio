import React, { useRef, useState } from "react";
import { useClickOutside } from "~/hooks";

interface AppleMenuProps {
  logout: () => void;
  shut: (e: React.MouseEvent<HTMLLIElement>) => void;
  restart: (e: React.MouseEvent<HTMLLIElement>) => void;
  sleep: (e: React.MouseEvent<HTMLLIElement>) => void;
  toggleAppleMenu: () => void;
  openApp?: (id: string) => void;
  openAboutMac?: () => void;
  btnRefs: React.RefObject<HTMLDivElement>[];
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  hint?: string;
  arrow?: boolean;
}

export default function AppleMenu({
  logout,
  shut,
  restart,
  sleep,
  toggleAppleMenu,
  openApp,
  openAboutMac,
  btnRefs,
}: AppleMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, toggleAppleMenu, btnRefs);

  const open = (id: string) => {
    toggleAppleMenu();
    openApp?.(id);
  };

  const handleAbout = () => {
    toggleAppleMenu();
    openAboutMac?.();
  };

  const MenuItem = ({ children, onClick, hint, arrow }: MenuItemProps) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        className={`apple-menu-item ${hovered ? "is-hovered" : ""}`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{children}</span>
        <span className="apple-menu-hint">{arrow ? ">" : hint}</span>
      </div>
    );
  };

  return (
    <div ref={ref} className="apple-menu-panel">
      <MenuItem onClick={handleAbout} arrow>
        About
      </MenuItem>
      <MenuItem onClick={() => open("system-settings")} hint="Cmd+,">
        Settings...
      </MenuItem>
      <MenuItem onClick={logout} hint="Cmd+Q">
        Quit
      </MenuItem>
    </div>
  );
}
