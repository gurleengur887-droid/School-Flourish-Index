import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  ChevronDown,
  LogOut,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";

function AdminDashboard() {
  const navigate = useNavigate();

const [schools, setSchools] = useState([]);
const [responses, setResponses] = useState([]);
const [loading, setLoading] = useState(true);

const [selectedSchoolId, setSelectedSchoolId] = useState("all");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);

    const [schoolsResult, responsesResult] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name, city, state, country")
        .order("name", { ascending: true }),

      supabase
        .from("survey_responses")
        .select("id, school_id, role, submitted_at")
        .order("submitted_at", { ascending: false }),
    ]);

    if (schoolsResult.error) {
      console.error(
        "Error loading schools:",
        schoolsResult.error
      );
    }

    if (responsesResult.error) {
      console.error(
        "Error loading responses:",
        responsesResult.error
      );
    }

    setSchools(schoolsResult.data || []);
    setResponses(responsesResult.data || []);
    setLoading(false);
  }

  /* =====================================================
   FILTERED DATA
===================================================== */

const filteredResponses = useMemo(() => {
  if (selectedSchoolId === "all") {
    return responses;
  }

  return responses.filter(
    (response) =>
      response.school_id === selectedSchoolId
  );
}, [responses, selectedSchoolId]);


/* =====================================================
   OVERVIEW METRICS
===================================================== */

const totalResponses =
  filteredResponses.length;

const participatingSchoolIds = new Set(
  filteredResponses
    .map((response) => response.school_id)
    .filter(Boolean)
);

const schoolsWithResponses =
  participatingSchoolIds.size;

  /* =====================================================
     PERSPECTIVE COUNTS
  ===================================================== */

  const perspectiveData = useMemo(() => {
    const data = [
      {
        key: "parent",
        label: "Parent",
        description: "Family perspective",
        count: 0,
        icon: <Users size={18} />,
      },
      {
        key: "teacher",
        label: "Teacher",
        description: "Teaching perspective",
        count: 0,
        icon: <BriefcaseBusiness size={18} />,
      },
      {
        key: "student",
        label: "Student",
        description: "Student perspective",
        count: 0,
        icon: <GraduationCap size={18} />,
      },
      {
        key: "leader",
        label: "Leadership",
        description: "Leadership perspective",
        count: 0,
        icon: <UserRound size={18} />,
      },
    ];

   filteredResponses.forEach((response) => {
      const item = data.find(
        (entry) => entry.key === response.role
      );

      if (item) {
        item.count += 1;
      }
    });

    return data;
  }, [filteredResponses]);

  /* =====================================================
     SCHOOL ACTIVITY
  ===================================================== */

  const schoolActivity = useMemo(() => {
    const map = {};

   filteredResponses.forEach((response) => {
      if (!response.school_id) return;

      if (!map[response.school_id]) {
        map[response.school_id] = {
          school: schools.find(
            (school) =>
              school.id === response.school_id
          ),
          responses: 0,
          perspectives: new Set(),
          latest: response.submitted_at,
        };
      }

      map[response.school_id].responses += 1;

      if (response.role) {
        map[response.school_id].perspectives.add(
          response.role
        );
      }

      if (
        new Date(response.submitted_at) >
        new Date(
          map[response.school_id].latest
        )
      ) {
        map[response.school_id].latest =
          response.submitted_at;
      }
    });

    return Object.values(map)
      .filter((item) => item.school)
      .sort(
        (a, b) =>
          b.responses - a.responses
      )
      .slice(0, 6);
  }, [filteredResponses, schools]);

  /* =====================================================
     HELPERS
  ===================================================== */



  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-dashboard">
<SEO
  title="Admin Dashboard — School Flourish Index"
  description="School Flourish Index administration dashboard."
  url="/admin"
  noIndex
/>
      {/* =========================
          SIDEBAR
      ========================= */}

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

          <button className="admin-nav-item active">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href =
                "/admin/schools")
            }
          >
            <School size={18} />
            <span>Schools</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href =
                "/admin/responses")
            }
          >
            <ClipboardList size={18} />
            <span>Responses</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href =
                "/admin/results")
            }
          >
            <BarChart3 size={18} />
            <span>Results</span>
          </button>

          <div className="admin-nav-divider" />

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href =
                "/dashboard")
            }
          >
            <Eye size={18} />
            <span>Public Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href =
                "/admin/settings")
            }
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </nav>

        <div className="admin-sidebar-footer">

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>

          <div className="admin-sidebar-footer-meta">
            <span>SCHOOL FLOURISH INDEX</span>
            <small>Administration</small>
          </div>

        </div>

      </aside>


      {/* =========================
          MAIN
      ========================= */}

      <main className="admin-main">

        {/* Header */}

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Dashboard overview</h1>

            <p className="admin-header-description">
              A clear view of survey participation
              and school-wide data.
            </p>

          </div>

        <div className="admin-school-selector">

  <div>
    <span>Viewing</span>

    <select
      value={selectedSchoolId}
      onChange={(e) =>
        setSelectedSchoolId(e.target.value)
      }
    >
      <option value="all">
        All schools
      </option>

      {schools.map((school) => (
        <option
          key={school.id}
          value={school.id}
        >
          {school.name}
        </option>
      ))}
    </select>
  </div>

  <ChevronDown size={17} />

</div>

        </header>


        {/* =========================
            OVERVIEW
        ========================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                OVERVIEW
              </p>

              <h2>Survey participation</h2>
            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>


          {/* =========================
              STATS
          ========================= */}

          <div className="admin-stats">

            <div className="admin-stat">

              <span>Total responses</span>

              <strong>
                {loading
                  ? "—"
                  : totalResponses}
              </strong>

              <small>
                Across all perspectives
              </small>

            </div>


            <div className="admin-stat">

              <span>Schools</span>

              <strong>
                {loading
                  ? "—"
                  : schoolsWithResponses}
              </strong>

              <small>
                With survey activity
              </small>

            </div>


            <div className="admin-stat">

              <span>Perspectives</span>

              <strong>4</strong>

              <small>
                Parent · Teacher · Student · Leader
              </small>

            </div>

          </div>


          {/* =========================
              PERSPECTIVES
          ========================= */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  RESPONSE BREAKDOWN
                </span>

                <h3>Perspectives</h3>
              </div>

            </div>


            <div className="admin-perspectives">

              {perspectiveData.map(
                (item) => (
                  <div
                    className="admin-perspective-row"
                    key={item.key}
                  >

                    <div>

                      <span>
                        {item.label}
                      </span>

                      <small>
                        {item.description}
                      </small>

                    </div>

                    <strong>
                      {loading
                        ? "—"
                        : item.count}
                    </strong>

                  </div>
                )
              )}

            </div>

          </div>


          {/* =========================
              BOTTOM AREA
          ========================= */}

          <div className="admin-grid">

            {/* SCHOOL ACTIVITY */}

            <div className="admin-panel">

              <span className="admin-panel-label">
                SCHOOL ACTIVITY
              </span>

              <h3>
                School participation
              </h3>


              {loading ? (

                <div className="admin-empty-state">
                  <p>
                    Loading school activity...
                  </p>
                </div>

              ) : schoolActivity.length === 0 ? (

                <div className="admin-empty-state">

                  <School size={22} />

                  <p>
                    School response activity
                    will appear here automatically
                    as surveys are submitted.
                  </p>

                </div>

              ) : (

                <div className="admin-active-school-list">

                  {schoolActivity.map(
                    (item, index) => (

                      <button
                        className="admin-active-school-row"
                        key={
                          item.school.id
                        }
                        onClick={() =>
                          (window.location.href =
                            `/admin/schools/${item.school.id}`)
                        }
                      >

                        <span className="admin-active-school-rank">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>


                        <div className="admin-active-school-info">

                          <strong>
                            {item.school.name}
                          </strong>

                          <span>
                            {[
                              item.school.city,
                              item.school.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>

                        </div>


                        <div className="admin-active-school-count">

                          <strong>
                            {item.responses}
                          </strong>

                          <span>
                            responses
                          </span>

                        </div>


                        <span className="admin-active-school-perspectives">
                          {item.perspectives.size}/4
                        </span>

                        <ArrowUpRight
                          size={15}
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>


            {/* PUBLIC DASHBOARD */}

            <div className="admin-panel">

              <span className="admin-panel-label">
                PUBLIC VIEW
              </span>

              <h3>
                Public dashboard
              </h3>

              <div className="admin-public-status">

                <div className="status-dot" />

                <div>

                  <strong>
                    Ready to configure
                  </strong>

                  <p>
                    Choose which processed
                    information should be
                    visible publicly.
                  </p>

                </div>

              </div>

              <button
                className="admin-manage-button"
                onClick={() =>
                  (window.location.href =
                    "/dashboard")
                }
              >
                Manage public view
                <span>→</span>
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;