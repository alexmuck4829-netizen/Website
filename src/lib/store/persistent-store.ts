'use client';

import { useSyncExternalStore } from 'react';

/**
 * Tiny external store backed by localStorage.
 *
 * Why not useState + useEffect: reading localStorage during render is not
 * possible on the server, and writing the result back with setState inside an
 * effect causes a cascading re-render on every mount. useSyncExternalStore is
 * built for exactly this — React reads a server snapshot during SSR and swaps
 * to the real client value on hydration, in one pass.
 */
export interface PersistentStore<T> {
  get: () => T;
  set: (updater: T | ((current: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  useValue: () => T;
  useHydrated: () => boolean;
}

export function createPersistentStore<T>(key: string, initial: T): PersistentStore<T> {
  let value = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  const hydrate = () => {
    if (hydrated || typeof window === 'undefined') return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      // Private mode, blocked storage or corrupted JSON — keep the default.
    }
  };

  const persist = () => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota or private mode: the store still works for this session.
    }
  };

  const subscribe = (listener: () => void) => {
    hydrate();
    listeners.add(listener);

    // Keep tabs in sync — a cart edited in one tab shows up in the other.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        value = event.newValue ? (JSON.parse(event.newValue) as T) : initial;
        emit();
      } catch {
        /* ignore malformed cross-tab payloads */
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  };

  const get = () => {
    hydrate();
    return value;
  };

  const set = (updater: T | ((current: T) => T)) => {
    const next =
      typeof updater === 'function' ? (updater as (current: T) => T)(get()) : updater;
    if (next === value) return;
    value = next;
    persist();
    emit();
  };

  return {
    get,
    set,
    subscribe,
    useValue: () => useSyncExternalStore(subscribe, get, () => initial),
    // False during SSR and the first client render, true once hydrated —
    // lets the UI show a skeleton instead of flashing an empty cart.
    useHydrated: () =>
      useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
      ),
  };
}
