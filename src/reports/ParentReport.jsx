import React, { useEffect, useRef, useState } from "react";
import "./ParentReport.css";
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
    <div className="pr-logo-area">
      <img
        src="/logo.png"
        alt="School Flourish Index"
        className="pr-logo-image"
      />
    </div>
  );
}
function PeopleIcon() {
  return (
    <svg viewBox="0 0 100 80" className="pr-people-icon" aria-hidden="true">
      <circle cx="50" cy="22" r="14" fill="currentColor" />
      <circle cx="23" cy="29" r="10" fill="currentColor" />
      <circle cx="77" cy="29" r="10" fill="currentColor" />
      <path d="M25 70c0-17 11-27 25-27s25 10 25 27" fill="currentColor" />
      <path d="M4 70c0-13 8-21 19-21 7 0 13 3 17 9-8 4-13 11-14 20H4z" fill="currentColor" />
      <path d="M96 70c0-13-8-21-19-21-7 0-13 3-17 9 8 4 13 11 14 20h22z" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 100 100" className="pr-summary-icon pr-star" aria-hidden="true">
      <path d="M50 5l12 30 33 2-25 21 8 32-28-18-28 18 8-32L5 37l33-2z" fill="currentColor" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 100 100" className="pr-summary-icon pr-target" aria-hidden="true">
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="9" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <path d="M61 39l25-25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M78 14h10v10" fill="none" stroke="currentColor" strokeWidth="7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 100 100" className="pr-search-icon" aria-hidden="true">
      <circle cx="42" cy="42" r="25" fill="none" stroke="currentColor" strokeWidth="7" />
      <path d="M60 60l22 22" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   HEADER / FOOTER DECORATION
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
  return typeof parameter?.average === "number" && Number.isFinite(parameter.average)
    ? parameter.average
    : null;
}

function getPerformanceFromScore(score) {
  if (typeof score !== "number" || !Number.isFinite(score)) return "";
  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.8) return "Very Good";
  if (score >= 3.0) return "Good";
  if (score >= 2.0) return "Needs Attention";
  return "Critical";
}

function getPerformance(parameter) {
  if (parameter?.performance && parameter.performance !== "—") {
    return parameter.performance;
  }
  return getPerformanceFromScore(getScore(parameter));
}

function getPerformanceClass(performance) {
  if (performance === "Outstanding" || performance === "Excellent") return "excellent";
  if (performance === "Very Good" || performance === "Good") return "good";
  if (performance === "Needs Attention") return "attention";
  if (performance === "Critical") return "critical";
  return "";
}

function getObservationText(report) {
  if (Array.isArray(report?.observations) && report.observations.length) {
    return report.observations.slice(0, 4);
  }

  return [
    "Parent responses provide a snapshot of school experience and partnership.",
    "Review the dimension scores alongside the response context.",
    typeof report?.overallScore === "number"
      ? `Overall weighted Parent Voice index: ${report.overallScore.toFixed(2)}/100.`
      : "Overall weighted Parent Voice index is unavailable.",
    "Use qualitative parent responses to add context where available.",
  ];
}

/* =========================================================
   MAIN PARENT REPORT
========================================================= */

export default function ParentReport({ report }) {
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

  if (!report) return null;

  const parameters = Array.isArray(report.parameters)
    ? report.parameters
    : Array.isArray(report.dimensions)
      ? report.dimensions
      : [];

  const strengths = Array.isArray(report.strengths) ? report.strengths : [];
  const focusAreas = Array.isArray(report.focusAreas) ? report.focusAreas : [];

  const school = report.respondent?.school || "School";
  const parentName = report.respondent?.name || "Parent";
  const respondents = typeof report.respondents === "number" ? report.respondents : 1;
  const generatedDate = report.submission?.date || report.generatedDate || new Date();
  const observations = getObservationText(report);

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
  ];

  return (
   <div
  className="parent-report-wrapper"
  ref={wrapperRef}
  style={{
    width: `${1055 * reportScale}px`,
    height: `${1491 * reportScale}px`,
  }}
>
  <div
    className="parent-report"
    style={{
      transform: `scale(${reportScale})`,
      transformOrigin: "top left",
    }}
  >
        <section className="pr-header">
          <div className="pr-header-watercolor" />

          <LogoPlaceholder />

          <div className="pr-header-divider" />

          <div className="pr-title-block">
            <h1>
              <span>SFI PARENT VOICE</span>
              <span>REPORT</span>
            </h1>

            <div className="pr-subtitle">SURVEY INSIGHTS SNAPSHOT</div>

            <p>Partnering for Happier Children. Stronger Schools.</p>
          </div>

          
        </section>

        <section className="pr-info">
          <div className="pr-info-field pr-school-field">
            <span className="pr-info-label">School:</span>
            <strong>{school}</strong>
            <div className="pr-info-line" />
          </div>

          <div className="pr-info-field pr-parent-field">
            <span className="pr-info-label">Parent Name:</span>
            <strong>{parentName}</strong>
            <div className="pr-info-line" />
          </div>

          <div className="pr-info-field pr-date-field">
            <span className="pr-info-label">Date:</span>
            <strong>{formatDate(generatedDate)}</strong>
            <div className="pr-info-line" />
          </div>
        </section>

        <section className="pr-summary">
          <div className="pr-summary-card pr-respondents-card">
            <PeopleIcon />
            <div className="pr-summary-content">
              <h3>PARENTS<br />RESPONDED</h3>
              <div className="pr-summary-number">{respondents}</div>
              <em>(if applicable)</em>
            </div>
          </div>

          <div className="pr-summary-card pr-strength-card">
            <StarIcon />
            <div className="pr-summary-content">
              <h3>STRENGTH AREAS</h3>
              <div className="pr-summary-number">{strengths.length}</div>
              <em>(scoring ≥ 4.0)</em>
            </div>
          </div>

          <div className="pr-summary-card pr-focus-card">
            <TargetIcon />
            <div className="pr-summary-content">
              <h3>FOCUS AREAS</h3>
              <div className="pr-summary-number">{focusAreas.length}</div>
              <em>(scoring &lt; 3.8)</em>
            </div>
          </div>
        </section>

        <section className="pr-main">
          <div className="pr-panel pr-dimension-panel">
            <div className="pr-panel-title">SFI PARENT DIMENSION ANALYSIS</div>

            <div className="pr-table-header">
              <div>#</div>
              <div>Parent Dimension</div>
              <div>Score<br />(out of 5)</div>
              <div>Performance</div>
            </div>

            <div className="pr-dimension-list">
              {parameters.map((parameter, index) => {
                const score = getScore(parameter);
                const performance = getPerformance(parameter);
                const performanceClass = getPerformanceClass(performance);

                return (
                  <div
                    className="pr-dimension-row"
                    key={parameter.key || parameter.name || index}
                  >
                    <div className="pr-dimension-index">{index + 1}</div>

                    <div className="pr-dimension-name">
                      {parameter.name}
                    </div>

                    <div className="pr-dimension-score">
                      {score !== null ? score.toFixed(2) : ""}
                      <span className="pr-score-line" />
                    </div>

                    <div className="pr-performance-cell">
                      <span className={`pr-performance ${performanceClass}`}>
                        {performance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pr-right-column">
            <div className="pr-panel pr-chart-panel">
              <div className="pr-panel-title">SCORE DISTRIBUTION BY DIMENSION</div>

              <div className="pr-chart">
                {parameters.map((parameter, index) => {
                  const score = getScore(parameter);
                  const width =
                    score === null
                      ? 0
                      : Math.max(0, Math.min(100, (score / 5) * 100));
                  const name = String(parameter.name || "");

                  return (
                    <div
                      className="pr-chart-row"
                      key={`chart-${parameter.key || parameter.name || index}`}
                    >
                      <div className="pr-chart-label">{name}</div>

                      <div className="pr-chart-bar-wrap">
                        <div className="pr-bar-track">
                          <span
                            className="pr-bar-fill"
                            style={{
                              width: `${width}%`,
                              background: barColors[index % barColors.length],
                            }}
                          />
                        </div>

                        <div className="pr-chart-score">
                          {score !== null ? score.toFixed(2) : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pr-chart-axis">
                  {[1, 2, 3, 4, 5].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pr-panel pr-observations-panel">
              <div className="pr-panel-title">KEY OBSERVATIONS</div>

              <div className="pr-observations-body">
                <div className="pr-observation-icon-wrap">
                  <SearchIcon />
                </div>

                <div className="pr-observation-list">
                  {observations.map((observation, index) => (
                    <div className="pr-observation-item" key={`${index}-${observation}`}>
                      <span className="pr-observation-dot" />
                      <span className="pr-observation-line">{observation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

       <footer className="pr-footer">

  <div className="pr-footer-contact">

    <div className="pr-footer-item">
      <FiGlobe />
      <span>schoolflourishindex.in</span>
    </div>

    <div className="pr-footer-separator" />

    <div className="pr-footer-item">
      <FiGlobe />
      <span>skillspherebyesh.com</span>
    </div>

    <div className="pr-footer-separator" />

    <div className="pr-footer-item">
      <FiMail />
      <span>info@schoolflourishindex.in</span>
    </div>

    <div className="pr-footer-separator" />

    <div className="pr-footer-item">
      <FiPhone />
      <span>91-9779982140</span>
    </div>

  </div>

</footer>
      </div>
    </div>
  );
}
