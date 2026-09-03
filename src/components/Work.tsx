import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import aeonSignIn from "../assets/Signin.png";
import aeonSplash from "../assets/Aeonsplash.jpg";
import minimiAskAi from "../assets/ASKAI.jpg";
import minimiSplash from "../assets/1_Splash Screen.jpg";
import mehmanNawazSignIn from "../assets/Sign in.svg";
import mehmanNawazSplash from "../assets/Splash.jpg";
import balochistanEwallet from "../assets/balochistan-ewallet.png";
import cuidaaprLogin from "../assets/cuidaaprlogin.png";
import cuidaaprSplash from "../assets/cuidaaprsplash.png";
import iqpromptText from "../assets/iqpromptext.png";
import iqpromptPlatform from "../assets/iqpompt.png";
import dixapp from "../assets/dixapp.png";
import mini from "../assets/Mini.png";
import mnimiMobile from "../assets/mnimi-mobile.png";
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
          {/* Navigation Arrows */}
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

          {/* Slides */}
          <div className="carousel-track-container">
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
  );
};

export default Work;
