import React, { useRef, useState } from "react";

import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  FileText,
  Search,
  X,
  Download,
  ArrowLeft,
  Inbox,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { generateReportByEmail } from "../reports/reportService";
import TeacherReport from "../reports/TeacherReport";
import StudentReport from "../reports/StudentReport";
import ParentReport from "../reports/ParentReport";
import LeaderReport from "../reports/LeaderReport";
import "../styles/admin_dashboard.css";
import "../styles/admin_report.fixed.css";

import SEO from "../components/SEO";

import html2pdf from "html2pdf.js";


function normalizeReportRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}
function getReportComponent(role) {
  const normalizedRole = normalizeReportRole(role);

  const reportComponents = {
    teacher: TeacherReport,
    parent: ParentReport,
    student: StudentReport,
    leader: LeaderReport,
  };

  const ReportComponent =
    reportComponents[normalizedRole];

  if (!ReportComponent) {
    throw new Error(
      `Unsupported report role: ${role}`
    );
  }

  return ReportComponent;
}

function getReportLabel(role) {
  const normalizedRole = normalizeReportRole(role);

  const labels = {
    teacher: "TEACHER REPORT",
    parent: "PARENT VOICE REPORT",
    student: "STUDENT REPORT",
    leader: "LEADER VOICE REPORT",
  };

  const label = labels[normalizedRole];

  if (!label) {
    throw new Error(
      `Unsupported report role: ${role}`
    );
  }

  return label;
}
function getReportFileSuffix(role) {
  const normalizedRole = normalizeReportRole(role);

  const suffixes = {
    teacher: "Teacher_Flourishing_Report",
    parent: "Parent_Voice_Report",
    student: "Student_Voice_Report",
    leader: "Leader_Voice_Report",
  };

  const suffix = suffixes[normalizedRole];

  if (!suffix) {
    throw new Error(
      `Unsupported report role: ${role}`
    );
  }

  return suffix;
}
function AdminReports() {
  const navigate = useNavigate();

  const reportRef = useRef(null);
const [email, setEmail] = useState("");
const [perspective, setPerspective] = useState("");
const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");
  const [reportResult, setReportResult] = useState(null);

  const [showReport, setShowReport] = useState(false);


  /* =========================================================
     GENERATE REPORT
  ========================================================= */

const handleGenerateReport = async (e) => {
  e.preventDefault();

  setError("");
  setReportResult(null);
  setShowReport(false);

  const trimmedEmail =
    email.trim();

  const selectedPerspective =
    perspective.trim().toLowerCase();


  /*
   * =========================================================
   * VALIDATE EMAIL
   * =========================================================
   */

  if (!trimmedEmail) {
    setError(
      "Please enter a respondent email address."
    );
    return;
  }


  /*
   * =========================================================
   * VALIDATE PERSPECTIVE
   * =========================================================
   */

  if (!selectedPerspective) {
    setError(
      "Please select a perspective."
    );
    return;
  }


  setLoading(true);


  try {
    const result =
      await generateReportByEmail(
        trimmedEmail,
        selectedPerspective
      );

if (result?.role !== selectedPerspective) {
  throw new Error(
    `Role mismatch. Requested "${selectedPerspective}" but received "${result?.role}".`
  );
}
    console.log(
      "REPORT RESULT FROM ADMIN PAGE:",
      result
    );


    setReportResult(result);


  } catch (err) {
    console.error(
      "REPORT GENERATION ERROR:",
      err
    );


    setError(
      err?.message ||
        "Something went wrong while generating the report."
    );


  } finally {
    setLoading(false);
  }
};


  /* =========================================================
     REPORT DATA
  ========================================================= */

  const report = reportResult?.report;


  /* =========================================================
     OPEN REPORT
  ========================================================= */

  const handleViewReport = () => {
    if (!report) {
      setError(
        "Please generate a report before viewing it."
      );

      return;
    }

    setError("");
    setShowReport(true);
  };


  /* =========================================================
     CLOSE REPORT
  ========================================================= */

  const handleCloseReport = () => {
    setShowReport(false);
  };


  /* =========================================================
     DOWNLOAD PDF
  ========================================================= */

  const handleDownloadReport = async () => {
    if (!report) {
      setError(
        "Please generate the report before downloading it."
      );

      return;
    }

    setDownloading(true);
    setError("");

    try {
      const role = normalizeReportRole(
        reportResult?.role || report?.role
      );

     const respondentName =
  report.respondent?.name ||
  (
    role === "student"
      ? "Student"
      : role === "parent"
        ? "Parent"
        : role === "leader"
          ? "Leader"
          : "Teacher"
  );

      const safeName =
        respondentName
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_");

      const fileName =
        `${safeName}_${getReportFileSuffix(role)}.pdf`;


      /*
       * Make sure the report is visible before
       * html2pdf captures it.
       */

      const wasHidden =
        !showReport;

      if (wasHidden) {
        setShowReport(true);

        /*
         * Give React a moment to render
         * the report before capturing it.
         */

        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );
      }

      const element = reportRef.current;

      if (!element) {
        throw new Error("Report viewer did not finish rendering.");
      }

      /*
       * html2pdf must capture the original A4-sized report,
       * not the responsive/mobile version used by the viewer.
       */
      element.classList.add("pdf-export-mode");

      /* Let the forced export dimensions apply before capture. */
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const options = {
        margin: 0,

        filename: fileName,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: 1055,
          height: 1491,
          windowWidth: 1055,
          windowHeight: 1491,
          scrollX: 0,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      try {
        await html2pdf()
          .set(options)
          .from(element)
          .save();
      } finally {
        element.classList.remove("pdf-export-mode");
      }

    } catch (err) {
      console.error(
        "PDF DOWNLOAD ERROR:",
        err
      );

      setError(
        "Unable to download the report PDF. Please try again."
      );

    } finally {
      setDownloading(false);
    }
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-dashboard admin-reports-page">

      <SEO
        title="Insights & Reports — School Flourish Index"
        description="Generate individual School Flourish Index reports."
        url="/admin/reports"
        noIndex
      />


      {/* =====================================================
          ADMIN SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-mark">
            S
          </div>

          <div>
            <strong>
              SCHOOL FLOURISH
            </strong>

            <span>
              INDEX
            </span>
          </div>

        </div>


        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin")
            }
          >
            <LayoutDashboard size={18} />

            <span>
              Overview
            </span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/schools")
            }
          >
            <School size={18} />

            <span>
              Schools
            </span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/responses")
            }
          >
            <ClipboardList size={18} />

            <span>
              Responses
            </span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/results")
            }
          >
            <BarChart3 size={18} />

            <span>
              Results
            </span>
          </button>


          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate("/admin/reports")
            }
          >
            <FileText size={18} />

            <span>
              Insights / Reports
            </span>
          </button>

<button
  className="admin-nav-item"
  onClick={() =>
    navigate("/admin/requested-insights")
  }
>
  <Inbox size={18} />

  <span>
    Requested Insights
  </span>
</button>
          <div className="admin-nav-divider" />


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <Eye size={18} />

            <span>
              Public Dashboard
            </span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/settings")
            }
          >
            <Settings size={18} />

            <span>
              Settings
            </span>
          </button>

        </nav>


        <div className="admin-sidebar-footer">
          <span>
            SCHOOL FLOURISH INDEX
          </span>

          <small>
            Administration
          </small>
        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main admin-reports-main">

        {/* HEADER */}

        <header className="reports-hero">

          <div className="reports-hero-copy">

            <div className="reports-kicker">
              INSIGHTS & REPORTS
            </div>

            <h1>
              Individual reports
            </h1>

            <p>
              Turn a respondent's survey response
              into their complete School Flourish
              Index report.
            </p>

          </div>

          <div className="reports-hero-icon">
            <FileText size={30} />
          </div>

        </header>


        {/* =================================================
            REPORT GENERATOR
        ================================================= */}

        <section className="report-generator-card">

          <div className="generator-top">

            <div>

              <div className="generator-label">
                REPORT GENERATOR
              </div>

              <h2>
                Find a respondent
              </h2>

              <p>
                Enter the email used to complete
                the survey.
              </p>

            </div>

            <div className="generator-number">
              01
            </div>

          </div>


          <form
            onSubmit={handleGenerateReport}
            className="report-search-form"
          >

            <div className="report-input-wrapper">

              <label htmlFor="respondent-email">
                Respondent email
              </label>

              <div className="report-input-box">

                <Search size={19} />

                <input
                  id="respondent-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="e.g. teacher@example.com"
                  autoComplete="email"
                />

              </div>

            </div>

<div className="report-input-wrapper">

  <label htmlFor="respondent-perspective">
    Perspective
  </label>

  <div className="report-input-box report-select-box">

    <select
      id="respondent-perspective"
      value={perspective}
      onChange={(e) =>
        setPerspective(e.target.value)
      }
      required
    >
      <option value="">
        Select perspective
      </option>

      <option value="teacher">
        Teacher
      </option>

      <option value="parent">
        Parent
      </option>

      <option value="student">
        Student
      </option>

      <option value="leader">
        Leader
      </option>
    </select>

  </div>

</div>
            <button
              type="submit"
              className="generate-report-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="report-spinner" />
                  Generating...
                </>
              ) : (
                <>
                  Generate report
                  <ArrowLeft
                    size={17}
                    className="generate-arrow"
                  />
                </>
              )}

            </button>

          </form>


          {error && (
            <div className="report-error">
              {error}
            </div>
          )}

        </section>


        {/* =================================================
            GENERATED RESULT
        ================================================= */}

        {reportResult && report && (

          <section className="generated-report-card">

            <div className="generated-header">

              <div>

                <span className="generated-label">
                  REPORT READY
                </span>

                <h2>
                  {report.respondent?.name ||
                    "Respondent"}
                </h2>

                <p>
                  {report.respondent?.school ||
                    "School unavailable"}
                </p>

              </div>


              <div className="generated-actions">

                <button
                  type="button"
                  className="view-report-button"
                  onClick={handleViewReport}
                >
                  <Eye size={17} />
                  View report
                </button>


                <button
                  type="button"
                  className="download-report-button"
                  onClick={handleDownloadReport}
                  disabled={downloading}
                >

                  <Download size={17} />

                  {downloading
                    ? "Preparing PDF..."
                    : "Download PDF"}

                </button>

              </div>

            </div>


            <div className="generated-details">

              <div className="detail-item">

                <span>
                  Role
                </span>

                <strong>
                  {reportResult.role ||
                    "Unknown"}
                </strong>

              </div>


              <div className="detail-item">

                <span>
                  Email
                </span>

                <strong>
                  {report.respondent?.email ||
                    email}
                </strong>

              </div>


              <div className="detail-item">

                <span>
  {normalizeReportRole(reportResult.role) === "teacher"
    ? "THFI"
    : "SFI Score"}
</span>

<strong className="detail-score">
  {normalizeReportRole(reportResult.role) === "teacher"
    ? typeof report.thfi === "number"
      ? report.thfi.toFixed(2)
      : "—"
    : typeof report.overallScore === "number"
      ? report.overallScore.toFixed(2)
      : "—"}
</strong>
              </div>


              <div className="detail-item">

                <span>
                  Rating
                </span>

                <strong>
                  {report.rating || "—"}
                </strong>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            SMALL DATA SUMMARY
        ================================================= */}

        {reportResult?.role === "teacher" &&
          Array.isArray(report?.parameters) &&
          report.parameters.length > 0 && (

            <section className="parameter-summary">

              <div className="parameter-summary-header">

                <div>
                  <span>
                    CALCULATED DATA
                  </span>

                  <h2>
                    Teacher parameters
                  </h2>
                </div>

                <div className="parameter-count">
                  {report.parameters.length}
                  {" "}parameters
                </div>

              </div>


              <div className="parameter-table-wrapper">

                <table className="parameter-table">

                  <thead>

                    <tr>
                      <th>
                        Parameter
                      </th>

                      <th>
                        Average
                      </th>

                      <th>
                        Weighted score
                      </th>
                    </tr>

                  </thead>


                  <tbody>

                    {report.parameters.map(
                      (parameter) => (

                        <tr
                          key={
                            parameter.name
                          }
                        >

                          <td>
                            {parameter.name}
                          </td>

                          <td>
                            {Number(
                              parameter.average
                            ).toFixed(2)}
                          </td>

                          <td>
                            {Number(
                              parameter.weightedScore
                            ).toFixed(2)}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </section>

          )}

      </main>


      {/* =====================================================
          FULL REPORT VIEWER
      ===================================================== */}

      {showReport &&
        report && (

          <div
            className="report-viewer-overlay"
            onMouseDown={(e) => {

              if (
                e.target === e.currentTarget
              ) {
                handleCloseReport();
              }

            }}
          >

            <div className="report-viewer">

              <div className="report-viewer-toolbar">

                <div>

                  <span>
                    {getReportLabel(reportResult?.role)}
                  </span>

                  <strong>
                    {report.respondent?.name ||
                      "Respondent"}
                  </strong>

                </div>


                <div className="report-viewer-actions">

                  <button
                    type="button"
                    onClick={
                      handleDownloadReport
                    }
                    disabled={downloading}
                    className="viewer-download"
                  >
                    <Download size={17} />

                    {downloading
                      ? "Preparing..."
                      : "Download PDF"}
                  </button>


                  <button
                    type="button"
                    onClick={
                      handleCloseReport
                    }
                    className="viewer-close"
                    aria-label="Close report"
                  >
                    <X size={20} />
                  </button>

                </div>

              </div>


              <div className="report-viewer-body">

                <div
                  ref={reportRef}
                  className="report-pdf-container"
                >

                  {React.createElement(
                    getReportComponent(reportResult?.role),
                    { report }
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}


export default AdminReports;