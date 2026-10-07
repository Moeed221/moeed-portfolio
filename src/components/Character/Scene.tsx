import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { disposeObject } from "./utils/disposeObject";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Keep the same native resolution, lighting and antialiasing.
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(14.5, rect.width / rect.height, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const controller = new AbortController();
    const context = gsap.context(() => {});
    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress(setLoading);
    let character: THREE.Object3D | undefined;
    let headBone: THREE.Object3D | undefined;
    let screenLight: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | undefined;
    let animations: ReturnType<typeof setAnimations> | undefined;
    let removeHover: (() => void) | undefined;
    let introTimer: ReturnType<typeof setTimeout>;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let touchTimer: ReturnType<typeof setTimeout>;
    let cancelTouchReset: (() => void) | undefined;
    let touching = false;
    let isInViewport = true;
    let rendering = false;
    const mouse = { x: 0, y: 0 };
    const interpolation = { x: 0.1, y: 0.2 };
    const setMouse = (x: number, y: number) => { mouse.x = x; mouse.y = y; };

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      if (headBone) {
        handleHeadRotation(headBone, mouse.x, mouse.y, interpolation.x, interpolation.y, THREE.MathUtils.lerp);
        if (screenLight) light.setPointLight(screenLight);
      }
      animations?.mixer.update(delta);
      renderer.render(scene, camera);
    };
    const updateRendering = () => {
      if (controller.signal.aborted) return;
      const shouldRender = isInViewport && !document.hidden;
      if (shouldRender === rendering) return;
      rendering = shouldRender;
      clock.getDelta(); // Do not fast-forward animations after an inactive tab.
      renderer.setAnimationLoop(shouldRender ? animate : null);
    };
    const observer = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting && entry.intersectionRatio > 0;
      updateRendering();
    }, { threshold: [0, 0.001] });
    observer.observe(container);
    document.addEventListener("visibilitychange", updateRendering);
    updateRendering();

    setCharacter(renderer, scene, camera).loadCharacter(controller.signal).then((gltf) => {
      if (controller.signal.aborted) { disposeObject(gltf.scene); return; }
      character = gltf.scene;
      scene.add(character);
      animations = setAnimations(gltf);
      if (hoverDivRef.current) removeHover = animations.hover(gltf, hoverDivRef.current);
      headBone = character.getObjectByName("spine006");
      screenLight = character.getObjectByName("screenlight") as typeof screenLight;
      context.add(() => {
        setCharTimeline(character!, camera);
        setAllTimeline();
      });
      progress.loaded().then(() => {
        if (controller.signal.aborted) return;
        introTimer = setTimeout(() => {
          context.add(() => light.turnOnLights());
          animations?.startIntro();
        }, 2500);
      });
    }).catch((error) => {
      if (controller.signal.aborted) return;
      console.error("Character failed to load:", error);
      progress.clear();
    });

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => handleResize(renderer, camera, canvasDiv), 180);
    };
    const onMouseMove = (event: MouseEvent) => handleMouseMove(event, setMouse);
    const onTouchStart = () => {
      cancelTouchReset?.();
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { touching = true; }, 200);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touching && event.touches.length) handleTouchMove(event, setMouse);
    };
    const onTouchEnd = () => {
      clearTimeout(touchTimer);
      touching = false;
      cancelTouchReset?.();
      cancelTouchReset = handleTouchEnd((x, y, interpolationX, interpolationY) => {
        setMouse(x, y);
        interpolation.x = interpolationX;
        interpolation.y = interpolationY;
      });
    };
    const landing = document.getElementById("landingDiv");
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    landing?.addEventListener("touchstart", onTouchStart, { passive: true });
    landing?.addEventListener("touchmove", onTouchMove, { passive: true });
    landing?.addEventListener("touchend", onTouchEnd);

    return () => {
      controller.abort();
      renderer.setAnimationLoop(null);
      observer.disconnect();
      clearTimeout(introTimer);
      clearTimeout(resizeTimer);
      clearTimeout(touchTimer);
      cancelTouchReset?.();
      progress.cancel();
      removeHover?.();
      animations?.dispose();
      context.revert();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", updateRendering);
      document.removeEventListener("mousemove", onMouseMove);
      landing?.removeEventListener("touchstart", onTouchStart);
      landing?.removeEventListener("touchmove", onTouchMove);
      landing?.removeEventListener("touchend", onTouchEnd);
      light.dispose();
      disposeObject(scene);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};
export default Scene;
