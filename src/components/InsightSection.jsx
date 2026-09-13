import React from "react";
import {
  ShieldCheck,
  UsersRound,
  BarChart3,
  Sprout,
} from "lucide-react";

import "../styles/insight_section.css";

const InsightSection = () => {
  return (
    <section className="sfi-insight">

      {/* =====================================
          DECORATIVE BACKGROUND
      ====================================== */}

      <div className="sfi-insight-orbit"></div>

     


      <div className="sfi-insight-leaf sfi-leaf-one"></div>
      <div className="sfi-insight-leaf sfi-leaf-two"></div>


      <div className="sfi-insight-inner">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="sfi-insight-header">

          <div className="sfi-insight-heading">

            <div className="sfi-insight-kicker">
              <span></span>
              FROM INSIGHT TO ACTION
            </div>

            <h2>
              A kinder, stronger
              <br />
              <em>way forward.</em>
            </h2>

          </div>


          <p className="sfi-insight-intro">
            Listening is just the beginning.
            Here’s how we turn insight into
            meaningful change — together.
          </p>

        </header>


        {/* =====================================
            THREE STEPS
        ====================================== */}

        <div className="sfi-insight-cards">

          {/* LISTEN */}

          <article className="sfi-insight-card sfi-insight-card-listen">

            <div className="sfi-insight-card-top">

              <span className="sfi-insight-number">
                01 / LISTEN
              </span>

              <div className="sfi-insight-icon">
                <UsersRound
                  size={27}
                  strokeWidth={1.25}
                />
              </div>

            </div>


            <div className="sfi-insight-card-content">

              <h3>
                Make space for the
                <br />
                lived experience.
              </h3>

              <p>
                We create space for honest,
                diverse perspectives from
                everyone in the school community.
              </p>

            </div>


           


            <div className="sfi-card-leaf"></div>

          </article>


          {/* NOTICE */}

          <article className="sfi-insight-card sfi-insight-card-notice">

            <div className="sfi-insight-card-top">

              <span className="sfi-insight-number">
                02 / NOTICE
              </span>

              <div className="sfi-insight-icon">
                <BarChart3
                  size={27}
                  strokeWidth={1.25}
                />
              </div>

            </div>


            <div className="sfi-insight-card-content">

              <h3>
                See patterns, not just
                <br />
                a single number.
              </h3>

              <p>
                We look beyond the surface to
                understand the real stories,
                connections and trends in the data.
              </p>

            </div>


           




            <svg
              className="sfi-card-flow"
              viewBox="0 0 300 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M-10 115 C70 35 140 100 210 25 S290 15 320 -10" />
            </svg>

          </article>


          {/* RESPOND */}

          <article className="sfi-insight-card sfi-insight-card-respond">

            <div className="sfi-insight-card-top">

              <span className="sfi-insight-number">
                03 / RESPOND
              </span>

              <div className="sfi-insight-icon">
                <Sprout
                  size={27}
                  strokeWidth={1.25}
                />
              </div>

            </div>


            <div className="sfi-insight-card-content">

              <h3>
                Turn insight into a
                <br />
                kinder next step.
              </h3>

              <p>
                We work with schools to turn
                understanding into practical,
                people-centred action.
              </p>

            </div>





            <div className="sfi-card-arc"></div>

          </article>

        </div>


        {/* =====================================
            INTERPRETATION PANEL
        ====================================== */}

        <div className="sfi-interpretation">

          {/* LEFT SEAL */}

          <div className="sfi-interpretation-seal">

            <div className="sfi-interpretation-seal-ring">
              <ShieldCheck
                size={43}
                strokeWidth={1.15}
              />
            </div>

          </div>


          {/* MAIN STATEMENT */}

          <div className="sfi-interpretation-heading">

            <span>
              A NOTE ON INTERPRETATION
            </span>

            <h3>
              Evidence with
              <br />
              <em>humility.</em>
            </h3>

          </div>


          {/* DESCRIPTION */}

          <div className="sfi-interpretation-copy">

            <p>
              SFI profiles reflect how people
              experience a school at a point in
              time. They are designed to support
              listening and action — not to
              diagnose, rank, or declare one
              school the best for every child.
            </p>

            <div className="sfi-interpretation-caption">

              <span></span>

              PEOPLE LEAD PROGRESS

            </div>

          </div>


          {/* Decorative corner */}

          <div className="sfi-interpretation-circle"></div>

        </div>


        {/* =====================================
            BOTTOM DECORATION
        ====================================== */}

        <div className="sfi-insight-bottom-line">

          <svg
            viewBox="0 0 1400 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 55 C180 0 300 95 480 50 S770 10 930 65 S1190 100 1400 30" />

            <circle
              cx="390"
              cy="58"
              r="7"
            />
          </svg>

        </div>


        <div className="sfi-insight-bottom-mark">
          <span></span>

          <p>
            A BRIGHTER
            <br />
            TOMORROW,
            <br />
            TOGETHER.
          </p>
        </div>

      </div>

    </section>
  );
};

export default InsightSection;