import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
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

 const [openingRole, setOpeningRole] = useState(null);

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
}, []);
useEffect(() => {
  if (window.location.hash === "#choose-your-voice") {
    setTimeout(() => {
      const section = document.getElementById(
        "choose-your-voice"
      );

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  }
}, []);
 const handleRoleClick = (role) => {
  // Show visual feedback immediately
  setOpeningRole(role);

  // Save the selected perspective
  sessionStorage.setItem(
    "sfi_selected_role",
    role
  );

  // Get the Google Form URL
  const surveyUrl = surveyLinks[role];

  if (!surveyUrl) {
    console.log(
      `Google Form for "${role}" is not connected yet.`
    );
    setOpeningRole(null);
    return;
  }

  // Small delay so the green arrow is actually visible
  setTimeout(() => {
    window.location.href = surveyUrl;
  }, 250);
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
                <p> YOUR PERSPECTIVE</p>
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
    YOUR VOICE NOTE
======================================== */}

<section className="perspective-privacy">

  <div className="perspective-container">

    <div className="privacy-note">

      {/* LEFT LABEL */}
      <div className="privacy-note-label">
        <span></span>
        <p>YOUR VOICE MATTERS</p>
      </div>


      {/* MAIN CONTENT */}
      <div className="privacy-note-content">

        <h2>
          Say what you
          <br />
          <em>really feel.</em>
        </h2>

        <div className="privacy-note-copy">

          <p className="privacy-note-intro">
            This is a safe, anonymous space to share
            your honest experience of school life.
          </p>

          <p className="privacy-note-emphasis">
            No names. No judgement. Just your voice.
          </p>

          <p>
            Your feedback helps build a healthier,
            happier and more flourishing school
            ecosystem.
          </p>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* ========================================
          CHOOSE VOICE
      ======================================== */}

<section
  className="perspective-choice"
  id="choose-your-voice"
>
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

  const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                className={`survey-perspective-card survey-perspective-card-${role.tone}`}
                 onClick={() => handleRoleClick(role.id)
                  }
                >

                  



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

                <span
  className={`survey-perspective-card-arrow ${
    openingRole === role.id
      ? "survey-perspective-card-arrow-opening"
      : ""
  }`}
>
  <ArrowRight
    size={19}
    strokeWidth={1.25}
  />
</span>

                </button>
              );
            })}

          </div>

        </div>

      </section>


     
      

   

    </main>
  );
};

export default Perspective;