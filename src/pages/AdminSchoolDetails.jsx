import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  School,
  ClipboardList,
  Users,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";

function AdminSchoolDetails() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchoolDetails() {
      setLoading(true);

      const [schoolResult, responsesResult] =
        await Promise.all([
          supabase
            .from("schools")
            .select("id, name, city, state, country")
            .eq("id", schoolId)
            .single(),

          supabase
            .from("survey_responses")
            .select(
              "id, role, submitted_at, response_data"
            )
            .eq("school_id", schoolId)
            .order("submitted_at", {
              ascending: false,
            }),
        ]);

      if (schoolResult.error) {
        console.error(
          "Error loading school:",
          schoolResult.error
        );
      }

      if (responsesResult.error) {
        console.error(
          "Error loading responses:",
          responsesResult.error
        );
      }

      setSchool(schoolResult.data || null);
      setResponses(responsesResult.data || []);
      setLoading(false);
    }

    loadSchoolDetails();
  }, [schoolId]);

  const parentResponses = responses.filter(
    (response) => response.role === "parent"
  ).length;

  const teacherResponses = responses.filter(
    (response) => response.role === "teacher"
  ).length;

  const studentResponses = responses.filter(
    (response) => response.role === "student"
  ).length;

  const leaderResponses = responses.filter(
    (response) => response.role === "leader"
  ).length;

  const perspectivesCompleted = [
    parentResponses > 0,
    teacherResponses > 0,
    studentResponses > 0,
    leaderResponses > 0,
  ].filter(Boolean).length;

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getRoleLabel(role) {
    const labels = {
      parent: "Parent",
      teacher: "Teacher",
      student: "Student",
      leader: "Leadership",
    };

    return labels[role] || role;
  }

  function getRoleIcon(role) {
    if (role === "parent") {
      return <Users size={19} />;
    }

    if (role === "teacher") {
      return <BriefcaseBusiness size={19} />;
    }

    if (role === "student") {
      return <GraduationCap size={19} />;
    }

    if (role === "leader") {
      return <UserRound size={19} />;
    }

    return <ClipboardList size={19} />;
  }

  function openPerspective(role) {
    navigate(
      `/admin/schools/${schoolId}/perspective/${role}`
    );
  }

  function openResponse(responseId) {
    navigate(
      `/admin/schools/${schoolId}/response/${responseId}`
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <main className="admin-main admin-detail-loading">
          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>

          <h1>Loading school...</h1>
        </main>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="admin-dashboard">

        <main className="admin-main">
          <button
            className="admin-back-button"
            onClick={() =>
              navigate("/admin/schools")
            }
          >
            <ArrowLeft size={17} />
            Back to Schools
          </button>

          <div className="admin-empty-state">
            <School size={24} />

            <p>
              School could not be found.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
<SEO
  title="School Details — School Flourish Index"
  description="View School Flourish Index assessment and response details for a school."
  url="/admin/schools"
  noIndex
/>
      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-mark">
            S
          </div>

          <div>
            <span>School Flourish</span>
            <strong>INDEX</strong>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin")
            }
          >
            <span>Overview</span>
          </button>

          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate("/admin/schools")
            }
          >
            <School size={18} />
            <span>Schools</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/responses")
            }
          >
            <ClipboardList size={18} />
            <span>Responses</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/results")
            }
          >
            <span>Results</span>
          </button>

          <div className="admin-nav-divider" />

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>Public Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/settings")
            }
          >
            <span>Settings</span>
          </button>

        </nav>

        <div className="admin-sidebar-footer">
          <span>SCHOOL FLOURISH INDEX</span>
          <small>Administration</small>
        </div>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* BACK */}

        <button
          className="admin-back-button"
          onClick={() =>
            navigate("/admin/schools")
          }
        >
          <ArrowLeft size={17} />
          Back to Schools
        </button>

        {/* SCHOOL HEADER */}

        <header className="admin-school-detail-header">

          <div className="admin-school-detail-title">

            <div className="admin-school-detail-icon">
              <School size={28} />
            </div>

            <div>

              <p className="admin-eyebrow">
                SCHOOL PROFILE
              </p>

              <h1>{school.name}</h1>

              <p className="admin-header-description">
                {[
                  school.city,
                  school.state,
                  school.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

            </div>

          </div>

          <span className="admin-school-status active">
            Active
          </span>

        </header>

        {/* PARTICIPATION */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                PARTICIPATION
              </p>

              <h2>Survey activity</h2>
            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>

          {/* STATS */}

          <div className="admin-stats">

            <div className="admin-stat">
              <span>Total responses</span>

              <strong>
                {responses.length}
              </strong>

              <small>
                All perspectives
              </small>
            </div>

            <div className="admin-stat">
              <span>Perspectives</span>

              <strong>
                {perspectivesCompleted} / 4
              </strong>

              <small>
                Perspectives with responses
              </small>
            </div>

            <div className="admin-stat">
              <span>Latest response</span>

              <strong className="admin-date-stat">
                {responses.length
                  ? new Date(
                      responses[0].submitted_at
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )
                  : "—"}
              </strong>

              <small>
                Most recent submission
              </small>
            </div>

          </div>

          {/* PERSPECTIVE CARDS */}

          <div className="admin-detail-grid">

            <button
              type="button"
              className={`admin-detail-perspective admin-perspective-clickable ${
                parentResponses === 0
                  ? "is-empty"
                  : ""
              }`}
              onClick={() =>
                openPerspective("parent")
              }
            >

              <div className="admin-detail-perspective-icon">
                <Users size={19} />
              </div>

              <div>
                <span>Parent</span>
                <small>
                  Family perspective
                </small>
              </div>

              <strong>
                {parentResponses}
              </strong>

              <ArrowRight
                size={17}
                className="perspective-arrow"
              />

            </button>

            <button
              type="button"
              className={`admin-detail-perspective admin-perspective-clickable ${
                teacherResponses === 0
                  ? "is-empty"
                  : ""
              }`}
              onClick={() =>
                openPerspective("teacher")
              }
            >

              <div className="admin-detail-perspective-icon">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <span>Teacher</span>
                <small>
                  Teaching perspective
                </small>
              </div>

              <strong>
                {teacherResponses}
              </strong>

              <ArrowRight
                size={17}
                className="perspective-arrow"
              />

            </button>

            <button
              type="button"
              className={`admin-detail-perspective admin-perspective-clickable ${
                studentResponses === 0
                  ? "is-empty"
                  : ""
              }`}
              onClick={() =>
                openPerspective("student")
              }
            >

              <div className="admin-detail-perspective-icon">
                <GraduationCap size={19} />
              </div>

              <div>
                <span>Student</span>
                <small>
                  Student perspective
                </small>
              </div>

              <strong>
                {studentResponses}
              </strong>

              <ArrowRight
                size={17}
                className="perspective-arrow"
              />

            </button>

            <button
              type="button"
              className={`admin-detail-perspective admin-perspective-clickable ${
                leaderResponses === 0
                  ? "is-empty"
                  : ""
              }`}
              onClick={() =>
                openPerspective("leader")
              }
            >

              <div className="admin-detail-perspective-icon">
                <UserRound size={19} />
              </div>

              <div>
                <span>Leadership</span>
                <small>
                  Leadership perspective
                </small>
              </div>

              <strong>
                {leaderResponses}
              </strong>

              <ArrowRight
                size={17}
                className="perspective-arrow"
              />

            </button>

          </div>

        </section>

        {/* RECENT ACTIVITY */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                RECENT ACTIVITY
              </p>

              <h2>Latest submissions</h2>
            </div>

          </div>

          <div className="admin-panel">

            {responses.length === 0 ? (

              <div className="admin-empty-state">
                <ClipboardList size={22} />

                <p>
                  No survey responses have
                  been submitted for this
                  school yet.
                </p>
              </div>

            ) : (

              <div className="admin-response-list">

                {responses
                  .slice(0, 10)
                  .map((response) => (

                    <button
                      type="button"
                      className="admin-response-row admin-response-row-clickable"
                      key={response.id}
                      onClick={() =>
                        openResponse(
                          response.id
                        )
                      }
                    >

                      <div className="admin-response-role-icon">
                        {getRoleIcon(
                          response.role
                        )}
                      </div>

                      <div className="admin-response-info">

                        <strong>
                          {getRoleLabel(
                            response.role
                          )}
                        </strong>

                        <span>
                          Survey response submitted
                        </span>

                      </div>

                      <time>
                        {formatDate(
                          response.submitted_at
                        )}
                      </time>

                      <ArrowRight
                        size={17}
                        className="response-row-arrow"
                      />

                    </button>

                  ))}

              </div>

            )}

          </div>

        </section>

        {/* RESULTS PLACEHOLDER */}

        <section className="admin-section">

          <div className="admin-panel admin-results-placeholder">

            <p className="admin-eyebrow">
              RESULTS
            </p>

            <h3>
              Flourishing results will appear
              here
            </h3>

            <p>
              Once the SFI scoring methodology
              is finalized, processed school
              results, dimensions and insights
              will appear in this section.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminSchoolDetails;