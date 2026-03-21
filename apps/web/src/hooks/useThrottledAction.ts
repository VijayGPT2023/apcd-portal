'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Hook to throttle an action — prevents rapid repeated calls.
 * Returns a wrapped function that ignores calls within the cooldown period.
 *
 * @param action - The function to throttle
 * @param cooldownMs - Minimum time between calls (default: 1000ms)
 * @returns Throttled version of the action
 *
 * Usage:
 *   const throttledSubmit = useThrottledAction(handleSubmit, 2000);
 *   <button onClick={throttledSubmit}>Submit</button>
 */
export function useThrottledAction<T extends (...args: any[]) => any>(
  action: T,
  cooldownMs: number = 1000,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current < cooldownMs) {
        return undefined;
      }
      lastCallRef.current = now;
      return action(...args);
    },
    [action, cooldownMs],
  );
}

/**
 * Hook to prevent duplicate form submissions.
 * Disables further calls until the async action completes.
 *
 * @param action - Async function to guard
 * @returns [guardedAction, isRunning]
 *
 * Usage:
 *   const [submit, isSubmitting] = useGuardedSubmit(handleSubmit);
 *   <button onClick={submit} disabled={isSubmitting}>Submit</button>
 */
export function useGuardedSubmit<T extends (...args: any[]) => Promise<any>>(
  action: T,
): [(...args: Parameters<T>) => Promise<void>, boolean] {
  const runningRef = useRef(false);
  const [, setTick] = useState(0);

  const guarded = useCallback(
    async (...args: Parameters<T>) => {
      if (runningRef.current) return;
      runningRef.current = true;
      setTick((t) => t + 1);
      try {
        await action(...args);
      } finally {
        runningRef.current = false;
        setTick((t) => t + 1);
      }
    },
    [action],
  );

  return [guarded, runningRef.current];
}
