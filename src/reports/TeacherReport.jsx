import React from "react";
import "./TeacherReport.fixed.css";
import {
  FiGlobe,
  FiMail,
  FiPhone,
} from "react-icons/fi";
/* =========================================================
   SMALL SVG ICONS
========================================================= */

function LogoPlaceholder() {
  return (
    <div className="tr-logo-placeholder">
      <img
        src="/logo.png"
        alt="School Flourish Index"
        className="tr-logo-image"
      />
    </div>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 100 80" className="tr-icon">
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
    <svg viewBox="0 0 100 100" className="tr-summary-icon star">
      <path
        d="M50 5l12 30 33 2-25 21 8 32-28-18-28 18 8-32L5 37l33-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="tr-summary-icon target">
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="9" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="8" />
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
    <svg viewBox="0 0 100 100" className="tr-search-icon">
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

/* =========================================================
   HELPERS
========================================================= */

function formatGeneratedDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getParameterDisplayName(name) {
  if (name === "Professional Growth, Recognition & Autonomy") {
    return "Professional Growth & Recognition";
  }

  if (name === "Self-Efficacy – Classroom Management") {
    return "Classroom Management";
  }

  return name;
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

  return "critical";
}

function getScore(parameter) {
  return typeof parameter?.average === "number"
    ? parameter.average
    : null;
}

/* =========================================================
   MAIN REPORT
========================================================= */

export default function TeacherReport({ report }) {
  if (!report) {
    return null;
  }

  const parameters = Array.isArray(report.parameters)
    ? report.parameters
    : [];

  const strengths = Array.isArray(report.strengths)
    ? report.strengths
    : [];

  const focusAreas = Array.isArray(report.focusAreas)
    ? report.focusAreas
    : [];

  const school = report.respondent?.school || "School";
  const teacherName = report.respondent?.name || "Teacher";

  const happiness =
    report.overallHappiness?.percentage ?? null;

  const recommendation =
    report.recommendation?.percentage ?? null;

  const thfi =
    typeof report.thfi === "number"
      ? report.thfi.toFixed(2)
      : "—";

  /*
   * Individual report:
   * one respondent = one response.
   */
  const respondents = 1;

  const generatedDate = formatGeneratedDate();

  const strongest = strengths.slice(0, 2);
  const weakest = focusAreas.slice(0, 2);

  return (
  <div className="teacher-report-wrapper">
    <div className="teacher-report">
      {/* =====================================================
          HEADER
      ===================================================== */}

     {/* =====================================================
    HEADER
===================================================== */}

<section className="tr-header">

  {/* subtle watercolor background */}
  <div className="tr-header-watercolor" />

<LogoPlaceholder />
  

  {/* vertical divider */}
  <div className="tr-header-divider" />

  {/* TITLE */}
  <div className="tr-title-block">

    <h1>
      TEACHER HAPPINESS &<br />
      FLOURISHING REPORT
    </h1>

    <div className="tr-subtitle">
      SURVEY INSIGHTS SNAPSHOT
    </div>

    <p>
      Thriving Teachers. Brighter Learners. Stronger Schools.
    </p>

  </div>
</section>

      {/* =====================================================
          RESPONDENT INFORMATION
      ===================================================== */}

      <section className="tr-info">

        <div className="tr-info-field">
          <span className="tr-info-label">School:</span>
        <strong
  className="tr-school-value"
>
  {school}
</strong>
          <div className="tr-info-line" />
        </div>

        <div className="tr-info-field">
          <span className="tr-info-label">Teacher Name:</span>
          <strong>{teacherName}</strong>
          <div className="tr-info-line" />
        </div>

        <div className="tr-info-field">
          <span className="tr-info-label">Date:</span>
          <strong>{generatedDate}</strong>
          <div className="tr-info-line" />
        </div>

      </section>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="tr-summary">

        <div className="tr-summary-card respondents-card">
          <PeopleIcon />

          <div className="tr-summary-content">
            <h3>
              TEACHERS
              <br />
              RESPONDED
            </h3>

            <div className="tr-summary-number">
              {respondents}
            </div>

            <em>(individual report)</em>
          </div>
        </div>

        <div className="tr-summary-card strength-card">
          <StarIcon />

          <div className="tr-summary-content">
            <h3>STRENGTH AREAS</h3>

            <div className="tr-summary-number">
              {strengths.length}
            </div>

            <em>scoring ≥ 4.0</em>
          </div>
        </div>

        <div className="tr-summary-card focus-card">
          <TargetIcon />

          <div className="tr-summary-content">
            <h3>FOCUS AREAS</h3>

            <div className="tr-summary-number">
              {focusAreas.length}
            </div>

            <em>scoring &lt; 3.8</em>
          </div>
        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="tr-main">

        {/* ===================================================
            LEFT - PARAMETER TABLE
        =================================================== */}

        <div className="tr-panel parameter-panel">

          <div className="tr-panel-title">
            THFI PARAMETER ANALYSIS
          </div>

          <div className="tr-table-header">
            <div>Parameter</div>
            <div>Score<br />(out of 5)</div>
            <div>Performance</div>
          </div>

          <div className="tr-parameter-list">

            {parameters.map((parameter) => {

              const score = getScore(parameter);

              const performance =
                parameter.performance || "—";

              return (
                <div
                  className="tr-parameter-row"
                  key={parameter.key || parameter.name}
                >

                  <div className="tr-parameter-name">
                    {getParameterDisplayName(
                      parameter.name
                    )}
                  </div>

                  <div className="tr-parameter-score">
                    {score !== null
                      ? score.toFixed(2)
                      : "—"}
                  </div>

                  <div className="tr-performance-cell">

                    <span
                      className={`tr-performance ${getPerformanceClass(
                        performance
                      )}`}
                    >
                      {performance}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="tr-right-column">

          {/* SCORE DISTRIBUTION */}

          <div className="tr-panel chart-panel">

            <div className="tr-panel-title">
              SCORE DISTRIBUTION BY PARAMETER
            </div>

            <div className="tr-chart">

              {parameters.map((parameter, index) => {

                const score = getScore(parameter);
                const safeScore =
                  score === null ? 0 : score;

                const width =
                  Math.max(
                    0,
                    Math.min(
                      100,
                      (safeScore / 5) * 100
                    )
                  );

                const barColors = [
                  "#8dc5e8",
                  "#98d5a8",
                  "#f6d66e",
                  "#ed9ca5",
                  "#a89be0",
                  "#8dc5e8",
                  "#98d5a8",
                  "#f6d66e",
                  "#ed9ca5",
                  "#a89be0",
                  "#8dc5e8",
                ];

                return (
                  <div
                    className="tr-chart-row"
                    key={parameter.key || index}
                  >

                    <div className="tr-chart-label">
                      {getParameterDisplayName(
                        parameter.name
                      )}
                    </div>

                    <div className="tr-bar-area">

                      <div className="tr-bar-track">

                        <div
                          className="tr-bar-fill"
                          style={{
                            width: `${width}%`,
                            background:
                              barColors[
                                index %
                                  barColors.length
                              ],
                          }}
                        />

                      </div>

                      <span className="tr-chart-score">
                        {score !== null
                          ? score.toFixed(2)
                          : "—"}
                      </span>

                    </div>

                  </div>
                );
              })}

              <div className="tr-chart-axis">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>

            </div>

          </div>

          {/* =================================================
              KEY OBSERVATIONS
          ================================================= */}

          <div className="tr-panel observations-panel">

            <div className="tr-panel-title">
              KEY OBSERVATIONS
            </div>

            <div className="tr-observation-body">

              <div className="tr-search-circle">
                <SearchIcon />
              </div>

              <div className="tr-observation-list">

                <div className="tr-observation">
                  <span className="tr-bullet">•</span>

                  <p>
                    <strong>Strongest areas:</strong>{" "}
                    {strongest.length
                      ? strongest
                          .map(
                            (item) =>
                              `${getParameterDisplayName(
                                item.name
                              )} (${item.average.toFixed(
                                2
                              )})`
                          )
                          .join(" and ")
                      : "No parameter scored 4.0 or above."}
                  </p>
                </div>

                <div className="tr-observation">
                  <span className="tr-bullet">•</span>

                  <p>
                    <strong>
                      Areas needing attention:
                    </strong>{" "}
                    {weakest.length
                      ? weakest
                          .map(
                            (item) =>
                              `${getParameterDisplayName(
                                item.name
                              )} (${item.average.toFixed(
                                2
                              )})`
                          )
                          .join(" and ")
                      : "No parameter falls below 3.8."}
                  </p>
                </div>

                <div className="tr-observation">
                  <span className="tr-bullet">•</span>

                  <p>
                    <strong>Overall THFI:</strong>{" "}
                    {thfi}/100 ({report.rating}).
                  </p>
                </div>

                <div className="tr-observation">
                  <span className="tr-bullet">•</span>

                  <p>
                    <strong>Overall happiness:</strong>{" "}
                    {happiness !== null
                      ? `${happiness}%`
                      : "—"}{" "}
                    and{" "}
                    <strong>
                      recommendation likelihood:
                    </strong>{" "}
                    {recommendation !== null
                      ? `${recommendation}%`
                      : "—"}.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER CONTACT
      ===================================================== */}

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