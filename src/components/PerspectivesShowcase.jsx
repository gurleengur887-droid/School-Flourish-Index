
import React from "react";
import {
  ArrowUpRight,
  Heart,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/perspectives_showcase.css";

const perspectives = [
  {
    id: "parent",
    label: "PARENT VOICE",
    eyebrow: "FOR PARENTS & CAREGIVERS",
    title: (
      <>
        A school
        <br />
        that feels right.
      </>
    ),
    points: [
      "Does your child feel safe and comfortable at school?",
      "Do they feel seen, supported and included?",
      "Are they getting the space to grow with confidence?",
    ],
    focus: ["Belonging", "Safety", "Growth"],
    icon: Heart,
    className: "parent-card",
  },

  {
    id: "teacher",
    label: "TEACHER VOICE",
    eyebrow: "FOR TEACHERS",
    title: (
      <>
        When teachers
        <br />
        can flourish.
      </>
    ),
    points: [
      "Do you feel energised or exhausted by your work?",
      "Do you feel supported and trusted in your role?",
      "Do you have room to grow and do your best work?",
    ],
    focus: ["Energy", "Support", "Growth"],
    icon: Users,
    className: "teacher-card",
  },

  {
    id: "student",
    label: "STUDENT VOICE",
    eyebrow: "FOR STUDENTS",
    title: (
      <>
        A place where
        <br />
        I belong.
      </>
    ),
    points: [
      "Do you feel safe and comfortable being yourself?",
      "Do you feel heard, included and respected?",
      "Do you feel confident in your learning?",
    ],
    focus: ["Belonging", "Voice", "Learning"],
    icon: Sparkles,
    className: "student-card",
  },

  {
    id: "leader",
    label: "LEADER VOICE",
    eyebrow: "FOR SCHOOL LEADERS",
    title: (
      <>
        Stronger leaders.
        <br />
        Brighter schools.
      </>
    ),
    points: [
      "How are you really feeling behind the leadership role?",
      "Do you feel trusted and supported when things get difficult?",
      "Are you able to protect your well-being while leading others?",
    ],
    focus: ["Pressure", "Trust", "Well-being"],
    icon: ShieldCheck,
    className: "leader-card",
  },
];

const PerspectivesShowcase = () => {
  const navigate = useNavigate();

  const handleSurveyClick = (role) => {
    // Remember which perspective the visitor chose.
    sessionStorage.setItem("sfi_selected_role", role);

    // Start the existing survey flow.
    navigate("/surveys");
  };

  return (
    <section className="perspectives-showcase" id="surveys">

      <div className="perspectives-showcase-container">

        {/* =========================
            INTRO
        ========================== */}

        <div className="perspectives-intro">

          <div className="perspectives-intro-left">

            <div className="perspectives-label">
              <span className="perspectives-label-line"></span>
              <span>CHOOSE A VOICE</span>
            </div>

            <h2 className="perspectives-title">
              Four Perspectives.
              <br />
              <em>One fuller picture.</em>
            </h2>

          </div>


          <div className="perspectives-intro-right">

            <p>
              A school is experienced differently by everyone
              inside it. Choose the perspective that feels most
              like yours and add your voice to the picture.
            </p>

            <div className="perspectives-intro-note">
              <span className="intro-note-dot"></span>
              EVERY VOICE ADDS SOMETHING.
            </div>

          </div>

        </div>


        {/* =========================
            DECORATIVE CONNECTOR
        ========================== */}

        <div className="perspectives-connector">
          <span className="connector-dot connector-dot-one"></span>
          <span className="connector-dot connector-dot-two"></span>
          <span className="connector-dot connector-dot-three"></span>
        </div>


        {/* =========================
            CARD AREA
        ========================== */}

        <div className="perspectives-layout">

          {/* OUTER DECORATION */}

          <div className="layout-decoration layout-decoration-one">
            <span></span>
          </div>

          <div className="layout-decoration layout-decoration-two">
            <span></span>
          </div>

          <div className="layout-decoration layout-decoration-three">
            <span></span>
          </div>


          {perspectives.map((item, index) => {

            const Icon = item.icon;

            return (
              <article
                key={item.id}
                className={`perspective-card ${item.className}`}
                style={{
                  "--card-delay": `${index * 120}ms`,
                }}
              >

                {/* Organic background shape */}

                <div className="perspective-organic-shape"></div>


                {/* Small accent */}

                <div className="perspective-orbit-dot"></div>


                {/* =========================
                    HEADER
                ========================== */}

                <div className="perspective-card-header">

                  <div className="perspective-card-identity">

                    <div className="perspective-icon">
                      <Icon
                        size={23}
                        strokeWidth={1.45}
                      />
                    </div>

                    <div>

                      <span className="perspective-card-label">
                        {item.label}
                      </span>

                      <span className="perspective-card-eyebrow">
                        {item.eyebrow}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =========================
                    VISUAL
                ========================== */}

                <div className="perspective-visual">

                  <div className="visual-frame">

                    <div className="visual-inner">

                      <span className="visual-word">
                        {item.id === "parent" && "CARE"}
                        {item.id === "teacher" && "ENERGY"}
                        {item.id === "student" && "VOICE"}
                        {item.id === "leader" && "TRUST"}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =========================
                    CONTENT
                ========================== */}

                <div className="perspective-card-content">

                  <h3 className="perspective-card-title">
                    {item.title}
                  </h3>

                  <ul className="perspective-card-points">

                    {item.points.map((point) => (
                      <li key={point}>
                        <span className="point-bubble"></span>
                        <span>{point}</span>
                      </li>
                    ))}

                  </ul>

                </div>


                {/* =========================
                    FOOTER
                ========================== */}

                <div className="perspective-card-footer">

                  <div className="perspective-focus">

                    <span className="focus-label">
                      THIS VOICE EXPLORES
                    </span>

                    <div className="focus-items">

                      {item.focus.map((focus) => (
                        <span key={focus}>
                          {focus}
                        </span>
                      ))}

                    </div>

                  </div>


                  <button
                    type="button"
                    className="perspective-fill-button"
                    onClick={() => handleSurveyClick(item.id)}
                  >

                    <span>
                      Fill this survey
                    </span>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.7}
                    />

                  </button>

                </div>

              </article>
            );
          })}

        </div>


        {/* =========================
            CLOSING
        ========================== */}

        <div className="perspectives-closing">

          <span className="closing-line"></span>

          <p>
            Every perspective moves the picture forward.
          </p>

          <span className="closing-line"></span>

        </div>

      </div>

    </section>
  );
};

export default PerspectivesShowcase;
