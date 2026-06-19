const SETTINGS_PREFIX = "macos-settings-";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

const canUseBrowserStorage = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

const storageKey = (key: string): string => `${SETTINGS_PREFIX}${key}`;

const readCookie = (name: string): string | null => {
  if (!canUseBrowserStorage()) return null;

  const encodedName = encodeURIComponent(name);
  const pairs = document.cookie ? document.cookie.split("; ") : [];
  for (const pair of pairs) {
    const separatorIndex = pair.indexOf("=");
    const key = separatorIndex >= 0 ? pair.slice(0, separatorIndex) : pair;
    if (key === encodedName) {
      const value = separatorIndex >= 0 ? pair.slice(separatorIndex + 1) : "";
      return decodeURIComponent(value);
    }
  }

  return null;
};

const writeCookie = (name: string, value: string): void => {
  if (!canUseBrowserStorage()) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    secure,
  ].join("; ");
};

const parseSetting = <T>(value: string | null, fallback: T): T => {
  if (value === null) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadSetting = <T>(key: string, fallback: T): T => {
  if (!canUseBrowserStorage()) return fallback;

  const name = storageKey(key);
  const cookieValue = readCookie(name);
  if (cookieValue !== null) return parseSetting(cookieValue, fallback);

  try {
    const localValue = localStorage.getItem(name);
    if (localValue !== null) {
      writeCookie(name, localValue);
      return parseSetting(localValue, fallback);
    }
  } catch {
    // localStorage may be unavailable.
  }

  return fallback;
};

export const saveSetting = (key: string, value: unknown): void => {
  if (!canUseBrowserStorage()) return;

  const name = storageKey(key);
  const serialized = JSON.stringify(value);
  writeCookie(name, serialized);

  try {
    localStorage.setItem(name, serialized);
  } catch {
    // Cookie persistence is the primary path; localStorage is a fallback/migration aid.
  }
};
