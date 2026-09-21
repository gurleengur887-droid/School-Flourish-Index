import React, { useEffect, useRef, useState } from "react";
import "../styles/publicStrengthsSection.css";

const FALLBACK_DIMENSIONS = [
  { name: "Teacher–Child Relationship", percentage: 82, is_demo: true },
  { name: "Child–School Fit", percentage: 78, is_demo: true },
  { name: "Leadership Trust", percentage: 80, is_demo: true },
  { name: "Child Happiness & Safety", percentage: 79, is_demo: true },
  { name: "Learning & Growth", percentage: 81, is_demo: true },
  { name: "School Culture", percentage: 76, is_demo: true },
  { name: "Parent–School Partnership", percentage: 77, is_demo: true },
];

export default function PublicStrengthsSection({ dimensions = [] }) {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  const displayDimensions =
    Array.isArray(dimensions) && dimensions.length > 0
      ? dimensions
      : FALLBACK_DIMENSIONS;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`public-strengths-section ${
        hasEntered ? "is-visible" : ""
      }`}
    >
     <div className="public-dashboard-container">

  <div className="public-strengths-layout">

    {/* LEFT SIDE */}
    <div className="public-strengths-heading">
      <span className="public-card-eyebrow">
        WHERE SCHOOLS ARE STRONGEST
      </span>

      <h2>
        The areas where
        <br />
        <em>flourishing takes shape.</em>
      </h2>

      <p>
        A collective view of the areas where schools are creating
        stronger conditions for wellbeing, growth and flourishing.
      </p>
    </div>

    {/* RIGHT SIDE */}
    <div className="public-strengths-card">

      <div className="public-strengths-intro">
        <span>COLLECTIVE SFI VIEW</span>

        <p>
          These scores reflect the perspectives currently contributing
          to the School Flourish Index.
        </p>
      </div>

      <div className="public-strengths-list">

        {displayDimensions.map((dimension, index) => {
          const percentage = Math.min(
            100,
            Math.max(0, Number(dimension.percentage) || 0)
          );

          return (
            <div
              className="public-strength-row"
              key={dimension.name}
            >
              <div className="public-strength-meta">

                <div className="public-strength-name">
                  <span className="public-strength-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{dimension.name}</span>
                </div>

                <strong>
                  {percentage.toFixed(0)}%
                </strong>

              </div>

              <div className="public-strength-track">
                <div
                  className={`public-strength-fill public-strength-fill-${
                    index + 1
                  }`}
                  style={{
                    "--strength-width": `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

      </div>

      <div className="public-strengths-footer">
        <span>Based on collective responses</span>
        <span>SFI · School Flourish Index</span>
      </div>

    </div>

  </div>

</div>
    </section>
  );
}