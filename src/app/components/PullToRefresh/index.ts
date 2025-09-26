"use client";

import { useEffect } from "react";

export default function PullToRefresh() {
  useEffect(() => {
    let startY: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startY !== null && e.touches[0].clientY - startY > 50) {
        window.location.reload();
        startY = null;
      }
    };

    const onTouchEnd = () => {
      startY = null;
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return null;
}
