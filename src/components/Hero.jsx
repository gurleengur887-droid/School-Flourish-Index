import React from "react";
import { ArrowRight, BarChart3 } from "lucide-react";
import "../styles/home.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-container">

        <div className="hero-content">

          <div className="section-label">
            <span className="label-line"></span>
            <span>360° SCHOOL ECOSYSTEM</span>
          </div>

          <h1 className="hero-title">
            How well is your school helping
            <span>children flourish?</span>
          </h1>

          <p className="hero-description">
            SFI brings parent, teacher, student and leader voices
            into one thoughtful picture of school life — so the next
            conversation starts with evidence and care.
          </p>

          <div className="hero-actions">

            <a href="/surveys" className="primary-button">
              <span>Start a survey</span>
              <ArrowRight size={19} strokeWidth={1.7} />
            </a>

            <a href="/dashboard" className="secondary-button">
              <span>Explore Insights</span>
              <BarChart3 size={17} strokeWidth={1.6} />
            </a>

          </div>

          <div className="hero-note">
            <span className="hero-dot"></span>

            <span>
              Perspective-based
            </span>

            <span>·</span>

            <span>
              Not a clinical measure
            </span>

            <span>·</span>

            <span>
              Built for reflection
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;