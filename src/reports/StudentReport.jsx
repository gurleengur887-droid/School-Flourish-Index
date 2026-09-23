import React, { useEffect, useRef, useState } from "react";
import "./StudentReport.css";
import {
  FiGlobe,
  FiMail,
  FiPhone,
} from "react-icons/fi";
/* =========================================================
   SMALL SVG ICONS
========================================================= */

function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 100 80"
      className="sr-icon"
      aria-hidden="true"
    >
      <circle cx="50" cy="22" r="14" fill="currentColor" />
      <circle cx="23" cy="29" r="10" fill="currentColor" />
      <circle cx="77" cy="29" r="10" fill="currentColor" />

      <path
        d="M25 70c0-17 11-27 25-27s25 10 25 27"
        fill="currentColor"
      />

      <path
        d="M4 70c0-13 8-21 19-21 7 0 13 3 17 9-8 4-13 11-14 20H4z"
        fill="currentColor"
      />

      <path
        d="M96 70c0-13-8-21-19-21-7 0-13 3-17 9 8 4 13 11 14 20h22z"
        fill="currentColor"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="sr-summary-icon sr-star"
      aria-hidden="true"
    >
      <path
        d="M50 5l12 30 33 2-25 21 8 32-28-18-28 18 8-32L5 37l33-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="sr-summary-icon sr-target"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
      />
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      />
      <circle cx="50" cy="50" r="10" fill="currentColor" />

      <path
        d="M61 39l25-25"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M78 14h10v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="sr-search-icon"
      aria-hidden="true"
    >
      <circle
        cx="42"
        cy="42"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />
      <path
        d="M60 60l22 22"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LogoPlaceholder() {
  return (
    <div className="sr-logo-area">
      <img
        src="/logo.png"
        alt="School Flourish Index"
        className="sr-logo-image"
      />
    </div>
  );
}

/* =========================================================
   DECORATIVE FOOTER LEAVES
========================================================= */




/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  if (!value) {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getScore(parameter) {
  return typeof parameter?.average === "number"
    ? parameter.average
    : null;
}

function getPerformanceFromScore(score) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "";
  }

  /*
   * Student performance uses the same score bands already
   * used by the Teacher report. This keeps the 1–5 scale
   * interpretation consistent across respondent types.
   */
  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.8) return "Very Good";
  if (score >= 3.0) return "Good";
  if (score >= 2.0) return "Needs Attention";
  return "Critical";
}

function displayPerformance(parameter) {
  if (parameter?.performance && parameter.performance !== "—") {
    return parameter.performance;
  }

  return getPerformanceFromScore(getScore(parameter));
}

function getPerformanceClass(performance) {
  if (performance === "Excellent" || performance === "Outstanding") {
    return "excellent";
  }

  if (performance === "Good" || performance === "Very Good") {
    return "good";
  }

  if (performance === "Needs Attention") {
    return "attention";
  }

  if (performance === "Critical") {
    return "critical";
  }

  return "";
}

function getDimensionName(name) {
  return String(name || "")
    .replace("Student Voice, Purpose & Future Readiness", "Student Voice, Purpose & Future Readiness");
}

function getObservationText(report) {
  if (
    Array.isArray(report?.observations) &&
    report.observations.length
  ) {
    return report.observations.slice(0, 4);
  }

  const strengths = Array.isArray(report?.strengths)
    ? report.strengths
    : [];

  const focusAreas = Array.isArray(report?.focusAreas)
    ? report.focusAreas
    : [];

  const strongest = strengths[0];
  const weakest = focusAreas.slice(0, 2);

  const observations = [];

  if (strongest) {
    observations.push(
      `Strongest dimension: ${strongest.name} (${strongest.average.toFixed(
        2
      )}/5).`
    );
  } else {
    observations.push(
      "No dimension currently meets the strength threshold of 4.0."
    );
  }

  if (weakest.length) {
    observations.push(
      `Areas needing attention: ${weakest
        .map(
          (item) =>
            `${item.name} (${item.average.toFixed(2)}/5)`
        )
        .join(" and ")}.`
    );
  } else {
    observations.push(
      "No dimension falls below the focus threshold of 3.8."
    );
  }

  if (
    typeof report?.overallScore === "number"
  ) {
    observations.push(
      `Overall weighted Student index: ${report.overallScore.toFixed(
        2
      )}/100.`
    );
  } else {
    observations.push(
      "Overall weighted Student index is unavailable."
    );
  }

  observations.push(
    "Student responses provide a snapshot of learning, wellbeing, belonging and school experience."
  );

  return observations;
}


/* =========================================================
   MAIN STUDENT REPORT
========================================================= */

 export default function StudentReport({ report }) {
  const wrapperRef = useRef(null);
  const [reportScale, setReportScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const availableWidth =
        wrapper.parentElement?.clientWidth || window.innerWidth;

      const nextScale = Math.min(
        1,
        Math.max(320, availableWidth - 8) / 1055
      );

      setReportScale(Number(nextScale.toFixed(4)));
    };

    updateScale();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScale)
        : null;

    if (resizeObserver && wrapper.parentElement) {
      resizeObserver.observe(wrapper.parentElement);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  if (!report) {
    return null;
  }

  const parameters = Array.isArray(
    report.parameters
  )
    ? report.parameters
    : Array.isArray(report.dimensions)
      ? report.dimensions
      : [];

  const strengths = Array.isArray(
    report.strengths
  )
    ? report.strengths
    : [];

  const focusAreas = Array.isArray(
    report.focusAreas
  )
    ? report.focusAreas
    : [];

  const school =
    report.respondent?.school ||
    "School";
const studentName =
  report.respondent?.name ||
  "Student";
  const respondents =
    typeof report.respondents === "number"
      ? report.respondents
      : 1;

  const generatedDate =
    report.submission?.date ||
    report.generatedDate ||
    new Date();

  const observations =
    getObservationText(report);

  const barColors = [
    "#8dc5e8",
    "#98d5a8",
    "#f6d66e",
    "#ed9ca5",
    "#a89be0",
    "#8dc5e8",
    "#98d5a8",
    "#f6d66e",
  ];

  return (
   <div
  className="student-report-wrapper"
  ref={wrapperRef}
  style={{
    width: `${1055 * reportScale}px`,
    height: `${1491 * reportScale}px`,
  }}
>
  <div
    className="student-report"
    style={{
      transform: `scale(${reportScale})`,
      transformOrigin: "top left",
    }}
  >

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="sr-header">

          <div className="sr-header-watercolor" />

          {/* Logo area intentionally left empty.
              The final SFI / SkillSphere logo will be added later. */}
         <LogoPlaceholder />


          <div className="sr-header-divider" />


          <div className="sr-title-block">

            <h1>
              <span>SFI STUDENT VOICE</span>
              <span>REPORT</span>
            </h1>

            <div className="sr-subtitle">
              SURVEY INSIGHTS SNAPSHOT
            </div>

            <p>
              Happier Students. Brighter Learners.
              Stronger Schools.
            </p>

          </div>


         {/* TOP RIGHT IMAGE */}
<div className="sr-header-message">
  <img
    src="/assets/happier-students.png"
    alt="Happier Students"
    className="sr-header-message-image"
  />
</div>

        </section>


        {/* =================================================
            INFORMATION BAR
        ================================================= */}

       <section className="sr-info">

  <div className="sr-info-field">
    <span className="sr-info-label">
      School:
    </span>

    <strong>
      {school}
    </strong>

    <div className="sr-info-line" />
  </div>


  <div className="sr-info-field">
    <span className="sr-info-label">
      Student Name:
    </span>

    <strong>
      {studentName}
    </strong>

    <div className="sr-info-line" />
  </div>


  <div className="sr-info-field sr-date-field">
    <span className="sr-info-label">
      Date:
    </span>

    <strong>
      {formatDate(generatedDate)}
    </strong>

    <div className="sr-info-line" />
  </div>

</section>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="sr-summary">

          <div className="sr-summary-card sr-respondents-card">

            <PeopleIcon />

            <div className="sr-summary-content">

              <h3>
                STUDENTS
                <br />
                RESPONDED
              </h3>

              <div className="sr-summary-number">
                {respondents}
              </div>

              <em>
                (if applicable)
              </em>

            </div>

          </div>


          <div className="sr-summary-card sr-strength-card">

            <StarIcon />

            <div className="sr-summary-content">

              <h3>
                STRENGTH AREAS
              </h3>

              <div className="sr-summary-number">
                {strengths.length}
              </div>

              <em>
                scoring ≥ 4.0
              </em>

            </div>

          </div>


          <div className="sr-summary-card sr-focus-card">

            <TargetIcon />

            <div className="sr-summary-content">

              <h3>
                FOCUS AREAS
              </h3>

              <div className="sr-summary-number">
                {focusAreas.length}
              </div>

              <em>
                scoring &lt; 3.8
              </em>

            </div>

          </div>

        </section>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="sr-main">

          {/* -----------------------------------------------
              LEFT: DIMENSION TABLE
          ------------------------------------------------ */}

          <div className="sr-panel sr-dimension-panel">

            <div className="sr-panel-title">
              SFI STUDENT DIMENSION ANALYSIS
            </div>


            <div className="sr-table-header">

              <div>
                Student Dimension
              </div>

              <div>
                Score
                <br />
                (out of 5)
              </div>

              <div>
                Performance
              </div>

            </div>


            <div className="sr-dimension-list">

              {parameters.map(
                (parameter, index) => {

                  const score =
                    getScore(parameter);

                  const performance =
                    displayPerformance(
                      parameter
                    );

                  return (
                    <div
                      className="sr-dimension-row"
                      key={
                        parameter.key ||
                        parameter.name ||
                        index
                      }
                    >

                      <div className="sr-dimension-name">
                        {getDimensionName(
                          parameter.name
                        )}
                      </div>


                      <div className="sr-dimension-score">

                        {score !== null
                          ? score.toFixed(2)
                          : ""}

                        <span className="sr-score-line" />

                      </div>


                      <div className="sr-performance-cell">

                        <span
                          className={
                            performance
                              ? `sr-performance sr-performance-filled ${getPerformanceClass(
                                  performance
                                )}`
                              : "sr-performance"
                          }
                        >
                          {performance}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>


          {/* -----------------------------------------------
              RIGHT COLUMN
          ------------------------------------------------ */}

          <div className="sr-right-column">

            {/* SCORE DISTRIBUTION */}

            <div className="sr-panel sr-chart-panel">

              <div className="sr-panel-title">
                SCORE DISTRIBUTION BY DIMENSION
              </div>


              <div className="sr-chart">

                {parameters.map(
                  (parameter, index) => {

                    const score =
                      getScore(parameter);

                    const safeScore =
                      score === null
                        ? 0
                        : score;

                    const width =
                      Math.max(
                        0,
                        Math.min(
                          100,
                          (safeScore / 5) *
                            100
                        )
                      );

                    return (
                      <div
                        className="sr-chart-row"
                        key={
                          parameter.key ||
                          parameter.name ||
                          index
                        }
                      >

                        <div className="sr-chart-label">
                          {getDimensionName(
                            parameter.name
                          )}
                        </div>


                        <div className="sr-chart-bar-wrap">

                          <div className="sr-bar-track">

                            <div
                              className="sr-bar-fill"
                              style={{
                                width:
                                  `${width}%`,
                                background:
                                  barColors[
                                    index %
                                      barColors.length
                                  ],
                              }}
                            />

                          </div>


                          <span className="sr-chart-score">

                            {score !== null
                              ? score.toFixed(
                                  2
                                )
                              : ""}

                          </span>

                        </div>

                      </div>
                    );
                  }
                )}


                <div className="sr-chart-axis">

                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>

                </div>

              </div>

            </div>


            {/* KEY OBSERVATIONS */}

            <div className="sr-panel sr-observations-panel">

              <div className="sr-panel-title">
                KEY OBSERVATIONS
              </div>


              <div className="sr-observation-body">

                <div className="sr-search-circle">
                  <SearchIcon />
                </div>


                <div className="sr-observation-list">

                  {observations
                    .slice(0, 4)
                    .map(
                      (
                        observation,
                        index
                      ) => (

                        <div
                          className="sr-observation"
                          key={index}
                        >

                          <span className="sr-bullet">
                            •
                          </span>

                          <p>
                            {observation}
                          </p>

                        </div>
                      )
                    )}

                </div>

              </div>

            </div>

          </div>

        </section>


       <section className="tr-footer">

  <div className="tr-footer-contact">

    <div className="tr-footer-item">
      <FiGlobe className="tr-footer-icon" />
      <span>schoolflourishindex.in</span>
    </div>

    <div className="tr-footer-separator" />

    <div className="tr-footer-item">
      <FiGlobe className="tr-footer-icon" />
      <span>skillspherebyesh.com</span>
    </div>

    <div className="tr-footer-separator" />

    <div className="tr-footer-item">
      <FiMail className="tr-footer-icon" />
      <span>info@schoolflourishindex.in</span>
    </div>

    <div className="tr-footer-separator" />

    <div className="tr-footer-item">
      <FiPhone className="tr-footer-icon" />
      <span>91-9779982140</span>
    </div>

  </div>

</section>

      </div>
    </div>
  );
}
