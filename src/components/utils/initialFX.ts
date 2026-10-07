import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

let removeLoopObservers: (() => void) | undefined;

export function clearInitialFX() {
  removeLoopObservers?.();
  removeLoopObservers = undefined;
}

export function initialFX() {
  clearInitialFX();
  document.body.style.overflowY = "auto";
  smoother?.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  const landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  const titleReveal = gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingText2 = new SplitText(".landing-h2-info", TextProps);
  const infoReveal = gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const headingReveal = gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText3 = new SplitText(".landing-h2-info-1", TextProps);
  const landingText4 = new SplitText(".landing-h2-1", TextProps);
  const landingText5 = new SplitText(".landing-h2-2", TextProps);

  const loops = [titleReveal, infoReveal, headingReveal, LoopText(landingText2, landingText3), LoopText(landingText4, landingText5)];
  let visible = true;
  const updateLoops = () => loops.forEach((loop) => loop.paused(!visible || document.hidden));
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateLoops();
  });
  const landing = document.getElementById("landingDiv");
  if (landing) observer.observe(landing);
  document.addEventListener("visibilitychange", updateLoops);
  updateLoops();
  removeLoopObservers = () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", updateLoops);
    loops.forEach((loop) => loop.kill());
  };
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
  return tl;
}
