import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  UsersRound,
  BookOpen,
  Backpack,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/perspective.css";
import SEO from "../components/SEO";
const roles = [
  {
    id: "parent",
    number: "01",
    title: "Parent",
    description:
      "Share what school life feels like from your child's perspective.",
    icon: UsersRound,
    tone: "parent",
  },
  {
    id: "teacher",
    number: "02",
    title: "Teacher",
    description:
      "Reflect on teaching, support, relationships and your experience at school.",
    icon: BookOpen,
    tone: "teacher",
  },
  {
    id: "student",
    number: "03",
    title: "Student",
    description:
      "Tell us about belonging, learning, safety and having a voice at school.",
    icon: Backpack,
    tone: "student",
  },
  {
    id: "leader",
    number: "04",
    title: "Leader",
    description:
      "Reflect on leadership, relationships and the well-being of your school.",
    icon: Sprout,
    tone: "leader",
  },
];

const surveyLinks = {
  parent: "https://forms.gle/Qe3KrT6fjAqd6pQs6",
  teacher: "https://forms.gle/gKjUawGEpG5nQqLB9",
  student: "https://forms.gle/FfD1W63BjP1CrnbG8",
  leader: "https://forms.gle/2eoSn8gLvmEdMzBq9",
};

const Perspective = () => {
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const storedSchool = sessionStorage.getItem(
      "sfi_selected_school"
    );

    if (storedSchool) {
      try {
        setSchool(JSON.parse(storedSchool));
      } catch {
        sessionStorage.removeItem(
          "sfi_selected_school"
        );
      }
    }

    const storedRole = sessionStorage.getItem(
      "sfi_selected_role"
    );

    if (
      storedRole &&
      roles.some((role) => role.id === storedRole)
    ) {
      setSelectedRole(storedRole);
    }
  }, []);

  const handleContinue = () => {
    if (!selectedRole) return;

    // Save the selected perspective
    sessionStorage.setItem(
      "sfi_selected_role",
      selectedRole
    );

    // Get the Google Form URL for the selected role
    const surveyUrl = surveyLinks[selectedRole];

    if (!surveyUrl) {
      console.log(
        `Google Form for "${selectedRole}" is not connected yet.`
      );
      return;
    }

    // Open the selected role's Google Form
    window.location.href = surveyUrl;
  };

  return (
    <main className="perspective-page">
<SEO
  title="School Perspectives — School Flourish Index"
  description="Explore the different perspectives that shape our understanding of flourishing in education, including students, teachers, families and school leaders."
  url="/perspective"
/>
      {/* ========================================
          TOP / PROGRESS
      ======================================== */}

      <div className="perspective-topbar">
        <div className="perspective-topbar-inner">

          <button
            type="button"
            className="perspective-back"
            onClick={() => navigate("/surveys")}
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.25}
            />

            <span>BACK TO SCHOOL</span>
          </button>

          <div className="perspective-progress">
            <span className="active">02</span>
            <i></i>
            <span>04</span>
          </div>

        </div>
      </div>


      {/* ========================================
          HERO
      ======================================== */}

      <section className="perspective-hero">

        <div className="perspective-container">

          <div className="perspective-hero-grid">

            {/* LEFT */}

            <div className="perspective-hero-copy">

              <div className="perspective-label">
                <span></span>
                <p>02 · YOUR PERSPECTIVE</p>
              </div>

              <h1>
                How do you
                <br />
                experience{" "}
                <em>school?</em>
              </h1>

              <p className="perspective-description">
                There is no right or wrong perspective.
                Choose the one that feels most like yours.
              </p>

            </div>


            {/* RIGHT ART */}

            <div className="perspective-art">

              <div className="perspective-circle"></div>

              <div className="botanical botanical-one">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="botanical botanical-two">
                <span></span>
                <span></span>
              </div>


              {/* SCHOOL CARD */}

              {school && (
                <div className="perspective-school-card">

                  <div className="school-card-accent"></div>

                  <div className="school-card-copy">

                    <span>SURVEY FOR</span>

                    <strong>
                      {school.name}
                    </strong>

                    <small>
                      {school.city}
                      {" · "}
                      {school.state}
                      {" · "}
                      {school.country}
                    </small>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/surveys")
                    }
                  >
                    CHANGE
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          PRIVACY NOTE
      ======================================== */}

      <section className="perspective-privacy">

        <div className="perspective-container">

          <div className="privacy-note">

            <span className="privacy-icon">
              <span></span>
            </span>

            <div className="privacy-copy">

              <strong>
                Your voice matters. Your identity stays private.
              </strong>

              <p>
                Your responses are kept anonymous and help us understand
                the flourishing of your school community.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CHOOSE VOICE
      ======================================== */}

      <section className="perspective-choice">

        <div className="perspective-container">

          <div className="choice-heading">

            <div>
              <span>CHOOSE YOUR VOICE</span>
            </div>

            <p>
              Which perspective are you bringing
              into the School Flourish Index?
            </p>

          </div>


          {/* ROLE CARDS */}

          <div className="survey-perspective-cards">

            {roles.map((role) => {

              const selected =
                selectedRole === role.id;

              const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  className={`survey-perspective-card survey-perspective-card-${role.tone} ${
                    selected
                      ? "survey-perspective-card-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedRole(role.id)
                  }
                >

                  {/* SELECTED CORNER */}

                  {selected && (
                    <span className="survey-card-selected-mark">
                      <Check
                        size={18}
                        strokeWidth={1.5}
                      />
                    </span>
                  )}


                  {/* ICON */}

                  <span className="survey-perspective-icon">

                    <Icon
                      size={36}
                      strokeWidth={1.15}
                    />

                  </span>


                  {/* NUMBER */}

                  <span className="survey-perspective-card-number">
                    {role.number}
                  </span>


                  {/* CONTENT */}

                  <div className="survey-perspective-card-content">

                    <h2>
                      {role.title}
                    </h2>

                    <p>
                      {role.description}
                    </p>

                  </div>


                  {/* ARROW */}

                  <span className="survey-perspective-card-arrow">

                    {selected ? (
                      <Check
                        size={19}
                        strokeWidth={1.4}
                      />
                    ) : (
                      <ArrowRight
                        size={19}
                        strokeWidth={1.25}
                      />
                    )}

                  </span>

                </button>
              );
            })}

          </div>

        </div>

      </section>


      {/* ========================================
          CONTINUE
      ======================================== */}

      <section className="perspective-action-section">

        <div className="perspective-action-inner">

          <div className="perspective-action-note">

            <span
              className={
                selectedRole
                  ? "action-dot action-dot-active"
                  : "action-dot"
              }
            ></span>

            <span>
              {selectedRole
                ? "Perspective selected"
                : "Select a perspective to continue"}
            </span>

          </div>


          <button
            type="button"
            className={`perspective-main-button ${
              selectedRole
                ? "perspective-main-button-active"
                : ""
            }`}
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            <span>Continue to survey</span>

            <ArrowRight
              size={21}
              strokeWidth={1.25}
            />
          </button>

        </div>

      </section>

    </main>
  );
};

export default Perspective;