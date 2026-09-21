import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  TrendingUp,
  Users,
  Clock3,
  ArrowUpRight,
  Target,
  Search,
  RefreshCw,
    FileText,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { calculateSchoolResult } from "../reports/schoolResultsCalculator";

import "../styles/admin_dashboard.css";
import "../styles/admin_results.css";
import SEO from "../components/SEO";

/*
 * =========================================================
 * ADMIN RESULTS
 * =========================================================
 *
 * Flow:
 *
 * Filters
 *   ↓
 * School search / school list
 *   ↓
 * Select one school
 *   ↓
 * Use all currently matching survey responses for that school
 *   ↓
 * Calculate the seven school-facing dimensions
 *   ↓
 * Display the school's live profile
 *
 * The live school profile is calculated directly from
 * survey_responses so new responses immediately affect the
 * Admin Results view.
 * =========================================================
 */

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

function AdminResults() {
  const [responses, setResponses] = useState([]);
  const [schools, setSchools] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedState, setSelectedState] =
    useState("all");

  const [selectedCity, setSelectedCity] =
    useState("all");

  const [selectedPerspective, setSelectedPerspective] =
    useState("all");

  const [schoolSearch, setSchoolSearch] =
    useState("");

  const [selectedSchoolId, setSelectedSchoolId] =
    useState(null);


  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    setError("");

    const [
      responsesResult,
      schoolsResult,
    ] = await Promise.all([
      supabase
        .from("survey_responses")
        .select(
          "id, school_id, role, submitted_at, created_at, response_data"
        )
        .order("submitted_at", {
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

    if (responsesResult.error) {
      console.error(
        "Error loading survey responses:",
        responsesResult.error
      );

      setError(
        "Unable to load survey responses. Please try again."
      );
    }

    if (schoolsResult.error) {
      console.error(
        "Error loading schools:",
        schoolsResult.error
      );

      setError(
        "Unable to load schools. Please try again."
      );
    }

    setResponses(
      responsesResult.data || []
    );

    setSchools(
      schoolsResult.data || []
    );

    setLoading(false);
  }


  /* =======================================================
     SCHOOL + RESPONSE DATA
  ======================================================= */

  const schoolMap = useMemo(() => {
    return new Map(
      schools.map((school) => [
        school.id,
        school,
      ])
    );
  }, [schools]);


  const responseData = useMemo(() => {
    return responses.map(
      (response) => ({
        ...response,

        school:
          schoolMap.get(
            response.school_id
          ) || null,
      })
    );
  }, [responses, schoolMap]);


  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const states = useMemo(() => {
    return [
      ...new Set(
        schools
          .map(
            (school) =>
              school.state
          )
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
              school.state ===
              selectedState
          );

    return [
      ...new Set(
        relevantSchools
          .map(
            (school) =>
              school.city
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [
    schools,
    selectedState,
  ]);


  /* =======================================================
     LIVE RESPONSE FILTER
  ======================================================= */

  const filteredResponses =
    useMemo(() => {
      return responseData.filter(
        (response) => {

          const matchesState =
            selectedState === "all" ||
            response.school?.state ===
              selectedState;

          const matchesCity =
            selectedCity === "all" ||
            response.school?.city ===
              selectedCity;

          const matchesPerspective =
            selectedPerspective === "all" ||
            normalizeRole(
              response.role
            ) ===
              selectedPerspective;

          return (
            matchesState &&
            matchesCity &&
            matchesPerspective
          );
        }
      );
    }, [
      responseData,
      selectedState,
      selectedCity,
      selectedPerspective,
    ]);


  /* =======================================================
     SCHOOL PROFILES
  ======================================================= */

  const liveSchoolProfiles =
    useMemo(() => {

      /*
       * Build the profile list from the schools table first,
       * then attach the currently filtered responses.
       *
       * This means schools with zero responses still appear in
       * Admin Results and can be selected; their seven dimensions
       * simply show as unavailable until responses exist.
       */
      const eligibleSchools = schools.filter(
        (school) => {
          const matchesState =
            selectedState === "all" ||
            school.state === selectedState;

          const matchesCity =
            selectedCity === "all" ||
            school.city === selectedCity;

          return (
            matchesState &&
            matchesCity
          );
        }
      );

      const responsesBySchool = new Map();

      filteredResponses.forEach((response) => {
        if (!response.school_id) {
          return;
        }

        if (
          !responsesBySchool.has(
            response.school_id
          )
        ) {
          responsesBySchool.set(
            response.school_id,
            []
          );
        }

        responsesBySchool
          .get(response.school_id)
          .push(response);
      });

      return eligibleSchools
        .map((school) => {
          const schoolResponses =
            responsesBySchool.get(
              school.id
            ) || [];

          const calculated =
            calculateSchoolResult(
              schoolResponses
            );

          return {
            school,

            responseCount:
              schoolResponses.length,

            perspectives:
              [
                ...new Set(
                  schoolResponses
                    .map((response) =>
                      normalizeRole(
                        response.role
                      )
                    )
                    .filter(Boolean)
                ),
              ],

            dimensions:
              calculated.dimensions,

            availableDimensionCount:
              calculated.availableDimensionCount,

            totalDimensionCount:
              calculated.totalDimensionCount,

            overallScore:
              calculated.overallScore,
          };
        })
        .sort(
          (a, b) =>
            String(
              a.school?.name || ""
            ).localeCompare(
              String(
                b.school?.name || ""
              )
            )
        );

    }, [
      schools,
      filteredResponses,
      selectedState,
      selectedCity,
    ]);


  /* =======================================================
     SEARCH SCHOOL LIST
  ======================================================= */

  const visibleSchoolProfiles =
    useMemo(() => {

      const query =
        schoolSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return liveSchoolProfiles;
      }

      return liveSchoolProfiles.filter(
        (item) => {

          const school =
            item.school;

          const haystack = [
            school?.name,
            school?.city,
            school?.state,
            school?.country,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return haystack.includes(
            query
          );
        }
      );

    }, [
      liveSchoolProfiles,
      schoolSearch,
    ]);


  /* =======================================================
     SELECTED SCHOOL
  ======================================================= */

  useEffect(() => {

    if (!visibleSchoolProfiles.length) {
      setSelectedSchoolId(null);
      return;
    }

    const stillExists =
      visibleSchoolProfiles.some(
        (item) =>
          item.school?.id ===
          selectedSchoolId
      );

    if (!stillExists) {
      setSelectedSchoolId(
        visibleSchoolProfiles[0].school.id
      );
    }

  }, [
    visibleSchoolProfiles,
    selectedSchoolId,
  ]);


  const selectedSchoolProfile =
    liveSchoolProfiles.find(
      (item) =>
        item.school?.id ===
        selectedSchoolId
    ) || null;


  /* =======================================================
     OVERVIEW
  ======================================================= */

  const liveResponsesCount =
    filteredResponses.length;

  const schoolsWithLiveResults =
    liveSchoolProfiles.filter(
      (item) => item.responseCount > 0
    ).length;


  /* =======================================================
     PERSPECTIVES
  ======================================================= */

  const perspectiveData =
    useMemo(() => {

      const data = [
        {
          key: "parent",
          label: "Parent",
          description:
            "Family perspective",
          count: 0,
        },
        {
          key: "teacher",
          label: "Teacher",
          description:
            "Teaching perspective",
          count: 0,
        },
        {
          key: "student",
          label: "Student",
          description:
            "Student perspective",
          count: 0,
        },
        {
          key: "leader",
          label: "Leadership",
          description:
            "Leadership perspective",
          count: 0,
        },
      ];


      filteredResponses.forEach(
        (response) => {

          const item =
            data.find(
              (entry) =>
                entry.key ===
                normalizeRole(
                  response.role
                )
            );

          if (item) {
            item.count += 1;
          }
        }
      );


      return data;

    }, [
      filteredResponses,
    ]);


  const maxPerspective =
    Math.max(
      ...perspectiveData.map(
        (item) => item.count
      ),
      1
    );


  /* =======================================================
     HELPERS
  ======================================================= */

  function formatPerspective(role) {
    const normalized =
      normalizeRole(role);

    if (normalized === "parent") {
      return "Parent";
    }

    if (normalized === "teacher") {
      return "Teacher";
    }

    if (normalized === "student") {
      return "Student";
    }

    if (normalized === "leader") {
      return "Leadership";
    }

    return "Unknown";
  }


  function openSchool(
    schoolId
  ) {
    if (!schoolId) {
      return;
    }

    window.location.href =
      `/admin/schools/${schoolId}`;
  }


  function selectSchool(
    schoolId
  ) {
    setSelectedSchoolId(
      schoolId
    );

    window.requestAnimationFrame(
      () => {
        const profile =
          document.getElementById(
            "selected-school-profile"
          );

        if (profile) {
          profile.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-dashboard">

      <SEO
        title="Admin Results — School Flourish Index"
        description="View school-level School Flourish Index results."
        url="/admin/results"
        noIndex
      />


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-mark">
            S
          </div>

          <div>
            <span>
              School Flourish
            </span>

            <strong>
              INDEX
            </strong>
          </div>

        </div>


        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() =>
              (
                window.location.href =
                  "/admin"
              )
            }
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              (
                window.location.href =
                  "/admin/schools"
              )
            }
          >
            <School size={18} />
            <span>Schools</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              (
                window.location.href =
                  "/admin/responses"
              )
            }
          >
            <ClipboardList size={18} />
            <span>Responses</span>
          </button>


          <button
            className="admin-nav-item active"
            onClick={() => {}}
          >
            <BarChart3 size={18} />
            <span>Results</span>
          </button>

<button
  className="admin-nav-item"
  onClick={() =>
    (window.location.href = "/admin/reports")
  }
>
  <FileText size={18} />
  <span>Insights / Reports</span>
</button>

          <div className="admin-nav-divider" />


          <button
            className="admin-nav-item"
            onClick={() =>
              (
                window.location.href =
                  "/dashboard"
              )
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
              (
                window.location.href =
                  "/admin/settings"
              )
            }
          >
            <Settings size={18} />
            <span>Settings</span>
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


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="admin-main">

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Results
            </h1>

            <p className="admin-header-description">
              Explore each school's live
              School Flourish Index profile.
            </p>

          </div>


          <div className="admin-results-header-actions">

            <button
              type="button"
              className="admin-results-refresh"
              onClick={loadResults}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "is-spinning"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </header>


        <section className="admin-section">

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="admin-results-filter-bar">

            <div className="admin-results-filter-label">
              VIEWING
            </div>


            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(
                  e.target.value
                );

                setSelectedCity(
                  "all"
                );
              }}
              aria-label="Filter by state"
            >
              <option value="all">
                All states
              </option>

              {states.map(
                (state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                )
              )}

            </select>


            <select
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity(
                  e.target.value
                )
              }
              aria-label="Filter by city"
            >
              <option value="all">
                All cities
              </option>

              {cities.map(
                (city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                )
              )}

            </select>


            <select
              value={selectedPerspective}
              onChange={(e) =>
                setSelectedPerspective(
                  e.target.value
                )
              }
              aria-label="Filter by perspective"
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


          {/* =================================================
              OVERVIEW
          ================================================= */}

          <div className="admin-section-heading">

            <div>

              <p className="admin-eyebrow">
                RESULTS OVERVIEW
              </p>

              <h2>
                School results
              </h2>

            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>


          <div className="admin-stats admin-results-stats">

            <div className="admin-stat">

              <span>
                Live responses
              </span>

              <strong>
                {loading
                  ? "—"
                  : liveResponsesCount}
              </strong>

              <small>
                Currently contributing
              </small>

            </div>


            <div className="admin-stat">

              <span>
                Schools with results
              </span>

              <strong>
                {loading
                  ? "—"
                  : schoolsWithLiveResults}
              </strong>

              <small>
                Schools with response data
              </small>

            </div>

          </div>


          {/* =================================================
              SCHOOL SEARCH
          ================================================= */}

          <div className="admin-panel admin-results-school-browser">

            <div className="admin-panel-header">

              <div>

                <span className="admin-panel-label">
                  SCHOOL RESULTS
                </span>

                <h3>
                  Find a school
                </h3>

              </div>

              <span className="admin-panel-meta">
                {liveSchoolProfiles.length} schools
              </span>

            </div>


            <div className="admin-results-school-search">

              <Search size={18} />

              <input
                type="search"
                value={schoolSearch}
                onChange={(e) =>
                  setSchoolSearch(
                    e.target.value
                  )
                }
                placeholder="Search school name, city or state..."
                aria-label="Search schools"
              />

              {schoolSearch && (
                <button
                  type="button"
                  className="admin-results-clear-search"
                  onClick={() =>
                    setSchoolSearch("")
                  }
                  aria-label="Clear school search"
                >
                  ×
                </button>
              )}

            </div>


            {visibleSchoolProfiles.length === 0 ? (

              <div className="admin-results-school-empty">

                <School size={24} />

                <strong>
                  No matching school results
                </strong>

                <p>
                  Schools will appear here
                  automatically when their
                  responses are available.
                </p>

              </div>

            ) : (

              <div className="admin-results-school-browser-list">

                {visibleSchoolProfiles.map(
                  (item) => {

                    const isSelected =
                      item.school?.id ===
                      selectedSchoolId;

                    return (
                      <button
                        type="button"
                        key={
                          item.school?.id
                        }
                        className={`admin-results-school-browser-row ${
                          isSelected
                            ? "is-selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectSchool(
                            item.school.id
                          )
                        }
                      >

                        <div className="admin-results-school-browser-main">

                          <div className="admin-results-school-browser-icon">
                            <School size={17} />
                          </div>

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
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ", "
                                ) ||
                                "Location unavailable"}
                            </span>

                          </div>

                        </div>


                        <div className="admin-results-school-browser-meta">

                          <strong>
                            {item.responseCount}
                          </strong>

                          <span>
                            response
                            {item.responseCount !==
                            1
                              ? "s"
                              : ""}
                          </span>

                        </div>


                        <div className="admin-results-school-browser-meta">

                          <strong>
                            {
                              item.availableDimensionCount
                            }/7
                          </strong>

                          <span>
                            dimensions
                          </span>

                        </div>


                        <div className="admin-results-school-browser-perspectives">

                          {item.perspectives
                            .map(
                              (
                                role
                              ) =>
                                formatPerspective(
                                  role
                                )
                            )
                            .join(
                              " · "
                            )}

                        </div>


                        <ArrowUpRight
                          size={16}
                        />

                      </button>
                    );
                  }
                )}

              </div>

            )}

          </div>


          {/* =================================================
              SELECTED SCHOOL PROFILE
          ================================================= */}

          <div
            id="selected-school-profile"
            className="admin-panel admin-results-selected-school"
          >

            <div className="admin-panel-header">

              <div>

                <span className="admin-panel-label">
                  SELECTED SCHOOL
                </span>

                <h3>
                  {selectedSchoolProfile?.school?.name ||
                    "No school selected"}
                </h3>

              </div>

              {selectedSchoolProfile && (
                <button
                  type="button"
                  className="admin-results-open-school"
                  onClick={() =>
                    openSchool(
                      selectedSchoolProfile.school.id
                    )
                  }
                >
                  School details
                  <ArrowUpRight
                    size={15}
                  />
                </button>
              )}

            </div>


            {!selectedSchoolProfile ? (

              <div className="admin-results-school-empty">

                <Target size={25} />

                <strong>
                  Select a school to view its results
                </strong>

                <p>
                  Search above, then select a school.
                  Its seven school-level dimensions
                  will be calculated from the available
                  survey responses.
                </p>

              </div>

            ) : (

              <>

                <div className="admin-results-selected-school-summary">

                  <div>

                    <span>
                      RESPONSES
                    </span>

                    <strong>
                      {
                        selectedSchoolProfile.responseCount
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      PERSPECTIVES
                    </span>

                    <strong>
                      {
                        selectedSchoolProfile
                          .perspectives
                          .length
                      }/4
                    </strong>

                  </div>


                  <div>

                    <span>
                      DIMENSIONS AVAILABLE
                    </span>

                    <strong>
                      {
                        selectedSchoolProfile
                          .availableDimensionCount
                      }/7
                    </strong>

                  </div>

                </div>


                <div className="admin-results-school-method-note">

                  <Clock3 size={16} />

                  <span>
                    This live profile updates from the
                    school's currently available survey
                    responses. Dimensions without a
                    contributing response remain blank.
                  </span>

                </div>


                <div className="admin-results-dimension-profile">

                  <div className="admin-results-dimension-profile-header">

                    <div>
                      <span className="admin-panel-label">
                        DIMENSION PROFILE
                      </span>

                      <h4>
                        School Flourish Dimensions
                      </h4>
                    </div>

                    <span className="admin-results-dimension-profile-scale">
                      Average school response · 0–100%
                    </span>

                  </div>


                  <div className="admin-results-dimension-list">

                    {selectedSchoolProfile.dimensions.map(
                      (dimension, index) => {

                        const hasScore =
                          typeof dimension.average ===
                          "number";

                        const width =
                          hasScore
                            ? Math.max(
                                0,
                                Math.min(
                                  100,
                                  dimension.percentage
                                )
                              )
                            : 0;

                        return (
                          <div
                            key={dimension.key}
                            className="admin-results-dimension-row"
                          >

                            <div className="admin-results-dimension-row-top">

                              <div className="admin-results-dimension-row-title">
                                <span className="admin-results-dimension-index">
                                  {String(index + 1).padStart(2, "0")}
                                </span>

                                <strong>
                                  {dimension.name}
                                </strong>
                              </div>

                              <div className="admin-results-dimension-row-score">
                                {hasScore ? (
                                  <>
                                    <strong>
                                      {dimension.percentage}%
                                    </strong>

                                    <span>
                                      {dimension.average.toFixed(2)} / 5
                                    </span>
                                  </>
                                ) : (
                                  <span className="admin-results-dimension-no-data">
                                    No data
                                  </span>
                                )}
                              </div>

                            </div>


                            <div className="admin-results-dimension-track">
                              <span
                                className="admin-results-dimension-fill"
                                style={{
                                  width: `${width}%`,
                                }}
                              />
                            </div>


                            <div className="admin-results-dimension-row-footer">

                              {hasScore ? (
                                <>
                                  <strong>
                                    {dimension.performance}
                                  </strong>

                                  <span>
                                    {dimension.responseCount}{" "}
                                    contributing response
                                    {dimension.responseCount !== 1 ? "s" : ""}
                                  </span>

                                  <span>
                                    {dimension.contributingPerspectives
                                      .map((role) => formatPerspective(role))
                                      .join(" · ")}
                                  </span>
                                </>
                              ) : (
                                <span>
                                  Waiting for a contributing perspective
                                </span>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>


              </>

            )}

          </div>


          {/* =================================================
              PERSPECTIVES
          ================================================= */}

          <div className="admin-panel admin-results-perspective-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  PERSPECTIVE RESULTS
                </span>

                <h3>
                  Responses by perspective
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
                            (item.count / maxPerspective) * 100
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


          {/* =================================================
              INSIGHTS
          ================================================= */}

          <div className="admin-panel admin-results-insights-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  INSIGHTS
                </span>

                <h3>
                  Selected school profile
                </h3>
              </div>

              <TrendingUp size={18} />

            </div>


            {selectedSchoolProfile ? (

              <div className="admin-results-profile-insights">

                <div>
                  <strong>
                    Strongest available dimensions
                  </strong>

                  <p>
                    {selectedSchoolProfile
                      .dimensions
                      .filter(
                        (dimension) =>
                          typeof dimension.average === "number"
                      )
                      .sort(
                        (a, b) => b.average - a.average
                      )
                      .slice(0, 3)
                      .map(
                        (dimension) =>
                          `${dimension.name} (${dimension.percentage}%)`
                      )
                      .join(" · ") ||
                      "No dimension data available yet."}
                  </p>
                </div>


                <div>
                  <strong>
                    Areas needing attention
                  </strong>

                  <p>
                    {selectedSchoolProfile
                      .dimensions
                      .filter(
                        (dimension) =>
                          typeof dimension.average === "number" &&
                          dimension.average < 3.8
                      )
                      .sort(
                        (a, b) => a.average - b.average
                      )
                      .slice(0, 3)
                      .map(
                        (dimension) =>
                          `${dimension.name} (${dimension.percentage}%)`
                      )
                      .join(" · ") ||
                      "No current attention areas in the available data."}
                  </p>
                </div>

              </div>

            ) : (

              <div className="admin-results-insight-placeholder">
                <strong>
                  Select a school to generate its profile.
                </strong>

                <p>
                  The insight summary will use the available school dimension data.
                </p>
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminResults;
