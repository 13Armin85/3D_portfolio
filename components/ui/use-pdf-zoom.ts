"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const MIN_PDF_ZOOM = 0.75;
export const MAX_PDF_ZOOM = 3;

export function usePdfZoom() {
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const anchor = useRef<{ left: number; top: number } | null>(null);

  const zoomTo = useCallback(
    (next: number, clientX?: number, clientY?: number) => {
      const element = viewport.current;
      if (!element) return;
      const value = Math.min(MAX_PDF_ZOOM, Math.max(MIN_PDF_ZOOM, next));
      const previous = zoomRef.current;
      if (Math.abs(previous - value) < 0.001) return;
      const rect = element.getBoundingClientRect();
      const x =
        clientX === undefined ? element.clientWidth / 2 : clientX - rect.left;
      const y =
        clientY === undefined ? element.clientHeight / 2 : clientY - rect.top;
      anchor.current = {
        left: ((element.scrollLeft + x) * value) / previous - x,
        top: ((element.scrollTop + y) * value) / previous - y,
      };
      zoomRef.current = value;
      setZoom(value);
    },
    [],
  );

  useLayoutEffect(() => {
    if (viewport.current && anchor.current) {
      viewport.current.scrollLeft = anchor.current.left;
      viewport.current.scrollTop = anchor.current.top;
    }
  }, [zoom]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setWidth(Math.max(0, element.clientWidth - 24)),
    );
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientHeight
            : 1);
      zoomTo(
        zoomRef.current * Math.exp(-delta * 0.005),
        event.clientX,
        event.clientY,
      );
    };
    let pinch: { distance: number; zoom: number } | null = null;
    const distance = (touches: TouchList) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      pinch = { distance: distance(event.touches), zoom: zoomRef.current };
    };
    const move = (event: TouchEvent) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      const [first, second] = [event.touches[0], event.touches[1]];
      zoomTo(
        (pinch.zoom * distance(event.touches)) / Math.max(1, pinch.distance),
        (first.clientX + second.clientX) / 2,
        (first.clientY + second.clientY) / 2,
      );
    };
    const end = () => {
      pinch = null;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", start, { passive: false });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", end);
    return () => {
      observer.disconnect();
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", end);
    };
  }, [zoomTo]);

  return { viewport, width, zoom, zoomTo };
}
