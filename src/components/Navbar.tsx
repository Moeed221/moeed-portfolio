import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import profileImg from "../assets/moeed.jpg";
import { MdClose, MdDownload, MdEmail, MdLocalPhone } from "react-icons/md";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | undefined;

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1025px), (pointer: fine)", () => {
      // Touch phones already use native motion; avoid transforming the whole
      // page through ScrollSmoother's main-thread scroll handler on those devices.
      const instance = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.7,
        speed: 1.7,
        effects: true,
        autoResize: true,
        ignoreMobileResize: true,
      });

      smoother = instance;
      if (!document.querySelector(".main-active")) {
        instance.scrollTop(0);
        instance.paused(true);
      }
      return () => {
        instance.kill();
        if (smoother === instance) smoother = undefined;
      };
    });

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".header ul a"));
    const onLinkClick = (event: Event) => {
      if (window.innerWidth <= 1024) return;
      event.preventDefault();
      const section = (event.currentTarget as HTMLAnchorElement).getAttribute("data-href");
      if (smoother) smoother.scrollTo(section, true, "top top");
      else if (section) document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
    };
    let resizeTimer: ReturnType<typeof setTimeout>;
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => smoother?.refresh(), 200);
    };
    links.forEach((link) => link.addEventListener("click", onLinkClick));
    window.addEventListener("resize", onResize);
    return () => {
      links.forEach((link) => link.removeEventListener("click", onLinkClick));
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      media.revert();
    };
  }, []);

  useEffect(() => {
    const closeProfileMenu = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <>
      <div className="header">
        <div className="profile-menu-wrap" ref={profileMenuRef}>
          <button
            type="button"
            className="navbar-title profile-trigger"
            data-cursor="disable"
            aria-label="Open profile"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((current) => !current)}
          >
            <img src={profileImg} alt="Moeed Naik" />
          </button>

          {isProfileOpen && (
            <div className="profile-popover" role="dialog" aria-label="Profile">
              <button
                type="button"
                className="profile-close"
                data-cursor="disable"
                aria-label="Close profile"
                onClick={() => setIsProfileOpen(false)}
              >
                <MdClose />
              </button>
              <img
                src={profileImg}
                alt="Moeed Naik"
                className="profile-popover-img"
              />
              <div className="profile-popover-info">
                <span className="profile-label">Profile</span>
                <h2>Moeed Naik</h2>
                <p>UI/UX Designer · Product Design</p>
              </div>
              <a
                href="mailto:moeedkhalid22@gmail.com"
                className="profile-detail profile-link"
                data-cursor="disable"
              >
                <MdEmail />
                <div>
                  <span>Email</span>
                  <strong>moeedkhalid22@gmail.com</strong>
                </div>
              </a>
              <a
                href="tel:+923071768667"
                className="profile-detail profile-link"
                data-cursor="disable"
              >
                <MdLocalPhone />
                <div>
                  <span>Phone</span>
                  <strong>+92 307 1768667</strong>
                </div>
              </a>
              <a
                href="/Moeed-Naik-CV.pdf"
                download="Moeed-Naik-CV.pdf"
                className="profile-cv"
                data-cursor="disable"
              >
                <MdDownload />
                Download CV
              </a>
            </div>
          )}
        </div>
        <a
          href="mailto:moeedkhalid22@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          moeedkhalid22@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
