import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import gsap from "gsap";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social")!;
    const items = Array.from(social.querySelectorAll("span")).map((element) => ({
      element,
      link: element.querySelector("a")!,
      mouseX: 25,
      mouseY: 25,
      currentX: 0,
      currentY: 0,
    }));
    let ticking = false;
    const stop = () => {
      gsap.ticker.remove(update);
      ticking = false;
    };
    const update = () => {
      if (document.hidden || window.innerWidth < 900) {
        stop();
        return;
      }
      let settled = true;
      items.forEach((item) => {
        item.currentX += (item.mouseX - item.currentX) * 0.1;
        item.currentY += (item.mouseY - item.currentY) * 0.1;
        item.link.style.setProperty("--siLeft", `${item.currentX}px`);
        item.link.style.setProperty("--siTop", `${item.currentY}px`);
        if (Math.abs(item.mouseX - item.currentX) + Math.abs(item.mouseY - item.currentY) > 0.05) settled = false;
      });
      if (settled) stop();
    };
    const start = () => {
      if (!ticking && !document.hidden && window.innerWidth >= 900) {
        ticking = true;
        gsap.ticker.add(update);
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      items.forEach((item) => {
        const rect = item.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        item.mouseX = x < 40 && x > 10 && y < 40 && y > 5 ? x : rect.width / 2;
        item.mouseY = x < 40 && x > 10 && y < 40 && y > 5 ? y : rect.height / 2;
      });
      start();
    };
    const onVisibilityChange = () => document.hidden ? stop() : start();
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", start);
    start();
    return () => {
      stop();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", start);
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="mailto:moeedkhalid22@gmail.com" aria-label="Email Moeed Naik">
            <FaEnvelope />
          </a>
        </span>
        <span>
          <a href="tel:+923071768667" aria-label="Call Moeed Naik">
            <FaPhone />
          </a>
        </span>
        <span>
          <a href="https://wa.me/923071768667" target="_blank" rel="noreferrer" aria-label="WhatsApp Moeed Naik">
            <FaWhatsapp />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/Moeed-Naik-CV.pdf"
        target="_blank"
        data-cursor="disable"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
