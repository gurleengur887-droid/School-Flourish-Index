import React from "react";
import { ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* TOP BRAND AREA */}
        <div className="footer-brand">

          <a href="/" className="footer-logo">
            <img
              src="/logo.png"
              alt="School Flourish Index"
            />
          </a>

          <div className="footer-brand-copy">
            <span className="footer-brand-name">
              SCHOOL FLOURISH INDEX
            </span>

            <h2>
              A fuller picture of
              <br />
              school life.
            </h2>

            <p>
              Shaped by the voices
              <br />
              within it.
            </p>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="footer-right">

          {/* EXPLORE */}
          <div className="footer-column">

            <span className="footer-heading">
              Explore
            </span>

            <nav className="footer-nav">

              <a href="/">
                <span>Home</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </a>

              <a href="/surveys">
                <span>Surveys</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </a>
 <a href="/about">
                <span>About</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </a>
              <a href="/dashboard">
                <span>Insights</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </a>

             

            </nav>

          </div>


          {/* CONNECT */}
          <div className="footer-column footer-connect">

            <span className="footer-heading">
              Connect
            </span>

            <div className="footer-contact">

              <a
                href="https://www.instagram.com/skillsphereflourish?igsi=NHhudWV0amNiMjl3"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />

                <span>
                  Instagram
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                />
              </a>


              <a href="mailto:your@email.com">

                <FaEnvelope />

                <span>
                  your@email.com
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                />

              </a>


              <a href="tel:+919779982140">

                <FaPhoneAlt />

                <span>
                  +91 97799-82140
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                />

              </a>

            </div>

          </div>

        </div>

      </div>


      {/* FOOTER CTA */}
      <div className="footer-cta">

        <div className="footer-cta-text">
          <span>Ready to listen?</span>

          <h3>
            Start with a
            <em> conversation.</em>
          </h3>
        </div>

        <a
          href="/surveys"
          className="footer-cta-button"
        >
          Explore SFI
          <ArrowUpRight
            size={19}
            strokeWidth={1.5}
          />
        </a>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <span>
          © 2025 SFI
        </span>

        <span>
          Parent · Teacher · Student · Leader
        </span>

        <span>
          Built for reflection
        </span>

      </div>

    </footer>
  );
};

export default Footer;