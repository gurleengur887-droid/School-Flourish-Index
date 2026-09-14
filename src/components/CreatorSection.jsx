import React from "react";
import { ArrowUpRight } from "lucide-react";
import "../styles/creator_section.css";

const CreatorSection = () => {
  return (
    <section className="creator-section">

      <div className="creator-container">

        {/* LEFT SIDE */}
        <div className="creator-left">     

          <span className="creator-label">
            THE PERSON BEHIND THE QUESTIONS
          </span>

          <h2 className="creator-heading">
            Meet 
            <br />
             the Creator
            <br />
            <em>of SFI</em>
          </h2>

          <div className="creator-photo-wrap">

            <img
              src="/founder2.jpeg"
              alt="Eshu Madaan"
              className="creator-photo"
            />

            <span className="creator-photo-caption">
              Founder&nbsp; · &nbsp;SkillSphere by ESH
            </span>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="creator-right">

          <blockquote className="creator-quote">
            “Before we ask how a school is doing,
             we should ask how the people
            inside it are doing.”
          </blockquote>


          <div className="creator-divider"></div>


          <div className="creator-bio">

            <p>
              <strong>Eshu Madaan</strong> created the
              School Flourish Index from a simple belief:
              a school cannot be understood from its
              results alone.
            </p>

            <p>
              It has to be understood through the people
              who live it every day — the parent wondering
              if their child feels at home, the teacher
              carrying more than the timetable shows, the
              student finding their voice, and the leader
              trying to hold everything together.
            </p>

            <p>
              As the founder of
              <strong> SkillSphere by ESH</strong>, she
              brings that same belief into SFI: making
              experiences visible, not to judge them,
              but to listen to them.
            </p>

          </div>


          {/* SKILLSPHERE LINK */}
          <a
            href="https://www.skillspherebyesh.com/"
            className="creator-link"
          >
            <span>Discover SkillSphere</span>
            <ArrowUpRight
              size={20}
              strokeWidth={1.4}
            />
          </a>


          {/* SIGNATURE */}
          <div className="creator-signature">

  <img
    src="/signature.png"
    alt="Eshu Madaan signature"
    className="creator-signature-image"
  />

  <span className="creator-role">
    Founder · SkillSphere by ESH
  </span>

</div>

        </div>

      </div>

    </section>
  );
};

export default CreatorSection;