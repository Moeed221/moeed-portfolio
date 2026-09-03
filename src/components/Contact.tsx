import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:moeedkhalid22@gmail.com" data-cursor="disable">
                moeedkhalid22@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+923071768667" data-cursor="disable">
                +92 307 1768667
              </a>
            </p>
            <h4>Education</h4>
            <p>BS Computer Science, The Superior University (CGPA 3.4)</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="mailto:moeedkhalid22@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
            <a
              href="/Moeed-Naik-CV.pdf"
              download="Moeed-Naik-CV.pdf"
              data-cursor="disable"
              className="contact-social"
            >
              Resume <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed with purpose <br /> by <span>Moeed Naik</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
