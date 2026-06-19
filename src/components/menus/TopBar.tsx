import React, { forwardRef, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import type { MacActions } from "~/types";
import { useAudioContext } from "~/context/AudioContext";

interface TopBarItemProps {
  hideOnMobile?: boolean;
  forceHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
}

type MenuId = "app" | "file" | "edit" | "view" | "window" | "help";

interface DropdownItem {
  label: string;
  hint?: string;
  arrow?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
  onClick?: () => void;
}

const TopBarItem = forwardRef(
  (props: TopBarItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const hide = props.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex";
    const active = props.forceHover ? "is-active" : "";

    return (
      <div
        ref={ref}
        className={`mac-menu-item hstack ${hide} ${active} ${props.className || ""}`}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
      >
        {props.children}
      </div>
    );
  }
);

const CCMIcon = ({ size }: { size: number }) => {
  return (
    <svg
      viewBox="0 0 29 29"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z" />
    </svg>
  );
};

interface TopBarProps extends MacActions {
  title: string;
  setSpotlightBtnRef: (value: React.RefObject<HTMLDivElement>) => void;
  hide: boolean;
  toggleSpotlight: () => void;
  openApp?: (id: string) => void;
  toggleNotificationCenter?: () => void;
  showNotificationCenter?: boolean;
  openAboutMac?: () => void;
}

interface TopBarState {
  date: Date;
  showControlCenter: boolean;
  showWifiMenu: boolean;
  activeMenu: MenuId | null;
  menuLeft: number;
}

const MenuDropdown = ({ left, items, onClose }: { left: number; items: DropdownItem[]; onClose: () => void }) => {
  return (
    <div className="top-menu-panel" style={{ left }} onMouseDown={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <React.Fragment key={`${item.label}-${item.hint || ""}`}>
          {item.separatorBefore && <div className="top-menu-separator" />}
          <button
            className={`top-menu-row ${item.disabled ? "is-disabled" : ""}`}
            type="button"
            disabled={item.disabled}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            <span>{item.label}</span>
            <span className="top-menu-hint">{item.arrow ? ">" : item.hint}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

const TopBar = (props: TopBarProps) => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const appMenuBtnRef = useRef<HTMLDivElement>(null);
  const controlCenterBtnRef = useRef<HTMLDivElement>(null);
  const wifiBtnRef = useRef<HTMLDivElement>(null);
  const spotlightBtnRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<TopBarState>({
    date: new Date(),
    showControlCenter: false,
    showWifiMenu: false,
    activeMenu: null,
    menuLeft: 42,
  });

  const { audioState, controls } = useAudioContext();
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const { volume, wifi } = useStore((store) => ({
    volume: store.volume,
    wifi: store.wifi,
  }));
  const { setVolume, setBrightness } = useStore((store) => ({
    setVolume: store.setVolume,
    setBrightness: store.setBrightness,
  }));

  useInterval(() => {
    setState((prev) => ({
      ...prev,
      date: new Date(),
    }));
  }, 60 * 1000);

  useEffect(() => {
    props.setSpotlightBtnRef(spotlightBtnRef);
    controls.volume(volume / 100);
  }, []);

  const setAudioVolume = (value: number): void => {
    setVolume(value);
    controls.volume(value / 100);
  };

  const setSiteBrightness = (value: number): void => {
    setBrightness(value);
  };

  const toggleControlCenter = (): void => {
    setState((prev) => ({
      ...prev,
      showControlCenter: !prev.showControlCenter,
    }));
  };

  const closeTopMenu = (): void => {
    setState((prev) => ({
      ...prev,
      activeMenu: null,
    }));
  };

  useEffect(() => {
    if (!state.activeMenu) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".mac-menu-bar") || target.closest(".top-menu-panel")) return;
      closeTopMenu();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [state.activeMenu]);

  const openTopMenu = (menu: MenuId) => (event: React.MouseEvent<HTMLDivElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    setState((prev) => ({
      ...prev,
      activeMenu: menu,
      menuLeft: Math.max(8, Math.round(rect.left)),
    }));
  };

  const switchTopMenu = (menu: MenuId, ref: React.RefObject<HTMLDivElement>) => (): void => {
    if (!state.activeMenu || state.activeMenu === menu) return;
    const rect = ref.current?.getBoundingClientRect();
    setState((prev) => ({
      ...prev,
      activeMenu: menu,
      menuLeft: Math.max(8, Math.round(rect?.left ?? prev.menuLeft)),
    }));
  };

  const toggleWifiMenu = (): void => {
    setState((prev) => ({
      ...prev,
      showWifiMenu: !prev.showWifiMenu,
    }));
  };

  const logout = (): void => {
    controls.pause();
    props.setLogin(false);
  };

  const fileMenuRef = useRef<HTMLDivElement>(null);
  const editMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const windowMenuRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  const menuRefs: Record<Exclude<MenuId, "app">, React.RefObject<HTMLDivElement>> = {
    file: fileMenuRef,
    edit: editMenuRef,
    view: viewMenuRef,
    window: windowMenuRef,
    help: helpMenuRef,
  };

  const menuItems: { id: Exclude<MenuId, "app">; label: string }[] = [
    { id: "file", label: "File" },
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "window", label: "Window" },
    { id: "help", label: "Help" },
  ];

  const dropdownItems: Record<MenuId, DropdownItem[]> = {
    app: [
      { label: "About", arrow: true, onClick: props.openAboutMac },
      { label: "Settings...", hint: "Cmd+,", onClick: () => props.openApp?.("system-settings") },
      { label: "Quit", hint: "Cmd+Q", onClick: logout },
    ],
    file: [
      { label: "New Finder Window", hint: "Cmd+N", onClick: () => props.openApp?.("finder") },
      { label: "Open Terminal", hint: "Cmd+T", onClick: () => props.openApp?.("terminal") },
      { label: "Open Resume", onClick: () => props.openApp?.("typora") },
      { label: "Close Window", hint: "Ctrl+W", separatorBefore: true },
    ],
    edit: [
      { label: "Undo", hint: "Cmd+Z", disabled: true },
      { label: "Redo", hint: "Shift+Cmd+Z", disabled: true },
      { label: "Cut", hint: "Cmd+X", separatorBefore: true, disabled: true },
      { label: "Copy", hint: "Cmd+C", disabled: true },
      { label: "Paste", hint: "Cmd+V", disabled: true },
    ],
    view: [
      { label: "Show Finder", onClick: () => props.openApp?.("finder") },
      { label: "Show Projects", onClick: () => props.openApp?.("bear") },
      { label: "Open Photos", onClick: () => props.openApp?.("photos") },
      { label: "Enter Full Screen", hint: "Ctrl+Cmd+F", separatorBefore: true },
    ],
    window: [
      { label: "Minimize", hint: "Cmd+M", disabled: true },
      { label: "Zoom", hint: "Win+Up", disabled: true },
      { label: "Cycle Through Windows", hint: "Ctrl+Tab" },
      { label: "Bring All to Front", separatorBefore: true },
    ],
    help: [
      { label: "Portfolio Help", onClick: () => props.openApp?.("notes") },
      { label: "Terminal Commands", onClick: () => props.openApp?.("terminal") },
      { label: "Contact Dung", onClick: () => props.openApp?.("mail") },
    ],
  };

  return (
    <div
      className={`mac-menu-bar ${props.hide ? "is-hidden" : ""}`}
      style={{ zIndex: props.hide ? 0 : 99999 }}
    >
      <div className="mac-menu-left">
        <TopBarItem
          className="mac-menu-apple"
          onClick={openTopMenu("app")}
          ref={appleBtnRef}
        >
          <img src="/img/icons/sf-icons/general.svg" alt="Apple Logo" />
        </TopBarItem>

        <TopBarItem
          className="mac-menu-app"
          forceHover={state.activeMenu === "app"}
          onClick={openTopMenu("app")}
          onMouseEnter={switchTopMenu("app", appMenuBtnRef)}
          ref={appMenuBtnRef}
        >
          Portfolio Website
        </TopBarItem>

        {menuItems.map((item) => (
          <TopBarItem
            key={item.id}
            className="mac-menu-label"
            forceHover={state.activeMenu === item.id}
            hideOnMobile={item.id !== "file"}
            onClick={openTopMenu(item.id)}
            onMouseEnter={switchTopMenu(item.id, menuRefs[item.id])}
            ref={menuRefs[item.id]}
          >
            {item.label}
          </TopBarItem>
        ))}
      </div>

      {state.activeMenu && (
        <MenuDropdown
          left={state.menuLeft}
          items={dropdownItems[state.activeMenu]}
          onClose={closeTopMenu}
        />
      )}

      <div className="mac-menu-right">
        <TopBarItem className="mac-menu-status" hideOnMobile={true}>
          <span className="i-ph:shield-check-fill text-[13px]" />
        </TopBarItem>

        <TopBarItem
          className="mac-menu-status"
          hideOnMobile={true}
          forceHover={state.showWifiMenu}
          onClick={toggleWifiMenu}
          ref={wifiBtnRef}
        >
          {wifi ? (
            <img src="/img/icons/sf-icons/wifi.svg" alt="Wi-Fi" />
          ) : (
            <img src="/img/icons/sf-icons/wifi.svg" alt="Wi-Fi Off" className="opacity-50" />
          )}
        </TopBarItem>

        <TopBarItem className="mac-menu-status" hideOnMobile={true}>
          <img src="/img/icons/sf-icons/bluetooth.svg" alt="Bluetooth" />
        </TopBarItem>

        <TopBarItem className="mac-menu-battery" hideOnMobile={true}>
          <Battery />
        </TopBarItem>

        <TopBarItem className="mac-menu-status" ref={spotlightBtnRef} onClick={props.toggleSpotlight}>
          <img src="/img/icons/sf-icons/search.svg" alt="Spotlight Search" />
        </TopBarItem>

        <TopBarItem
          className="mac-menu-status"
          forceHover={state.showControlCenter}
          onClick={toggleControlCenter}
          ref={controlCenterBtnRef}
        >
          <CCMIcon size={15} />
        </TopBarItem>

        {state.showWifiMenu && (
          <WifiMenu toggleWifiMenu={toggleWifiMenu} btnRef={wifiBtnRef} />
        )}

        <AnimatePresence>
          {state.showControlCenter && (
            <ControlCenterMenu
              playing={audioState.playing}
              toggleAudio={controls.toggle}
              setVolume={setAudioVolume}
              setBrightness={setSiteBrightness}
              toggleControlCenter={toggleControlCenter}
              btnRef={controlCenterBtnRef}
            />
          )}
        </AnimatePresence>

        <TopBarItem
          className="mac-menu-clock"
          forceHover={props.showNotificationCenter}
          onClick={props.toggleNotificationCenter}
        >
          <span>{format(state.date, "EEE MMM d")}</span>
          <span>{format(state.date, "h:mm a")}</span>
        </TopBarItem>
      </div>

      {isMobile && (
        <>
          <div
            className="fixed top-0 left-0 w-1/2 h-12 z-[99998]"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.target as any).startY = touch.clientY;
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const startY = (e.target as any).startY;
              if (startY !== undefined && touch.clientY - startY > 30) {
                if (!props.showNotificationCenter) {
                  props.toggleNotificationCenter?.();
                }
                (e.target as any).startY = undefined;
              }
            }}
            onClick={props.toggleNotificationCenter}
          />
          <div
            className="fixed top-0 right-0 w-1/2 h-12 z-[99998]"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.target as any).startY = touch.clientY;
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const startY = (e.target as any).startY;
              if (startY !== undefined && touch.clientY - startY > 30) {
                if (!state.showControlCenter) {
                  toggleControlCenter();
                }
                (e.target as any).startY = undefined;
              }
            }}
            onClick={toggleControlCenter}
          />
        </>
      )}
    </div>
  );
};

export default TopBar;
