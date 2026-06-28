import React from "react";
import { apps, launchpadApps } from "~/configs";
import { minMarginY, isFullScreen, enterFullScreen, exitFullScreen } from "~/utils";
import type { MacActions } from "~/types";
import NotificationCenter from "~/components/NotificationCenter";
import AboutThisMacModal from "~/components/AboutThisMacModal";
import CalendarWidget from "~/components/widgets/CalendarWidget";
import WeatherWidget from "~/components/widgets/WeatherWidget";
import ContextMenu from "~/components/menus/ContextMenu";
import { FolderIcon, FolderHomeIcon, FolderDockIcon, PdfIcon } from "~/components/DesktopIcons";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "~/hooks";

interface DesktopState {
  showApps: { [key: string]: boolean };
  appsZ: { [key: string]: number };
  maxApps: { [key: string]: boolean };
  minApps: { [key: string]: boolean };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
  showNotificationCenter: boolean;
}

// Build the initial state map from apps config — includes ALL apps
function buildInitialState(): Pick<DesktopState, "showApps" | "appsZ" | "maxApps" | "minApps"> {
  const showApps: { [key: string]: boolean } = {};
  const appsZ: { [key: string]: number } = {};
  const maxApps: { [key: string]: boolean } = {};
  const minApps: { [key: string]: boolean } = {};
  apps.forEach((app) => {
    showApps[app.id] = !!app.show;
    appsZ[app.id] = 2;
    maxApps[app.id] = false;
    minApps[app.id] = false;
  });
  return { showApps, appsZ, maxApps, minApps };
}

const INITIAL = buildInitialState();

export default function Desktop(props: MacActions) {
  const [state, setState] = useState<DesktopState>({
    ...INITIAL,
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false,
    showNotificationCenter: false,
  });
  const stateRef = React.useRef(state);
  const handledCloseKeyRef = React.useRef<{ signature: string; time: number } | null>(null);
  const openVSCodeTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const updateDesktopState = (updater: (prev: DesktopState) => DesktopState): void => {
    setState((prev) => {
      const next = updater(prev);
      stateRef.current = next;
      return next;
    });
  };

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const [showAboutMac, setShowAboutMac] = useState(false);

  const { dark, brightness, getWallpaper } = useStore((s) => ({
    dark: s.dark,
    brightness: s.brightness,
    getWallpaper: s.getWallpaper,
  }));

  const { isMobile } = useWindowSize();

  const activeWallpaper = getWallpaper();

  const getVisibleWindowIds = (targetState: DesktopState): string[] =>
    apps
      .filter((app) => app.desktop && app.content && targetState.showApps[app.id] && !targetState.minApps[app.id])
      .map((app) => app.id);

  const getActiveWindowId = (targetState: DesktopState): string | null => {
    const visibleIds = getVisibleWindowIds(targetState);
    if (!visibleIds.length) return null;
    return visibleIds.reduce((activeId, id) =>
      (targetState.appsZ[id] ?? 0) > (targetState.appsZ[activeId] ?? 0) ? id : activeId
    );
  };

  const getDomActiveWindowId = (): string | null => {
    const windows = Array.from(document.querySelectorAll<HTMLElement>('[id^="window-"]'));
    if (!windows.length) return null;
    const activeWindow = windows.sort(
      (a, b) => Number(getComputedStyle(b).zIndex) - Number(getComputedStyle(a).zIndex)
    )[0];
    return activeWindow?.id.replace(/^window-/, "") ?? null;
  };

  const focusAdjacentWindow = (reverse = false): void => {
    updateDesktopState((prev) => {
      const visibleIds = getVisibleWindowIds(prev).sort((a, b) => (prev.appsZ[a] ?? 0) - (prev.appsZ[b] ?? 0));
      if (visibleIds.length < 2) return prev;

      const activeId = getActiveWindowId(prev);
      const activeIndex = activeId ? visibleIds.indexOf(activeId) : visibleIds.length - 1;
      const nextIndex = reverse
        ? (activeIndex - 1 + visibleIds.length) % visibleIds.length
        : (activeIndex + 1) % visibleIds.length;
      const nextId = visibleIds[nextIndex];
      const appDef = apps.find((app) => app.id === nextId);
      const maxZ = prev.maxZ + 1;

      return {
        ...prev,
        appsZ: { ...prev.appsZ, [nextId]: maxZ },
        maxZ,
        currentTitle: appDef?.title ?? prev.currentTitle,
        hideDockAndTopbar: false,
      };
    });
  };

  const closeActiveWindow = (): void => {
    const domActiveId = getDomActiveWindowId();

    updateDesktopState((prev) => {
      const activeId =
        domActiveId && prev.showApps[domActiveId] && !prev.minApps[domActiveId]
          ? domActiveId
          : getActiveWindowId(prev);
      if (!activeId) return prev;
      return {
        ...prev,
        showApps: { ...prev.showApps, [activeId]: false },
        maxApps: { ...prev.maxApps, [activeId]: false },
        hideDockAndTopbar: false,
        currentTitle: "Finder",
      };
    });
  };

  const maximizeActiveWindow = (): void => {
    updateDesktopState((prev) => {
      const activeId = getActiveWindowId(prev);
      if (!activeId) return prev;
      const maxZ = prev.maxZ + 1;
      const appDef = apps.find((app) => app.id === activeId);
      return {
        ...prev,
        maxApps: { ...prev.maxApps, [activeId]: true },
        minApps: { ...prev.minApps, [activeId]: false },
        appsZ: { ...prev.appsZ, [activeId]: maxZ },
        maxZ,
        currentTitle: appDef?.title ?? prev.currentTitle,
        hideDockAndTopbar: false,
      };
    });
  };

  const handleLaunchpadAppClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    e.preventDefault();
    useStore.getState().setSafariUrl(link);
    window.dispatchEvent(new CustomEvent("launchpad:openSafari"));
  };

  // Listen for cross-component events and global keyboard shortcuts
  useEffect(() => {
    const handleOpenSafari = () => {
      toggleLaunchpad(false);
      openApp("safari");
    };
    const handleOpenVSCodeRepo = (event: Event) => {
      const repo = (event as CustomEvent<{ repo?: string }>).detail?.repo?.trim();
      if (!repo) return;

      useStore.getState().setVSCodeRepo(repo);

      if (openVSCodeTimerRef.current) {
        window.clearTimeout(openVSCodeTimerRef.current);
      }

      updateDesktopState((prev) => ({
        ...prev,
        showApps: { ...prev.showApps, vscode: false },
        maxApps: { ...prev.maxApps, vscode: false },
        minApps: { ...prev.minApps, vscode: false },
        hideDockAndTopbar: false,
      }));

      openVSCodeTimerRef.current = window.setTimeout(() => {
        openVSCodeTimerRef.current = null;
        openApp("vscode");
      }, 90);
    };
    const handleOpenLaunchpad = () => toggleLaunchpad(true);
    const getKeySignature = (e: KeyboardEvent) => `${e.code}:${e.ctrlKey}:${e.altKey}:${e.metaKey}`;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const closeKeyCombo = (e.code === "KeyW" || key === "w") && (e.ctrlKey || e.metaKey || e.altKey);
      const escapeKey = key === "escape" || e.code === "Escape";

      // Close active app window: Ctrl+W on Windows/Linux, Cmd+W on macOS.
      // Alt+W and Escape are in-page fallbacks for browsers that reserve Ctrl+W.
      if (closeKeyCombo || escapeKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handledCloseKeyRef.current = { signature: getKeySignature(e), time: Date.now() };
        closeActiveWindow();
        return;
      }

      // Cycle app windows. Alt+Tab works only if the OS/browser forwards it,
      // so Ctrl+Tab and Cmd+` are also supported as in-page equivalents.
      if (
        (e.altKey && e.key === "Tab") ||
        (e.ctrlKey && e.key === "Tab") ||
        (e.metaKey && e.code === "Backquote")
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        focusAdjacentWindow(e.shiftKey);
        return;
      }

      // Maximize active app window. Win+ArrowUp and Cmd+ArrowUp are handled
      // when delivered by the browser; Ctrl+Alt+ArrowUp and Ctrl+Cmd+F are fallbacks.
      if (
        ((e.metaKey || (e.ctrlKey && e.altKey)) && e.key === "ArrowUp") ||
        (e.ctrlKey && e.metaKey && key === "f")
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        maximizeActiveWindow();
        return;
      }

      // Spotlight: Cmd/Ctrl + Space
      if (isCmdOrCtrl && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }

      // Full screen: Cmd/Ctrl + F OR F11
      if ((isCmdOrCtrl && key === 'f') || e.key === 'F11') {
        e.preventDefault();
        if (isFullScreen()) {
          exitFullScreen();
          useStore.getState().toggleFullScreen(false);
        } else {
          enterFullScreen();
          useStore.getState().toggleFullScreen(true);
        }
      }

      // Brightness Down: Cmd/Ctrl + Down Arrow OR F1
      if ((e.ctrlKey && !e.metaKey && e.key === 'ArrowDown') || e.key === 'F1') {
        e.preventDefault();
        const currentBrightness = useStore.getState().brightness as number;
        useStore.getState().setBrightness(Math.max(currentBrightness - 10, 1));
      }

      // Brightness Up: Cmd/Ctrl + Up Arrow OR F2
      if ((e.ctrlKey && !e.metaKey && !e.altKey && e.key === 'ArrowUp') || e.key === 'F2') {
        e.preventDefault();
        const currentBrightness = useStore.getState().brightness as number;
        useStore.getState().setBrightness(Math.min(currentBrightness + 10, 100));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const shouldClose =
        key === "escape" ||
        e.code === "Escape" ||
        ((e.code === "KeyW" || key === "w") && (e.ctrlKey || e.metaKey || e.altKey));

      if (!shouldClose) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const handledCloseKey = handledCloseKeyRef.current;
      if (
        handledCloseKey &&
        handledCloseKey.signature === getKeySignature(e) &&
        Date.now() - handledCloseKey.time < 2000
      ) {
        handledCloseKeyRef.current = null;
        return;
      }
      handledCloseKeyRef.current = null;

      closeActiveWindow();
    };

    window.addEventListener("launchpad:openSafari", handleOpenSafari);
    window.addEventListener("finder:openVSCode", handleOpenVSCodeRepo);
    window.addEventListener("siri:openLaunchpad", handleOpenLaunchpad);
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("keyup", handleKeyUp, { capture: true });
    
    return () => {
      window.removeEventListener("launchpad:openSafari", handleOpenSafari);
      window.removeEventListener("finder:openVSCode", handleOpenVSCodeRepo);
      window.removeEventListener("siri:openLaunchpad", handleOpenLaunchpad);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      if (openVSCodeTimerRef.current) {
        window.clearTimeout(openVSCodeTimerRef.current);
      }
    };
  }, []);

  const toggleLaunchpad = (target: boolean): void => {
    updateDesktopState((prev) => ({ ...prev, showLaunchpad: target }));
  };

  const toggleSpotlight = (): void => {
    updateDesktopState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
  };

  const toggleNotificationCenter = (): void => {
    updateDesktopState((prev) => ({ ...prev, showNotificationCenter: !prev.showNotificationCenter }));
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--window-transform-x", rect.x.toFixed(1) + "px");
    r.style.setProperty("--window-transform-y", (rect.y - minMarginY).toFixed(1) + "px");
  };

  const setAppMax = (id: string, target?: boolean): void => {
    updateDesktopState((prev) => {
      const maxApps = { ...prev.maxApps };
      if (target === undefined) target = !maxApps[id];
      maxApps[id] = target!;
      const appDef = apps.find((app) => app.id === id);
      return { ...prev, maxApps, currentTitle: appDef?.title ?? prev.currentTitle, hideDockAndTopbar: false };
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);
    const dock = document.querySelector(`#dock-${id}`) as HTMLElement;
    const win = document.querySelector(`#window-${id}`) as HTMLElement;
    if (!dock || !win) return;
    const dockRect = dock.getBoundingClientRect();
    const posY = window.innerHeight - win.offsetHeight / 2 - minMarginY;
    const posX = dockRect.x - win.offsetWidth / 2 + 25;
    win.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    win.style.transition = "ease-out 0.3s";
    updateDesktopState((prev) => ({ ...prev, minApps: { ...prev.minApps, [id]: true } }));
  };

  const closeApp = (id: string): void => {
    updateDesktopState((prev) => ({
      ...prev,
      showApps: { ...prev.showApps, [id]: false },
      maxApps: { ...prev.maxApps, [id]: false },
      hideDockAndTopbar: false,
    }));
  };

  const openApp = (id: string): void => {
    const appDef = apps.find((a) => a.id === id);
    if (!appDef) {
      console.warn(`openApp: unknown app id "${id}"`);
      return;
    }

    updateDesktopState((prev) => {
      const maxZ = prev.maxZ + 1;
      const showApps = { ...prev.showApps, [id]: true };
      const appsZ = { ...prev.appsZ, [id]: maxZ };

      // Un-minimize if needed
      const minApps = { ...prev.minApps };
      if (minApps[id]) {
        const win = document.querySelector(`#window-${id}`) as HTMLElement;
        if (win) {
          win.style.transform = `translate(${win.style.getPropertyValue("--window-transform-x")}, ${win.style.getPropertyValue("--window-transform-y")}) scale(1)`;
          win.style.transition = "ease-in 0.3s";
        }
        minApps[id] = false;
      }

      return {
        ...prev,
        showApps,
        appsZ,
        maxZ,
        minApps,
        currentTitle: appDef.title,
        hideDockAndTopbar: false,
      };
    });
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (!app.desktop) return null;

      if (app.id === "siri" && state.showApps[app.id]) {
        return (
          <div
            key={`desktop-app-${app.id}`}
            className="fixed top-8 right-4 z-[1000] drop-shadow-2xl flex items-start justify-end"
          >
            {React.cloneElement(app.content as React.ReactElement, {
              closeSiri: () => closeApp("siri"),
            })}
          </div>
        );
      }

      if (!app.content) return null;

      const windowProps = {
        id: app.id,
        title: app.title,
        width: app.width,
        height: app.height,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        aspectRatio: app.aspectRatio,
        x: app.x,
        xPercent: app.xPercent,
        y: app.y,
        z: state.appsZ[app.id] ?? 2,
        max: state.maxApps[app.id] ?? false,
        min: state.minApps[app.id] ?? false,
        titlebar: app.titlebar,
        close: closeApp,
        setMax: setAppMax,
        setMin: minimizeApp,
        focus: openApp,
      };

      return (
        <AnimatePresence key={`desktop-app-${app.id}`}>
          {state.showApps[app.id] && (
            <AppWindow {...windowProps}>
              {app.content}
            </AppWindow>
          )}
        </AnimatePresence>
      );
    });
  };

  const bgStyle: any = {
    backgroundImage: `url(${dark ? activeWallpaper.night : activeWallpaper.day})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: `brightness(${(brightness as number) * 0.7 + 50}%)`
  };
  bgStyle["trans" + "ition"] = "filter 0.3s ea" + "se";

  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={bgStyle}
      onContextMenu={handleContextMenu}
    >
      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
        openApp={openApp}
        toggleNotificationCenter={toggleNotificationCenter}
        showNotificationCenter={state.showNotificationCenter}
        openAboutMac={() => setShowAboutMac(true)}
      />

      {/* Desktop-pinned widgets — top-left, always visible */}
      <div
        style={{
          position: "fixed",
          top: 48,
          left: 16,
          zIndex: 55,
          display: "flex",
          flexDirection: "row",
          gap: 16,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <CalendarWidget compact={false} />
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <WeatherWidget compact={false} />
        </div>
      </div>

      {/* Desktop Icons - top-right */}
      <div
        style={{
          position: "fixed",
          top: 48,
          right: 24,
          zIndex: 55,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
      </div>

      {isMobile && (
        <div className="absolute top-[48px] left-0 right-0 bottom-24 p-6 grid grid-cols-4 gap-y-6 gap-x-2 content-start z-40">
          {apps.filter(a => !a.hideOnMobile && !a.dockOnMobile && a.id !== "launchpad").map(app => (
            <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => openApp(app.id)}>
              <div className="w-[60px] h-[60px] bg-transparent rounded-[22.5%] shadow-sm overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/5">
                <img src={app.mobileImg || app.img} alt={app.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-xs font-light text-center tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {app.mobileTitle || app.title}
              </span>
            </div>
          ))}
          {launchpadApps.map(app => (
            <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={(e) => handleLaunchpadAppClick(e, app.link)}>
              <div className="w-[60px] h-[60px] rounded-[22.5%] shadow-sm overflow-hidden flex items-center justify-center border border-black/10 dark:border-white/10 bg-white">
                <img src={app.mobileImg || app.img} alt={app.title} className="w-[60%] h-[60%] object-contain" />
              </div>
              <span className="text-white text-xs font-light text-center tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {app.mobileTitle || app.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Desktop App Windows */}
      <div className="window-bound absolute" style={{ top: minMarginY, zIndex: 60, pointerEvents: "none" }}>
        {renderAppWindows()}
      </div>

      {/* About This Mac modal */}
      <AboutThisMacModal show={showAboutMac} onClose={() => setShowAboutMac(false)} />

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Notification Center */}
      <NotificationCenter
        show={state.showNotificationCenter}
        onClose={toggleNotificationCenter}
      />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={() => setContextMenu({ ...contextMenu, show: false })}
        openApp={openApp}
      />
    </div>
  );
}
