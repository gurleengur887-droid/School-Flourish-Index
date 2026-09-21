
import React from "react";
import { ArrowUpRight, Mail, } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import "../styles/insights_access.css";
import SEO from "../components/SEO";
const InsightsAccess = () => {
  return (
    <main className="insights-access-page">
      <SEO
  title="Access Your Insights — School Flourish Index"
  description="Access your School Flourish Index insights and explore what your responses reveal about your experience."
  url="/insights-access"
/>
      <section className="insights-access-hero">
        <div className="insights-access-label">
          <span></span>
          YOUR INSIGHTS
        </div>

        <div className="insights-access-content">
          <div className="insights-access-heading">
            <p className="insights-access-kicker">
              YOUR VOICE MATTERS.
            </p>

            <h1>
              See what your
              <em> voice reveals.</em>
            </h1>
          </div>

          <div className="insights-access-copy">
            <p>
              You've shared your perspective. Now, we'd love to help you
              understand what your responses say about your experience.
            </p>

            <p>
              To explore your individual insights, connect with our team
              through any of the options below.
            </p>
          </div>
        </div>

        <div className="insights-access-divider" />

        <div className="insights-access-contact">
          <div className="insights-access-contact-intro">
            <span>LET'S CONNECT</span>
            <h2>
              Your insights are
              worth exploring.
            </h2>
          </div>

          <div className="insights-access-options">
            <a
              href="https://wa.me/9779982140"
              target="_blank"
              rel="noreferrer"
              className="insights-contact-card"
            >
              <div className="contact-card-icon">
            <FaWhatsapp size={21} />
              </div>

              <div className="contact-card-text">
                <span>WHATSAPP</span>
                <strong>Talk to our team</strong>
              </div>

              <ArrowUpRight size={20} strokeWidth={1.5} />
            </a>

            <a
              href="mailto:info@schoolflourishindex.in"
              className="insights-contact-card"
            >
              <div className="contact-card-icon">
                <Mail size={20} strokeWidth={1.5} />
              </div>

              <div className="contact-card-text">
                <span>EMAIL</span>
                <strong>Request your insights</strong>
              </div>

              <ArrowUpRight size={20} strokeWidth={1.5} />
            </a>

            <a
              href="https://www.instagram.com/skillsphereflourish?igsi=NHhudWV0amNiMjl3"
              target="_blank"
              rel="noreferrer"
              className="insights-contact-card"
            >
              <div className="contact-card-icon">
                <FaInstagram size={20} />
              </div>

              <div className="contact-card-text">
                <span>INSTAGRAM</span>
                <strong>Stay connected</strong>
              </div>

              <ArrowUpRight size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="insights-access-note">
          <span className="insights-note-mark">✦</span>
          <p>
            Your responses are private and are used only to help us
            understand and share meaningful insights.
          </p>
        </div>
      </section>
    </main>
  );
};

export default InsightsAccess;

