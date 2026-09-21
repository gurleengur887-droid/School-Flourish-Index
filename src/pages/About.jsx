import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "../styles/about.css";
import HowitWorks from "../components/HowItWorks";
import SEO from "../components/SEO";
const About = () => {
  return (
    <main className="about-page">
<SEO
  title="About — School Flourish Index"
  description="Learn about the School Flourish Index and our approach to understanding wellbeing, flourishing and the experiences of people across education."
  url="/about"
/>
   <section className="about-hero">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="about-bg-number"
        aria-hidden="true"
      >
        01
      </div>

      <div
        className="about-orbit about-orbit-top"
        aria-hidden="true"
      />

      <div
        className="about-orbit about-orbit-bottom"
        aria-hidden="true"
      />

      <span
        className="about-orbit-dot about-orbit-dot-top"
        aria-hidden="true"
      />

      <span
        className="about-orbit-dot about-orbit-dot-bottom"
        aria-hidden="true"
      />


      {/* =====================================================
          BOTANICAL DECORATION
      ===================================================== */}

      <div
        className="about-botanical about-botanical-left"
        aria-hidden="true"
      >
        <span className="about-leaf leaf-a" />
        <span className="about-leaf leaf-b" />
        <span className="about-leaf leaf-c" />
      </div>


      <div
        className="about-botanical about-botanical-top"
        aria-hidden="true"
      >
        <span className="about-leaf leaf-a" />
        <span className="about-leaf leaf-b" />
        <span className="about-leaf leaf-c" />
      </div>


      <div
        className="about-botanical about-botanical-bottom"
        aria-hidden="true"
      >
        <span className="about-leaf leaf-a" />
        <span className="about-leaf leaf-b" />
        <span className="about-leaf leaf-c" />
      </div>


      {/* =====================================================
          SOFT BACKGROUND FORMS
      ===================================================== */}

      <div
        className="about-soft-shape about-soft-shape-one"
        aria-hidden="true"
      />

      <div
        className="about-soft-shape about-soft-shape-two"
        aria-hidden="true"
      />


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="about-hero-container">


        {/* ===================================================
            TOP META
        =================================================== */}

        <div className="about-hero-top">

          <div className="about-hero-label-wrap">

            <span className="about-hero-label-line" />

            <span className="about-hero-label">
              ABOUT / THE INDEX
            </span>

          </div>


          <span className="about-hero-count">
            01 / 03
          </span>

        </div>


        {/* ===================================================
            MAIN HERO
        =================================================== */}

        <div className="about-hero-main">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="about-hero-title-area">


            {/* Vertical editorial words */}

           


            <div className="about-hero-title-wrap">

              <span className="about-hero-kicker">
                BEYOND THE OBVIOUS
              </span>


              <h1>
                A school is
                <br />
                a living
                <br />
                <em>ecosystem.</em>
              </h1>

            </div>


           

          </div>


          {/* =================================================
              RIGHT INFORMATION
          ================================================= */}

          <div className="about-hero-info">

            <div className="about-info-inner">


              {/* Circular arrow */}

              <div className="about-info-mark">

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.25}
                />

              </div>


              <span className="about-info-label">
                01 / UNDERSTAND
              </span>


              <h2>
                A school is more than
                <br />
                what can be measured.
              </h2>


              <p>
                The School Flourish Index brings together
                the voices that shape school life — parents,
                teachers, students and leaders — to understand
                the conditions in which people can flourish.
              </p>

            </div>


            

           

          </div>

        </div>


        {/* ===================================================
            BOTTOM EDITORIAL BAR
        =================================================== */}

        <div className="about-hero-lower">


          {/* Left */}

          <div className="about-hero-cue">

            <ArrowDownRight
              size={24}
              strokeWidth={1.15}
            />

          

          </div>


          {/* Center */}

          <div className="about-hero-voices">

            <span>PARENT</span>
            <span>TEACHER</span>
            <span>STUDENT</span>
            <span>LEADER</span>

          </div>


          {/* Right */}

          <span className="about-hero-index">
            SCHOOL FLOURISH INDEX
          </span>

        </div>

      </div>

    </section>

<HowitWorks />
    </main>
  );
};

export default About;