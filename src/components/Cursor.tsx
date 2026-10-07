import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current!;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1 });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1 });
    const mouse = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    let hoveringIcons = false;
    let ticking = false;
    const stop = () => {
      gsap.ticker.remove(update);
      ticking = false;
    };
    const update = () => {
      if (hoveringIcons || document.hidden || !finePointer.matches) {
        stop();
        return;
      }
      position.x += (mouse.x - position.x) / 6;
      position.y += (mouse.y - position.y) / 6;
      xTo(position.x);
      yTo(position.y);
      if (Math.abs(mouse.x - position.x) + Math.abs(mouse.y - position.y) < 0.05) stop();
    };
    const start = () => {
      if (!ticking && !document.hidden && finePointer.matches) {
        ticking = true;
        gsap.ticker.add(update);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!hoveringIcons) start();
    };
    const onMouseOver = (event: MouseEvent) => {
      const element = (event.target as Element).closest<HTMLElement>("[data-cursor]");
      if (!element || element.contains(event.relatedTarget as Node | null)) return;
      if (element.dataset.cursor === "icons") {
        hoveringIcons = true;
        stop();
        const rect = element.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        xTo(rect.left);
        yTo(rect.top);
      }
      if (element.dataset.cursor === "disable") cursor.classList.add("cursor-disable");
    };
    const onMouseOut = (event: MouseEvent) => {
      const element = (event.target as Element).closest<HTMLElement>("[data-cursor]");
      if (!element || element.contains(event.relatedTarget as Node | null)) return;
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hoveringIcons = false;
      start();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
        xTo.tween.pause();
        yTo.tween.pause();
      } else start();
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      xTo.tween.kill();
      yTo.tween.kill();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
