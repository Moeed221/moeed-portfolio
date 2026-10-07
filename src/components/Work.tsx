import { useState, useCallback, useLayoutEffect, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import aeonSignIn from "../assets/Signin.webp";
import aeonSplash from "../assets/Aeonsplash.jpg";
import minimiAskAi from "../assets/ASKAI.jpg";
import minimiSplash from "../assets/1_Splash Screen.jpg";
import mehmanNawazSignIn from "../assets/Sign in.svg";
import mehmanNawazSplash from "../assets/Splash.jpg";
import balochistanEwallet from "../assets/balochistan-ewallet.webp";
import cuidaaprLogin from "../assets/cuidaaprlogin.webp";
import cuidaaprSplash from "../assets/cuidaaprsplash.webp";
import iqpromptText from "../assets/iqpromptext.webp";
import iqpromptPlatform from "../assets/iqpompt.webp";
import dixapp from "../assets/dixapp.webp";
import mini from "../assets/Mini.webp";
import mnimiMobile from "../assets/mnimi-mobile.webp";
import snookerDashboard from "../assets/snooker-dashboard.jpg";

type Project = {
  title: string;
  category: string;
  tools: string;
  image: string;
  images?: string[];
  featuredCard?: boolean;
  mobileCard?: boolean;
};

const projects: Project[] = [
  {
    title: "DAPIXEL",
    category: "Responsive Web Product",
    tools: "Interface Design, Visual Hierarchy, Responsive Design, Product Discovery",
    image: dixapp,
    featuredCard: true,
  },
  {
    title: "Mnimi",
    category: "Mobile Product Experience",
    tools: "Mobile UI, User Flows, Interface Design, Prototyping",
    image: mini,
    featuredCard: true,
  },
  {
    title: "IQPROMPT",
    category: "AI SaaS Platform",
    tools: "Information Architecture, AI Workflows, Design System, Figma",
    image: iqpromptPlatform,
    featuredCard: true,
  },
  {
    title: "IQPROMPT Extension",
    category: "AI Writing Assistant",
    tools: "Content Workflows, Responsive UI, Product Design, Developer Handoff",
    image: iqpromptText,
    featuredCard: true,
  },
  {
    title: "AEON",
    category: "School Logistics · Mobile App",
    tools: "Dual Interface, User Flows, Seat Reservation, Live Tracking",
    image: aeonSplash,
    images: [aeonSplash, aeonSignIn],
    mobileCard: true,
  },
  {
    title: "CUIDAAPR",
    category: "Caregiver Marketplace · Healthcare",
    tools: "Mobile UX, Service Discovery, Caregiver Comparison, Booking Flow",
    image: cuidaaprSplash,
    images: [cuidaaprSplash, cuidaaprLogin],
    mobileCard: true,
  },
  {
    title: "Mnimi",
    category: "Healthcare Mobile App",
    tools: "Patient Care, Family Updates, Caregiver Flows, Accessibility",
    image: mnimiMobile,
    images: [minimiAskAi, minimiSplash],
    mobileCard: true,
  },
  {
    title: "Mehman Nawaz",
    category: "Food Sharing · Mobile App",
    tools: "Location-Based UX, Donor & Recipient Flows, Mobile UI, Accessibility",
    image: mehmanNawazSplash,
    images: [mehmanNawazSplash, mehmanNawazSignIn],
    mobileCard: true,
  },
  {
    title: "Digital Citizen Balochistan",
    category: "Government-Funded Fintech App",
    tools: "Mobile App, Wireframing, Prototyping, Financial Accessibility",
    image: balochistanEwallet,
    mobileCard: true,
  },
  {
    title: "Elite Snooker Club",
    category: "B2B/B2C Web Platform",
    tools: "Dashboard Design, Booking System, Player Management, Real-Time Updates",
    image: snookerDashboard,
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = trackContainerRef.current;
    const slide = container?.querySelectorAll<HTMLElement>(".carousel-slide")[currentIndex];
    if (!container || !slide) return;

    // On narrow screens, follow the visible project instead of the tallest slide.
    const updateHeight = () => {
      container.style.setProperty("--carousel-height", `${slide.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [currentIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Slides */}
          <div className="carousel-track-container" ref={trackContainerRef}>
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Design Focus</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        images={project.images}
                        alt={project.title}
                        featuredCard={project.featuredCard}
                        mobileCard={project.mobileCard}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            <div className="carousel-arrows">
              <button
                className="carousel-arrow carousel-arrow-left"
                onClick={goToPrev}
                aria-label="Previous project"
                data-cursor="disable"
              >
                <MdArrowBack />
              </button>
              <button
                className="carousel-arrow carousel-arrow-right"
                onClick={goToNext}
                aria-label="Next project"
                data-cursor="disable"
              >
                <MdArrowForward />
              </button>
            </div>
            {/* Dot Indicators */}
            <div className="carousel-dots">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                    }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to project ${index + 1}`}
                  data-cursor="disable"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
