import "@testing-library/jest-dom/vitest"

const storageItems = new Map<string, string>()

const localStorageMock: Storage = {
  get length() {
    return storageItems.size
  },
  clear() {
    storageItems.clear()
  },
  getItem(key: string) {
    return storageItems.get(key) ?? null
  },
  key(index: number) {
    return Array.from(storageItems.keys())[index] ?? null
  },
  removeItem(key: string) {
    storageItems.delete(key)
  },
  setItem(key: string, value: string) {
    storageItems.set(key, value)
  },
}

Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: localStorageMock,
})

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: localStorageMock,
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})
