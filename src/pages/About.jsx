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

            <div
              className="about-vertical-note"
              aria-hidden="true"
            >
              <span>PEOPLE</span>
              <span>PLACES</span>
              <span>POSSIBILITIES</span>
            </div>


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

            <span>
              LOOK BEYOND
              <br />
              THE OBVIOUS
            </span>

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
<section className="voices-section" id="voices">

  <div className="voices-container">

    {/* HEADER */}

    <div className="voices-top">

      <div className="voices-label">
        <span className="voices-label-line"></span>
        <span>WHY FOUR VOICES?</span>
      </div>

      <div className="voices-intro">
        <h2>
          A school has
          <br />
          <em>many</em> ways of
          <br />
          being experienced.
        </h2>

        <p>
          The same school can feel completely different
          depending on where you stand. SFI listens from
          all four sides.
        </p>
      </div>

    </div>


    {/* VISUAL VOICE FIELD */}

    <div className="voice-field">

      {/* PARENT */}

      <article className="voice-card voice-card-parent">

        <div className="voice-card-top">
          <span>01</span>
          <span>PARENT</span>
        </div>

        <div className="voice-card-content">

          <span className="voice-card-word">
            HOME
          </span>

          <h3>
            What happens
            <br />
            <em>after the gate?</em>
          </h3>

          <p>
            The view from the family side —
            belonging, safety and the feeling
            that a child is known.
          </p>

        </div>

        <span className="voice-card-arrow">↗</span>

      </article>


      {/* TEACHER */}

      <article className="voice-card voice-card-teacher">

        <div className="voice-card-top">
          <span>02</span>
          <span>TEACHER</span>
        </div>

        <div className="voice-card-content">

          <span className="voice-card-word">
            CLASSROOM
          </span>

          <h3>
            What does it
            <br />
            <em>take to teach?</em>
          </h3>

          <p>
            The energy, agency and relationships
            that shape the everyday experience
            of teaching.
          </p>

        </div>

        <span className="voice-card-arrow">↗</span>

      </article>


      {/* CENTER */}

      <div className="voice-center">

        <div className="voice-center-circle">

          <span className="voice-center-small">
            ONE SHARED
          </span>

          <strong>
            SCHOOL
          </strong>

          <span className="voice-center-small">
            MANY EXPERIENCES
          </span>

        </div>

      </div>


      {/* STUDENT */}

      <article className="voice-card voice-card-student">

        <div className="voice-card-top">
          <span>03</span>
          <span>STUDENT</span>
        </div>

        <div className="voice-card-content">

          <span className="voice-card-word">
            WITHIN
          </span>

          <h3>
            What does it
            <br />
            <em>feel like here?</em>
          </h3>

          <p>
            A student's experience of being
            seen, heard, safe and able to
            belong.
          </p>

        </div>

        <span className="voice-card-arrow">↗</span>

      </article>


      {/* LEADER */}

      <article className="voice-card voice-card-leader">

        <div className="voice-card-top">
          <span>04</span>
          <span>LEADER</span>
        </div>

        <div className="voice-card-content">

          <span className="voice-card-word">
            THE CHAIR
          </span>

          <h3>
            What is being
            <br />
            <em>carried?</em>
          </h3>

          <p>
            The pressure, trust and well-being
            behind the person responsible for
            holding everything together.
          </p>

        </div>

        <span className="voice-card-arrow">↗</span>

      </article>

    </div>


    {/* CLOSING LINE */}

    <div className="voices-closing">

      <span>
        Four perspectives
      </span>

      <div className="voices-closing-mark">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <span>
        One fuller picture
      </span>

    </div>

  </div>

</section>
<HowitWorks />
    </main>
  );
};

export default About;