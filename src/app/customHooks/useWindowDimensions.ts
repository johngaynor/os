"use client";

import { useEffect, useState } from "react";

export function useWindowDimensions(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);

    updateMatch(); // set initial value
    media.addEventListener("change", updateMatch);

    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}
