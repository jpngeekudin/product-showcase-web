export function setStorageItem(key: string, value: any) {
  if (typeof value === "object") {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
  } else {
    localStorage.setItem(key, value);
  }
}

export function getStorageItem(key: string) {
  const raw = localStorage.getItem(key) || "";

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
