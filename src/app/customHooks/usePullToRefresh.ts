import { useEffect } from "react";

// for mobile since converting to a PWA disables the native pull to refresh
export function usePullToRefresh(refreshFn: () => void) {
  useEffect(() => {
    let startY = 0;
    let isPulling = false;

    function onTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!isPulling) return;
      const currentY = e.touches[0].clientY;
      if (currentY - startY > 80) {
        refreshFn();
        isPulling = false;
      }
    }

    function onTouchEnd() {
      isPulling = false;
    }

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [refreshFn]);
}
