import React from "react";
import {
  ArrowRight,
  Ear,
  Grid2X2,
  Search,
  Route,
  Users,
} from "lucide-react";
import "../styles/how_it_works.css";

const HowitWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Listen.",
      text: "Hear what parents, teachers, students and leaders are actually experiencing.",
      icon: Ear,
    },
    {
      number: "02",
      title: "Bring together.",
      text: "Place different perspectives beside one another instead of relying on a single voice.",
      icon: Grid2X2,
    },
    {
      number: "03",
      title: "Notice patterns.",
      text: "Look for recurring signals, differences and places where experiences meet.",
      icon: Search,
    },
    {
      number: "04",
      title: "Respond.",
      text: "Use what is being heard to begin better conversations and kinder next steps.",
      icon: Route,
    },
  ];

  return (
    <section className="how-sfi-section">

      <div className="how-sfi-container">

        {/* =====================================
            SECTION HEADER
        ===================================== */}

        <div className="how-sfi-top">

          <div className="how-sfi-label-wrap">
            <span className="how-sfi-label-line"></span>

            <span className="how-sfi-label">
              HOW THE INDEX WORKS
            </span>
          </div>

        </div>


        {/* =====================================
            MAIN INTRO
        ===================================== */}

        <div className="how-sfi-intro">

          {/* LEFT */}

          <div className="how-sfi-heading-area">

            <span className="how-sfi-eyebrow">
              FROM VOICES TO INSIGHT
            </span>

            <h2>
              Listen first.
              <br />
              Then look for the{" "}
              <em>pattern.</em>
            </h2>

          </div>


          {/* RIGHT */}

          <div className="how-sfi-intro-right">

           


            {/* CIRCLE */}

            <div className="how-sfi-voices-circle">

              <Users
                size={30}
                strokeWidth={1.1}
              />

              <span className="circle-line"></span>

              <span className="circle-small">
                FOUR VOICES
              </span>

              <span className="circle-main">
                ONE FULLER
                <br />
                PICTURE
              </span>

            </div>

          </div>

        </div>


        {/* =====================================
            PROCESS FLOW
        ===================================== */}

        <div className="how-sfi-flow">

          {/* CONNECTING LINE */}

          <div className="how-sfi-flow-line"></div>


          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>

                <div className="how-sfi-step">

                  {/* NUMBER */}

                  <div className="how-sfi-number">
                    {step.number}
                  </div>


                  {/* ICON */}

                  <div className="how-sfi-icon">

                    <Icon
                      size={30}
                      strokeWidth={1.2}
                    />

                  </div>


                  {/* CONTENT */}

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>

                </div>


                {/* ARROW */}

                {index < steps.length - 1 && (
                  <div className="how-sfi-arrow">

                    <ArrowRight
                      size={24}
                      strokeWidth={1.2}
                    />

                  </div>
                )}

              </React.Fragment>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default HowitWorks;