import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInViewport } from "./utils/useInViewport";

const TechStack = lazy(() => import("./TechStack"));

export default function DeferredTechStack() {
  const container = useRef<HTMLDivElement>(null);
  const isNear = useInViewport(container, "600px");
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    if (isNear) setShouldLoad(true);
  }, [isNear]);
  const placeholder = <div className="techstack"><h2> My Design Toolkit</h2></div>;
  return (
    <div ref={container}>
      {shouldLoad ? <Suspense fallback={placeholder}><TechStack /></Suspense> : placeholder}
    </div>
  );
}
