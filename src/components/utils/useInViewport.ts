import { RefObject, useEffect, useState } from "react";

// IntersectionObserver also follows ScrollSmoother's transformed content.
export function useInViewport(ref: RefObject<HTMLElement>, rootMargin = "0px") {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0);
    }, { rootMargin, threshold: [0, 0.001] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isVisible;
}

export function usePageVisible() {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  useEffect(() => {
    const onVisibilityChange = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);
  return isVisible;
}
