"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NAVIGATION_START_EVENT } from "@/lib/navigation-events";
import { PageLoader } from "@/components/ui/page-loader";

const MINIMUM_VISIBLE_MS = 450;
const SAFETY_TIMEOUT_MS = 15_000;

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [visible, setVisible] = useState(false);
  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    function clearTimers() {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    }

    function finish() {
      activeRef.current = false;
      setVisible(false);
      clearTimers();
    }

    function handleNavigationStart() {
      clearTimers();
      activeRef.current = true;
      startedAtRef.current = performance.now();
      setVisible(true);
      safetyTimerRef.current = window.setTimeout(finish, SAFETY_TIMEOUT_MS);
    }

    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationStart);

    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationStart);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!activeRef.current) return;

    const elapsed = performance.now() - startedAtRef.current;
    const remaining = Math.max(0, MINIMUM_VISIBLE_MS - elapsed);

    hideTimerRef.current = window.setTimeout(() => {
      activeRef.current = false;
      setVisible(false);
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    }, remaining);
  }, [routeKey]);

  if (!visible) return null;

  return <PageLoader overlay />;
}
