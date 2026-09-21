import React, { useEffect, useRef, useState } from "react";
import "./LeaderReport.css";
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
    <svg viewBox="0 0 100 80" className="lr-people-icon" aria-hidden="true">
      <circle cx="50" cy="22" r="14" fill="currentColor" />
      <circle cx="23" cy="29" r="10" fill="currentColor" />
      <circle cx="77" cy="29" r="10" fill="currentColor" />
      <path d="M25 70c0-17 11-27 25-27s25 10 25 27" fill="currentColor" />
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
    <svg viewBox="0 0 100 100" className="lr-summary-icon lr-star" aria-hidden="true">
      <path
        d="M50 5l12 30 33 2-25 21 8 32-28-18-28 18 8-32L5 37l33-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="lr-summary-icon lr-target" aria-hidden="true">
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
    <svg viewBox="0 0 100 100" className="lr-search-icon" aria-hidden="true">
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
   HEADER ART
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
  return typeof parameter?.average === "number" &&
    Number.isFinite(parameter.average)
    ? parameter.average
    : null;
}

function getPerformance(parameter) {
  if (parameter?.performance && parameter.performance !== "—") {
    return parameter.performance;
  }

  const score = getScore(parameter);

  if (score === null) return "";

  /*
   * Leader uses the same SFI 1–5 performance bands already
   * used by the Teacher / Student reports, per the approved
   * report-design instruction.
   */
  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.8) return "Very Good";
  if (score >= 3.0) return "Good";
  if (score >= 2.0) return "Needs Attention";
  return "Critical";
}

function getPerformanceClass(performance) {
  if (performance === "Outstanding" || performance === "Excellent") {
    return "excellent";
  }

  if (performance === "Very Good" || performance === "Good") {
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

function getObservationText(report) {
  if (
    Array.isArray(report?.observations) &&
    report.observations.length
  ) {
    const supplied = report.observations.slice(0, 4);

    while (supplied.length < 4) {
      supplied.push(
        [
          "Leader dimension scores reflect the role-specific weighted methodology.",
          "Reverse-scored pressure items have been normalized so higher scores indicate healthier conditions.",
          "Review the dimension results alongside qualitative leader responses.",
          "Use the report as a structured snapshot of leadership conditions at the time of response.",
        ][supplied.length]
      );
    }

    return supplied;
  }

  return [
    typeof report?.overallScore === "number"
      ? `Overall weighted Leader index: ${report.overallScore.toFixed(2)}/100.`
      : "Overall weighted Leader index is unavailable.",
    "Leader dimension scores reflect the role-specific weighted methodology.",
    "Review the dimension results alongside qualitative leader responses.",
    "Use the report as a structured snapshot of leadership conditions at the time of response.",
  ];
}



function getFallbackAreaCounts(parameters) {
  const safeParameters = Array.isArray(parameters) ? parameters : [];

  return {
    strengths: safeParameters.filter(
      (parameter) => {
        const score = getScore(parameter);
        return score !== null && score >= 4.0;
      }
    ).length,
    focusAreas: safeParameters.filter(
      (parameter) => {
        const score = getScore(parameter);
        return score !== null && score < 3.8;
      }
    ).length,
  };
}

/* =========================================================
   MAIN LEADER REPORT
========================================================= */

export default function LeaderReport({ report }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const updateScale = () => {
      const parentWidth =
        wrapper.parentElement?.clientWidth || window.innerWidth;

      const availableWidth = Math.max(320, parentWidth - 8);
      const nextScale = Math.min(1, availableWidth / 1055);

      setScale(Number(nextScale.toFixed(4)));
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

  if (!report) return null;

  const parameters = Array.isArray(report.parameters)
    ? report.parameters
    : Array.isArray(report.dimensions)
      ? report.dimensions
      : [];

  const school = report.respondent?.school || "School";
  const leaderName = report.respondent?.name || "Leader";
  const generatedDate =
    report.submission?.date || report.generatedDate || new Date();

  const fallbackCounts = getFallbackAreaCounts(parameters);

  const strengths =
    Array.isArray(report.strengths)
      ? report.strengths.length
      : fallbackCounts.strengths;

  const focusAreas =
    Array.isArray(report.focusAreas)
      ? report.focusAreas.length
      : fallbackCounts.focusAreas;

  const observations = getObservationText(report);

  const barColors = [
    "#91c8b6",
    "#8bc4b1",
    "#f4d267",
    "#eea0a7",
    "#a79be2",
    "#91bae8",
    "#9ccca6",
  ];

  return (
    <div
      ref={wrapperRef}
      className="leader-report-wrapper"
      style={{
        width: `${1055 * scale}px`,
        height: `${1491 * scale}px`,
      }}
    >
      <div
        className="leader-report"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="lr-header">
         

          <div className="lr-logo-area">
            <img
              src="/logo.png"
              alt="Skillsphere"
              className="lr-logo-img"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement.classList.add(
                  "lr-logo-fallback-visible"
                );
              }}
            />
            <div className="lr-logo-fallback" aria-hidden="true">
              <strong>SFI</strong>
              <span>SKILLSPHERE</span>
            </div>
          </div>

          <div className="lr-header-divider" />

          <div className="lr-title-block">
            <h1>
              <span>SFI LEADER VOICE REPORT</span>
            </h1>

            <div className="lr-subtitle">
              INSIGHTS FOR STRONGER SCHOOLS
            </div>

            <p>
              People <span>|</span> Purpose <span>|</span> Positive Change
            </p>
          </div>

         
        </section>

        {/* =================================================
            RESPONDENT INFORMATION
        ================================================= */}

        <section className="lr-info">
          <div className="lr-info-field">
            <span className="lr-info-label">School:</span>
            <strong>{school}</strong>
            <div className="lr-info-line" />
          </div>

          <div className="lr-info-field">
            <span className="lr-info-label">Leader Name:</span>
            <strong>{leaderName}</strong>
            <div className="lr-info-line" />
          </div>

          <div className="lr-info-field lr-date-field">
            <span className="lr-info-label">Date:</span>
            <strong>{formatDate(generatedDate)}</strong>
            <div className="lr-info-line" />
          </div>
        </section>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="lr-summary">
          <div className="lr-summary-card lr-respondents-card">
            <PeopleIcon />

            <div className="lr-summary-content">
              <h3>RESPONSES</h3>
              <div className="lr-summary-number">
                {typeof report.respondents === "number"
                  ? report.respondents
                  : 1}
              </div>
              <em>(if applicable)</em>
            </div>
          </div>

          <div className="lr-summary-card lr-strength-card">
            <StarIcon />

            <div className="lr-summary-content">
              <h3>STRENGTH AREAS</h3>
              <div className="lr-summary-number">{strengths}</div>
              <em>(scoring ≥ 4.0)</em>
            </div>
          </div>

          <div className="lr-summary-card lr-focus-card">
            <TargetIcon />

            <div className="lr-summary-content">
              <h3>FOCUS AREAS</h3>
              <div className="lr-summary-number">{focusAreas}</div>
              <em>(scoring &lt; 3.8)</em>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="lr-main">
          {/* LEFT: TABLE */}

          <div className="lr-panel lr-dimension-panel">
            <div className="lr-panel-title">
              SFI LEADERSHIP DIMENSION ANALYSIS
            </div>

            <div className="lr-table-header">
              <div>#</div>
              <div>Leadership Dimension</div>
              <div>
                Score
                <br />
                (out of 5)
              </div>
              <div>Performance</div>
            </div>

            <div className="lr-dimension-list">
              {parameters.map((parameter, index) => {
                const score = getScore(parameter);
                const performance = getPerformance(parameter);

                return (
                  <div
                    className="lr-dimension-row"
                    key={parameter.key || parameter.name || index}
                  >
                    <div className="lr-dimension-index">
                      {index + 1}
                    </div>

                    <div className="lr-dimension-name">
                      {parameter.name}
                    </div>

                    <div className="lr-dimension-score">
                      {score !== null ? score.toFixed(2) : ""}

                      <span className="lr-score-line" />
                    </div>

                    <div className="lr-performance-cell">
                      <span
                        className={`lr-performance ${
                          getPerformanceClass(performance)
                        }`}
                      >
                        {performance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="lr-right-column">
            <div className="lr-panel lr-chart-panel">
              <div className="lr-panel-title">
                SCORE DISTRIBUTION BY DIMENSION
              </div>

              <div className="lr-chart">
                {parameters.map((parameter, index) => {
                  const score = getScore(parameter);

                  const width =
                    score === null
                      ? 0
                      : Math.max(
                          0,
                          Math.min(100, (score / 5) * 100)
                        );

                  return (
                    <div
                      className="lr-chart-row"
                      key={`chart-${parameter.key || parameter.name || index}`}
                    >
                      <div className="lr-chart-label">
                        {parameter.name}
                      </div>

                      <div className="lr-chart-bar-wrap">
                        <div className="lr-bar-track">
                          <span
                            className="lr-bar-fill"
                            style={{
                              width: `${width}%`,
                              background:
                                barColors[index % barColors.length],
                            }}
                          />
                        </div>

                        <div className="lr-chart-score">
                          {score !== null ? score.toFixed(2) : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="lr-chart-axis">
                  {[1, 2, 3, 4, 5].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lr-panel lr-observations-panel">
              <div className="lr-panel-title">KEY OBSERVATIONS</div>

              <div className="lr-observations-body">
                <div className="lr-observation-icon-wrap">
                  <SearchIcon />
                </div>

                <div className="lr-observation-list">
                  {observations.map((observation, index) => (
                    <div
                      className="lr-observation-item"
                      key={`${index}-${observation}`}
                    >
                      <span className="lr-observation-dot" />
                      <span className="lr-observation-line">
                        {observation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

       
        <footer className="lr-footer">

  <div className="lr-footer-contact">

    <div className="lr-footer-item">
      <FiGlobe />
      <span>schoolflourishindex.in</span>
    </div>

    <div className="lr-footer-separator" />

    <div className="lr-footer-item">
      <FiGlobe />
      <span>skillspherebyesh.com</span>
    </div>

    <div className="lr-footer-separator" />

    <div className="lr-footer-item">
      <FiMail />
      <span>info@schoolflourishindex.in</span>
    </div>

    <div className="lr-footer-separator" />

    <div className="lr-footer-item">
      <FiPhone />
      <span>91-9779982140</span>
    </div>

  </div>

</footer>
      </div>
    </div>
  );
}
