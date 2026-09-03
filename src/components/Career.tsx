import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Associate UI/UX Designer</h4>
                <h5>INOTEXEL, Lahore</h5>
              </div>
              <h3>01</h3>
            </div>
            <p>
              Designed end-to-end SaaS experiences for US and UK clients, including a
              corporate redesign that improved user retention by 25% and IQPrompt's
              developer-ready AI product interface.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>UI/UX Designer</h4>
                <h5>IT Extension, Lahore</h5>
              </div>
              <h3>02</h3>
            </div>
            <p>
              Led end-to-end web and mobile design for B2B/B2C products, including a
              Snooker Management System, a dual-interface school reservation flow,
              and a healthcare app designed in close collaboration with developers.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>UI/UX Designer Intern</h4>
                <h5>Developer.X, Islamabad</h5>
              </div>
              <h3>03</h3>
            </div>
            <p>
              Designed the company's main website and an integrated blogging platform
              with modern navigation, strong information hierarchy, readability, and
              responsive behavior across devices.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>UI/UX Intern</h4>
                <h5>TxLabz</h5>
              </div>
              <h3>04</h3>
            </div>
            <p>
              Built foundational mobile UI/UX skills while contributing interface
              design work to a government-funded project, with a focus on mobile
              layouts, wireframing, prototyping, and visual consistency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
