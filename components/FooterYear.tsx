'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const getSnapshot = () => new Date().getFullYear();
const getServerSnapshot = () => 2026;

/**
 * Renders the current year client-side using useSyncExternalStore,
 * avoiding SSR mismatch and eliminating cascading setState in effect.
 */
export function FooterYear() {
  const year = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  return <>{year}</>;
}
