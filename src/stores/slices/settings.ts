import type { StateCreator } from "zustand";
import { loadSetting, saveSetting } from "~/utils";

// Accent color can be a named key or a hex string
export type AccentColorKey =
  | "blue" | "purple" | "pink" | "red"
  | "orange" | "yellow" | "green" | "graphite";

export type AccentColor = AccentColorKey | string; // allow hex

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  graphite: "#8E8E93",
};

export type DockPosition = "bottom" | "left" | "right";

export interface WallpaperSet {
  id: string;
  name: string;
  day: string;
  night: string;
  thumbnail?: string;
}

const DEFAULT_WALLPAPER_ID = "ventura";
const WALLPAPER_DEFAULT_MIGRATION_KEY = "wallpaperDefaultMigratedToVentura";

export const wallpaperSets: WallpaperSet[] = [
  {
    id: "ventura",
    name: "macOS Ventura",
    day: "img/ui/macOS-ventura-light.jpg",
    night: "img/ui/macOS-ventura-dark.jpg",
    thumbnail: "img/ui/macOS-ventura-light.jpg",
  },
  {
    id: "dungos-day",
    name: "DungOS Day",
    day: "img/ui/wallpaper-day.jpg",
    night: "img/ui/wallpaper-night.jpg",
    thumbnail: "img/ui/wallpaper-day.jpg",
  },
  {
    id: "dungos-classic",
    name: "DungOS Classic",
    day: "img/ui/wallpaper.jpg",
    night: "img/ui/wallpaper-night.jpg",
    thumbnail: "img/ui/wallpaper.jpg",
  },
  {
    id: "ventura-dark",
    name: "Ventura Dark",
    day: "img/ui/macOS-ventura-dark.jpg",
    night: "img/ui/macOS-ventura-dark.jpg",
    thumbnail: "img/ui/macOS-ventura-dark.jpg",
  },
];

export interface SettingsSlice {
  // Wallpaper
  wallpaperSets: WallpaperSet[];
  activeWallpaperSet: string;
  setActiveWallpaperSet: (id: string) => void;
  /** @deprecated use activeWallpaperSet */
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  getWallpaper: () => WallpaperSet;

  // Accent color (hex string or named key)
  accentColor: string;
  setAccentColor: (color: string) => void;
  getAccentHex: () => string;

  // Dock preferences
  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  dockAutoHide: boolean;
  setDockAutoHide: (v: boolean) => void;

  // Notification
  notificationSound: string;
  setNotificationSound: (sound: string) => void;
}

const loadWallpaperId = (): string => {
  const storedActive = loadSetting<string | null>("activeWallpaperSet", null);
  const storedLegacy = loadSetting<string | null>("wallpaperId", null);
  const stored = storedActive ?? storedLegacy;

  if (!stored) return DEFAULT_WALLPAPER_ID;

  const migrated = loadSetting(WALLPAPER_DEFAULT_MIGRATION_KEY, false);
  if (!migrated && ["tahoe", "tahoe-light", "tahoe-beach"].includes(stored)) {
    saveSetting(WALLPAPER_DEFAULT_MIGRATION_KEY, true);
    saveSetting("activeWallpaperSet", DEFAULT_WALLPAPER_ID);
    saveSetting("wallpaperId", DEFAULT_WALLPAPER_ID);
    return DEFAULT_WALLPAPER_ID;
  }

  return stored;
};

const initialWallpaperId = loadWallpaperId();

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  // Wallpaper
  wallpaperSets,
  activeWallpaperSet: initialWallpaperId,
  setActiveWallpaperSet: (id) => {
    saveSetting("activeWallpaperSet", id);
    saveSetting("wallpaperId", id);
    set({ activeWallpaperSet: id, wallpaperId: id });
  },
  /** @deprecated */
  wallpaperId: initialWallpaperId,
  setWallpaperId: (id) => {
    saveSetting("wallpaperId", id);
    saveSetting("activeWallpaperSet", id);
    set({ wallpaperId: id, activeWallpaperSet: id });
  },
  getWallpaper: () => {
    const id = get().activeWallpaperSet;
    return wallpaperSets.find((w) => w.id === id) ?? wallpaperSets[0];
  },

  // Accent color — stored as hex string
  accentColor: loadSetting("accentColor", "#007AFF"),
  setAccentColor: (color) => {
    // If named key, resolve to hex
    const hex = ACCENT_HEX[color as AccentColorKey] ?? color;
    saveSetting("accentColor", hex);
    set({ accentColor: hex });
    // Apply to CSS variable
    document.documentElement.style.setProperty("--accent-primary", hex);
  },
  getAccentHex: () => {
    const color = get().accentColor;
    return ACCENT_HEX[color as AccentColorKey] ?? color;
  },

  // Dock position
  dockPosition: loadSetting("dockPosition", "bottom" as DockPosition),
  setDockPosition: (pos) => {
    saveSetting("dockPosition", pos);
    set({ dockPosition: pos });
  },

  // Dock auto-hide
  dockAutoHide: loadSetting("dockAutoHide", false),
  setDockAutoHide: (v) => {
    saveSetting("dockAutoHide", v);
    set({ dockAutoHide: v });
  },

  // Notification sound
  notificationSound: loadSetting(
    "notificationSound",
    "music/Samantha (Legacy)-2024_08_12-6.wav"
  ),
  setNotificationSound: (sound) => {
    saveSetting("notificationSound", sound);
    set({ notificationSound: sound });
  },
});
