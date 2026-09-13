import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";
function AdminResults() {
  const [results, setResults] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedPerspective, setSelectedPerspective] =
    useState("all");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);

    const [resultsResult, schoolsResult] =
      await Promise.all([
        supabase
          .from("survey_results")
          .select(
            "id, school_id, response_id, role, processed_at, created_at, result_data"
          )
          .order("processed_at", {
            ascending: false,
          }),

        supabase
          .from("schools")
          .select(
            "id, name, city, state, country"
          )
          .order("name", {
            ascending: true,
          }),
      ]);

    if (resultsResult.error) {
      console.error(
        "Error loading results:",
        resultsResult.error
      );
    }

    if (schoolsResult.error) {
      console.error(
        "Error loading schools:",
        schoolsResult.error
      );
    }

    setResults(resultsResult.data || []);
    setSchools(schoolsResult.data || []);
    setLoading(false);
  }

  /* =====================================================
     COMBINE RESULT + SCHOOL DATA
  ===================================================== */

  const resultData = useMemo(() => {
    return results.map((result) => ({
      ...result,
      school: schools.find(
        (school) =>
          school.id === result.school_id
      ),
    }));
  }, [results, schools]);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const states = useMemo(() => {
    return [
      ...new Set(
        schools
          .map((school) => school.state)
          .filter(Boolean)
      ),
    ].sort();
  }, [schools]);

  const cities = useMemo(() => {
    const relevantSchools =
      selectedState === "all"
        ? schools
        : schools.filter(
            (school) =>
              school.state === selectedState
          );

    return [
      ...new Set(
        relevantSchools
          .map((school) => school.city)
          .filter(Boolean)
      ),
    ].sort();
  }, [schools, selectedState]);

  /* =====================================================
     FILTER RESULTS
  ===================================================== */

  const filteredResults = useMemo(() => {
    return resultData.filter((result) => {
      const matchesState =
        selectedState === "all" ||
        result.school?.state === selectedState;

      const matchesCity =
        selectedCity === "all" ||
        result.school?.city === selectedCity;

      const matchesPerspective =
        selectedPerspective === "all" ||
        result.role === selectedPerspective;

      return (
        matchesState &&
        matchesCity &&
        matchesPerspective
      );
    });
  }, [
    resultData,
    selectedState,
    selectedCity,
    selectedPerspective,
  ]);

  /* =====================================================
     OVERVIEW
  ===================================================== */

  const processedResults =
    filteredResults.length;

  const schoolsWithResults = new Set(
    filteredResults
      .map((result) => result.school_id)
      .filter(Boolean)
  ).size;

  const publishedResults = null;

  /* =====================================================
     PERSPECTIVES
  ===================================================== */

  const perspectiveData = useMemo(() => {
    const data = [
      {
        key: "parent",
        label: "Parent",
        description: "Family perspective",
        count: 0,
      },
      {
        key: "teacher",
        label: "Teacher",
        description: "Teaching perspective",
        count: 0,
      },
      {
        key: "student",
        label: "Student",
        description: "Student perspective",
        count: 0,
      },
      {
        key: "leader",
        label: "Leadership",
        description: "Leadership perspective",
        count: 0,
      },
    ];

    filteredResults.forEach((result) => {
      const item = data.find(
        (entry) =>
          entry.key === result.role
      );

      if (item) {
        item.count += 1;
      }
    });

    return data;
  }, [filteredResults]);

  const maxPerspective =
    Math.max(
      ...perspectiveData.map(
        (item) => item.count
      ),
      1
    );

  /* =====================================================
     SCHOOL RESULTS
  ===================================================== */

  const schoolResults = useMemo(() => {
    const map = {};

    filteredResults.forEach((result) => {
      if (!result.school_id) return;

      if (!map[result.school_id]) {
        map[result.school_id] = {
          school: result.school,
          results: 0,
          perspectives: new Set(),
          latest: result.processed_at,
        };
      }

      map[result.school_id].results += 1;

      if (result.role) {
        map[result.school_id].perspectives.add(
          result.role
        );
      }

      if (
        new Date(result.processed_at || result.created_at) >
        new Date(
          map[result.school_id].latest || 0
        )
      ) {
        map[result.school_id].latest =
          result.processed_at || result.created_at;
      }
    });

    return Object.values(map).sort(
      (a, b) =>
        b.results - a.results
    );
  }, [filteredResults]);

  /* =====================================================
     LATEST PROCESSED
  ===================================================== */

  const latestResults =
    filteredResults.slice(0, 6);

  /* =====================================================
     HELPERS
  ===================================================== */

  function formatPerspective(role) {
    if (role === "parent") return "Parent";
    if (role === "teacher") return "Teacher";
    if (role === "student") return "Student";
    if (role === "leader") return "Leadership";

    return "Unknown";
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatTime(date) {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function openSchool(schoolId) {
    if (!schoolId) return;

    window.location.href =
      `/admin/schools/${schoolId}`;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-dashboard">
<SEO
  title="Admin Results — School Flourish Index"
  description="View School Flourish Index assessment results and administration data."
  url="/admin/results"
  noIndex
/>
      {/* =================================================
          SIDEBAR
      ================================================= */}

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
              (window.location.href =
                "/admin")
            }
          >
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

          <button className="admin-nav-item active">
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
          <span>SCHOOL FLOURISH INDEX</span>
          <small>Administration</small>
        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Results</h1>

            <p className="admin-header-description">
              Review processed SFI results and
              school-level performance.
            </p>
          </div>


          <div className="admin-school-selector">

            <div className="admin-view-filter">

              <span>VIEWING</span>

              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(
                    e.target.value
                  );
                  setSelectedCity("all");
                }}
              >
                <option value="all">
                  All states
                </option>

                {states.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) =>
                  setSelectedCity(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All cities
                </option>

                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedPerspective}
                onChange={(e) =>
                  setSelectedPerspective(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All perspectives
                </option>

                <option value="parent">
                  Parent
                </option>

                <option value="teacher">
                  Teacher
                </option>

                <option value="student">
                  Student
                </option>

                <option value="leader">
                  Leadership
                </option>
              </select>

            </div>

          </div>

        </header>


        <section className="admin-section">

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                RESULTS OVERVIEW
              </p>

              <h2>
                Processed SFI results
              </h2>
            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>


          <div className="admin-stats admin-results-stats">

            <div className="admin-stat">
              <span>Processed results</span>

              <strong>
                {loading
                  ? "—"
                  : processedResults}
              </strong>

              <small>
                Results generated by processing
              </small>
            </div>


            <div className="admin-stat">
              <span>Schools with results</span>

              <strong>
                {loading
                  ? "—"
                  : schoolsWithResults}
              </strong>

              <small>
                Schools with processed data
              </small>
            </div>


            <div className="admin-stat">
              <span>Results ready</span>

              <strong>
                {loading
                  ? "—"
                  : processedResults}
              </strong>

              <small>
                Available for review
              </small>
            </div>


            <div className="admin-stat">
              <span>Public results</span>

             <strong>
  {publishedResults ?? "—"}
</strong>

              <small>
                Approved for public view
              </small>
            </div>

          </div>


          {/* =================================================
              SFI PERFORMANCE
          ================================================= */}

          <div className="admin-results-feature">

            <div className="admin-results-feature-copy">

              <span className="admin-panel-label">
                SFI PERFORMANCE
              </span>

              <h3>
                School Flourish Index
              </h3>

              <p>
                The overall SFI score and performance
                profile will appear here once the
                approved scoring methodology has been
                processed.
              </p>

              <div className="admin-results-status">

                <Clock3 size={17} />

                <div>
                  <strong>
                    Awaiting processed SFI data
                  </strong>

                  <span>
                    No score is being displayed until
                    the official methodology is applied.
                  </span>
                </div>

              </div>

            </div>


            <div className="admin-results-score-placeholder">

              <span>OVERALL SFI</span>

              <strong>—</strong>

              <small>
                Score not available yet
              </small>

            </div>

          </div>


          {/* =================================================
              DIMENSIONS
          ================================================= */}

          <div className="admin-panel admin-results-dimensions">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  SFI DIMENSIONS
                </span>

                <h3>
                  Dimension performance
                </h3>
              </div>

              <Target size={18} />

            </div>


            <div className="admin-results-empty">

              <Target size={25} />

              <strong>
                Dimension results will appear here
              </strong>

              <p>
                Once the SFI question-to-dimension
                mapping and scoring methodology are
                applied, performance across the
                approved dimensions will populate
                automatically.
              </p>

            </div>

          </div>


          {/* =================================================
              PERSPECTIVES + LATEST
          ================================================= */}

          <div className="admin-response-new-grid">

            {/* PERSPECTIVES */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    PERSPECTIVE RESULTS
                  </span>

                  <h3>
                    Processed by perspective
                  </h3>
                </div>

                <Users size={18} />

              </div>


              <div className="admin-perspective-analytics">

                {perspectiveData.map(
                  (item) => (

                    <div
                      className="admin-perspective-analytics-row"
                      key={item.key}
                    >

                      <div className="admin-perspective-analytics-info">

                        <strong>
                          {item.label}
                        </strong>

                        <span>
                          {item.description}
                        </span>

                      </div>


                      <div className="admin-perspective-analytics-bar-wrap">

                        <span
                          style={{
                            width: `${
                              (item.count /
                                maxPerspective) *
                              100
                            }%`,
                          }}
                        />

                      </div>


                      <strong className="admin-perspective-analytics-count">
                        {item.count}
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* LATEST PROCESSED */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    RECENT PROCESSING
                  </span>

                  <h3>
                    Latest results
                  </h3>
                </div>

                <TrendingUp size={18} />

              </div>


              {latestResults.length === 0 ? (

                <div className="admin-results-small-empty">

                  <BarChart3 size={22} />

                  <p>
                    No processed results are available
                    yet.
                  </p>

                </div>

              ) : (

                <div className="admin-results-latest-list">

                  {latestResults.map(
                    (result) => (

                      <button
                        className="admin-results-latest-row"
                        key={result.id}
                        onClick={() =>
                          openSchool(
                            result.school_id
                          )
                        }
                      >

                        <div className="admin-results-latest-icon">
                          <BarChart3
                            size={15}
                          />
                        </div>


                        <div className="admin-results-latest-info">

                          <strong>
                            {result.school?.name ||
                              "Unknown school"}
                          </strong>

                          <span>
                            {formatPerspective(
                              result.role
                            )}
                          </span>

                        </div>


                        <div className="admin-results-latest-date">

                          <strong>
                            {formatDate(
                              result.processed_at ||
                                result.created_at
                            )}
                          </strong>

                          <span>
                            {formatTime(
                              result.processed_at ||
                                result.created_at
                            )}
                          </span>

                        </div>

                        <ArrowUpRight
                          size={15}
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              SCHOOL RESULTS
          ================================================= */}

          <div className="admin-panel admin-results-school-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  SCHOOL RESULTS
                </span>

                <h3>
                  Results by school
                </h3>
              </div>

              <span className="admin-panel-meta">
                {schoolResults.length} schools
              </span>

            </div>


            {schoolResults.length === 0 ? (

              <div className="admin-results-empty">

                <School size={25} />

                <strong>
                  No school results yet
                </strong>

                <p>
                  Processed school-level results
                  will appear here automatically.
                </p>

              </div>

            ) : (

              <div className="admin-results-school-list">

                {schoolResults.map(
                  (item) => (

                    <button
                      className="admin-results-school-row"
                      key={item.school?.id}
                      onClick={() =>
                        openSchool(
                          item.school?.id
                        )
                      }
                    >

                      <div className="admin-results-school-name">

                        <School size={17} />

                        <div>
                          <strong>
                            {item.school?.name ||
                              "Unknown school"}
                          </strong>

                          <span>
                            {[
                              item.school?.city,
                              item.school?.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>

                      </div>


                      <div className="admin-results-school-count">

                        <strong>
                          {item.results}
                        </strong>

                        <span>
                          processed
                        </span>

                      </div>


                      <div className="admin-results-school-perspectives">

                        <span>
                          {item.perspectives.size}/4
                        </span>

                        <small>
                          perspectives
                        </small>

                      </div>


                      <div className="admin-results-school-status">
                        <CheckCircle2
                          size={15}
                        />
                        Ready
                      </div>


                      <ArrowUpRight
                        size={15}
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              INSIGHTS
          ================================================= */}

          <div className="admin-response-new-grid">

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    INSIGHTS
                  </span>

                  <h3>
                    Strengths & areas of attention
                  </h3>
                </div>

                <TrendingUp size={18} />

              </div>


              <div className="admin-results-insight-placeholder">

                <strong>
                  Insights will be generated from
                  processed SFI results.
                </strong>

                <p>
                  Strong areas and areas needing
                  attention will appear here once
                  the approved scoring and
                  interpretation methodology is
                  connected.
                </p>

              </div>

            </div>


            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    COMPARISON
                  </span>

                  <h3>
                    Trends & comparisons
                  </h3>
                </div>

                <TrendingUp size={18} />

              </div>


              <div className="admin-results-insight-placeholder">

                <strong>
                  Comparison data is not available yet.
                </strong>

                <p>
                  Trends, survey-period comparisons
                  and other comparisons will be shown
                  only where the SFI methodology supports
                  them.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminResults;