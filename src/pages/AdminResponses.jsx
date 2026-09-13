import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  Map,
  Users,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";
function AdminResponses() {
  const [responses, setResponses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedPerspective, setSelectedPerspective] =
    useState("all");

  useEffect(() => {
    loadResponses();
  }, []);

  async function loadResponses() {
    setLoading(true);

    const [responsesResult, schoolsResult] =
      await Promise.all([
        supabase
          .from("survey_responses")
          .select(
            "id, school_id, role, submitted_at"
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
        "Error loading responses:",
        responsesResult.error
      );
    }

    if (schoolsResult.error) {
      console.error(
        "Error loading schools:",
        schoolsResult.error
      );
    }

    setResponses(responsesResult.data || []);
    setSchools(schoolsResult.data || []);
    setLoading(false);
  }

  /*
   * -------------------------------------------------------
   * RESPONSE + SCHOOL DATA
   * -------------------------------------------------------
   */

  const responseData = useMemo(() => {
    return responses.map((response) => ({
      ...response,
      school: schools.find(
        (school) =>
          school.id === response.school_id
      ),
    }));
  }, [responses, schools]);

/*
 * -------------------------------------------------------
 * SFI REGIONAL MAPPING
 * -------------------------------------------------------
 *
 * This is the reporting geography used by SFI.
 * Region is derived from the school's state.
 * -------------------------------------------------------
 */

const STATE_TO_REGION = {
  // NORTH
  Punjab: "North",
  Haryana: "North",
  "Himachal Pradesh": "North",
  "Jammu & Kashmir": "North",
  Ladakh: "North",
  Delhi: "North",
  Chandigarh: "North",
  Uttarakhand: "North",
  "Uttar Pradesh": "North",
  Rajasthan: "North",

  // WEST
  Maharashtra: "West",
  Gujarat: "West",
  Goa: "West",
  "Dadra and Nagar Haveli and Daman and Diu": "West",
  "Dadra & Nagar Haveli and Daman & Diu": "West",

  // CENTRAL
  "Madhya Pradesh": "Central",
  Chhattisgarh: "Central",

  // EAST
  Bihar: "East",
  Jharkhand: "East",
  Odisha: "East",
  "West Bengal": "East",

  // SOUTH
  "Andhra Pradesh": "South",
  Telangana: "South",
  Karnataka: "South",
  Kerala: "South",
  "Tamil Nadu": "South",
  Puducherry: "South",
  Lakshadweep: "South",
  "Andaman and Nicobar Islands": "East",

  // NORTHEAST
  Assam: "Northeast",
  "Arunachal Pradesh": "Northeast",
  Manipur: "Northeast",
  Meghalaya: "Northeast",
  Mizoram: "Northeast",
  Nagaland: "Northeast",
  Sikkim: "Northeast",
  Tripura: "Northeast",
};

function getRegion(school) {
  if (!school) return "Unmapped";

  if (
    school.country &&
    school.country.toLowerCase() !== "india"
  ) {
    return "International";
  }

  return (
    STATE_TO_REGION[school.state] ||
    "Unmapped"
  );
}

  /*
   * -------------------------------------------------------
   * FILTER OPTIONS
   * -------------------------------------------------------
   */

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
    const filteredSchools =
      selectedState === "all"
        ? schools
        : schools.filter(
            (school) =>
              school.state === selectedState
          );

    return [
      ...new Set(
        filteredSchools
          .map((school) => school.city)
          .filter(Boolean)
      ),
    ].sort();
  }, [schools, selectedState]);

  /*
   * -------------------------------------------------------
   * FILTERED DATA
   * -------------------------------------------------------
   */

  const filteredResponses = useMemo(() => {
    return responseData.filter((response) => {
      const matchesState =
        selectedState === "all" ||
        response.school?.state === selectedState;

      const matchesCity =
        selectedCity === "all" ||
        response.school?.city === selectedCity;

      const matchesPerspective =
        selectedPerspective === "all" ||
        response.role === selectedPerspective;

      return (
        matchesState &&
        matchesCity &&
        matchesPerspective
      );
    });
  }, [
    responseData,
    selectedState,
    selectedCity,
    selectedPerspective,
  ]);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesState =
        selectedState === "all" ||
        school.state === selectedState;

      const matchesCity =
        selectedCity === "all" ||
        school.city === selectedCity;

      return matchesState && matchesCity;
    });
  }, [
    schools,
    selectedState,
    selectedCity,
  ]);

  /*
   * -------------------------------------------------------
   * OVERVIEW METRICS
   * -------------------------------------------------------
   */

  const totalResponses =
    filteredResponses.length;

  const participatingSchoolIds =
    new Set(
      filteredResponses
        .map((response) => response.school_id)
        .filter(Boolean)
    );

  const participatingSchools =
    participatingSchoolIds.size;

  const totalSchools =
    filteredSchools.length;

  const participationRate =
    totalSchools > 0
      ? Math.round(
          (participatingSchools /
            totalSchools) *
            100
        )
      : 0;

  /*
   * -------------------------------------------------------
   * PERSPECTIVE DATA
   * -------------------------------------------------------
   */

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

    filteredResponses.forEach((response) => {
      const item = data.find(
        (entry) =>
          entry.key === response.role
      );

      if (item) {
        item.count += 1;
      }
    });

    return data;
  }, [filteredResponses]);

  const highestPerspectiveCount =
    Math.max(
      ...perspectiveData.map(
        (item) => item.count
      ),
      1
    );

  /*
   * -------------------------------------------------------
   * STATE RESPONSE DATA
   *
   * Shows actual response volume AND
   * participating-school coverage.
   * -------------------------------------------------------
   */

  const stateData = useMemo(() => {
    const map = {};

    filteredSchools.forEach((school) => {
      if (!school.state) return;

      if (!map[school.state]) {
        map[school.state] = {
          state: school.state,
          totalSchools: 0,
          responseCount: 0,
          respondedSchools: new Set(),
        };
      }

      map[school.state].totalSchools += 1;
    });

    filteredResponses.forEach((response) => {
      const state =
        response.school?.state;

      if (!state) return;

      if (!map[state]) {
        map[state] = {
          state,
          totalSchools: 0,
          responseCount: 0,
          respondedSchools: new Set(),
        };
      }

      map[state].responseCount += 1;

      if (response.school_id) {
        map[state].respondedSchools.add(
          response.school_id
        );
      }
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        respondedSchools:
          item.respondedSchools.size,
        participationRate:
          item.totalSchools > 0
            ? Math.round(
                (item.respondedSchools.size /
                  item.totalSchools) *
                  100
              )
            : 0,
      }))
      .sort(
        (a, b) =>
          b.responseCount -
          a.responseCount
      );
  }, [
    filteredSchools,
    filteredResponses,
  ]);

  /*
   * -------------------------------------------------------
   * REGION DATA
   *
   * Region is intentionally not fabricated because
   * Supabase currently stores state, not region.
   *
   * We keep this section ready for the approved
   * region mapping later.
   * -------------------------------------------------------
   */

  const regionData = useMemo(() => {
  const map = {};

  const regions = [
    "North",
    "West",
    "Central",
    "East",
    "South",
    "Northeast",
    "International",
    "Unmapped",
  ];

  regions.forEach((region) => {
    map[region] = {
      name: region,
      responseCount: 0,
      schools: new Set(),
    };
  });

  filteredResponses.forEach((response) => {
    const region = getRegion(response.school);

    if (!map[region]) {
      map[region] = {
        name: region,
        responseCount: 0,
        schools: new Set(),
      };
    }

    map[region].responseCount += 1;

    if (response.school_id) {
      map[region].schools.add(response.school_id);
    }
  });

  return Object.values(map)
    .map((region) => ({
      ...region,
      schools: region.schools.size,
    }))
    .filter(
      (region) =>
        region.responseCount > 0 ||
        region.schools > 0
    )
    .sort(
      (a, b) =>
        b.responseCount -
        a.responseCount
    );
}, [filteredResponses]);

const REGION_COLORS = [
  "#D4AF37",
  "#7C9A92",
  "#8FA3BF",
  "#B58B6A",
  "#9B8FB5",
  "#6F8F72",
  "#A67C8E",
  "#8C8C8C",
];
  /*
   * -------------------------------------------------------
   * LAST 7 DAYS
   * -------------------------------------------------------
   */

  const responseTrend = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(
        date.getDate() - i
      );

      days.push({
        date,
        label:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday: "short",
            }
          ),
        shortDate:
          date.toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
            }
          ),
        count: 0,
      });
    }

    filteredResponses.forEach(
      (response) => {
        const submitted = new Date(
          response.submitted_at
        );

        submitted.setHours(
          0,
          0,
          0,
          0
        );

        const matchingDay =
          days.find(
            (day) =>
              day.date.getTime() ===
              submitted.getTime()
          );

        if (matchingDay) {
          matchingDay.count += 1;
        }
      }
    );

    return days;
  }, [filteredResponses]);

  const highestTrendCount =
    Math.max(
      ...responseTrend.map(
        (day) => day.count
      ),
      1
    );

  /*
   * -------------------------------------------------------
   * LAST 7 SUBMISSIONS
   * -------------------------------------------------------
   */

  const latestResponses =
    filteredResponses.slice(0, 7);

  /*
   * -------------------------------------------------------
   * MOST ACTIVE SCHOOLS
   * -------------------------------------------------------
   */

  const activeSchoolData = useMemo(() => {
    const map = {};

    filteredResponses.forEach(
      (response) => {
        if (!response.school_id) return;

        if (!map[response.school_id]) {
          map[response.school_id] = {
            school:
              response.school,
            responses: 0,
            perspectives: new Set(),
            latest:
              response.submitted_at,
          };
        }

        map[
          response.school_id
        ].responses += 1;

        if (response.role) {
          map[
            response.school_id
          ].perspectives.add(
            response.role
          );
        }

        if (
          new Date(
            response.submitted_at
          ) >
          new Date(
            map[
              response.school_id
            ].latest
          )
        ) {
          map[
            response.school_id
          ].latest =
            response.submitted_at;
        }
      }
    );

    return Object.values(map)
      .sort(
        (a, b) =>
          b.responses -
          a.responses
      )
      .slice(0, 6);
  }, [filteredResponses]);

  /*
   * -------------------------------------------------------
   * PARTICIPATION GAPS
   * -------------------------------------------------------
   */

  const participationGaps =
    useMemo(() => {
      return filteredSchools
        .map((school) => {
          const schoolResponses =
            filteredResponses.filter(
              (response) =>
                response.school_id ===
                school.id
            );

          const perspectives =
            new Set(
              schoolResponses
                .map(
                  (response) =>
                    response.role
                )
                .filter(Boolean)
            );

          return {
            ...school,
            perspectiveCount:
              perspectives.size,
            missingPerspectives:
              [
                "parent",
                "teacher",
                "student",
                "leader",
              ].filter(
                (role) =>
                  !perspectives.has(role)
              ),
          };
        })
        .filter(
          (school) =>
            school.perspectiveCount > 0 &&
            school.perspectiveCount < 4
        )
        .sort(
          (a, b) =>
            a.perspectiveCount -
            b.perspectiveCount
        )
        .slice(0, 6);
    }, [
      filteredSchools,
      filteredResponses,
    ]);

  /*
   * -------------------------------------------------------
   * HELPERS
   * -------------------------------------------------------
   */

  function formatPerspective(role) {
    if (role === "parent") return "Parent";
    if (role === "teacher") return "Teacher";
    if (role === "student") return "Student";
    if (role === "leader") return "Leadership";

    return "Unknown";
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date) {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function openSchool(schoolId) {
    if (!schoolId) return;

    window.location.href =
      `/admin/schools/${schoolId}`;
  }

  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  return (
    <div className="admin-dashboard">
<SEO
  title="Admin Responses — School Flourish Index"
  description="View and manage School Flourish Index survey responses."
  url="/admin/responses"
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

          <button className="admin-nav-item active">
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
          <span>SCHOOL FLOURISH INDEX</span>
          <small>Administration</small>
        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Responses</h1>

            <p className="admin-header-description">
              Survey participation and response
              activity across the SFI network.
            </p>
          </div>


          {/* FILTERS */}

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


        {/* =================================================
            OVERVIEW
        ================================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-eyebrow">
                RESPONSE OVERVIEW
              </p>

              <h2>
                Participation at a glance
              </h2>
            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>


          {/* FOUR METRICS */}

          <div className="admin-stats admin-response-stats">

            <div className="admin-stat">
              <span>Total responses</span>

              <strong>
                {loading
                  ? "—"
                  : totalResponses}
              </strong>

              <small>
                Submitted perspectives
              </small>
            </div>


            <div className="admin-stat">
              <span>Schools participating</span>

              <strong>
                {loading
                  ? "—"
                  : participatingSchools}
              </strong>

              <small>
                Schools with responses
              </small>
            </div>


            <div className="admin-stat">
              <span>Survey participation</span>

              <strong>
                {loading
                  ? "—"
                  : `${participationRate}%`}
              </strong>

              <small>
                Participating schools
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


          {/* =================================================
              REGION + STATE
          ================================================= */}

          <div className="admin-response-new-grid">

            {/* REGION */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    GEOGRAPHIC COVERAGE
                  </span>

                  <h3>
                    Responses by region
                  </h3>
                </div>

                <Map size={18} />

              </div>


{regionData.length === 0 ? (
  <div className="admin-empty-state">
    <Map size={22} />

    <p>
      Regional response data will appear
      as surveys are submitted.
    </p>
  </div>
) : (
  <div className="admin-region-chart">

    <div className="admin-region-donut">

      <ResponsiveContainer
        width="100%"
        height={250}
      >
        <PieChart>
          <Pie
            data={regionData}
            dataKey="responseCount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={3}
            stroke="none"
          >
            {regionData.map((region, index) => (
              <Cell
                key={`region-${region.name}`}
                fill={
                  REGION_COLORS[
                    index % REGION_COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `${value} responses`,
              "Responses",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="admin-region-donut-center">
        <strong>
          {regionData.reduce(
            (sum, region) =>
              sum + region.responseCount,
            0
          )}
        </strong>

        <span>responses</span>
      </div>

    </div>

    <div className="admin-region-legend">

      {regionData.map((region, index) => (
        <div
          className="admin-region-legend-item"
          key={region.name}
        >

          <span
            className="admin-region-legend-dot"
            style={{
              background:
                REGION_COLORS[
                  index % REGION_COLORS.length
                ],
            }}
          />

          <div>
            <strong>{region.name}</strong>

            <span>
              {region.schools}{" "}
              {region.schools === 1
                ? "school"
                : "schools"}
            </span>
          </div>

          <strong className="admin-region-legend-count">
            {region.responseCount}
          </strong>

        </div>
      ))}

    </div>

  </div>
)}
            </div>


            {/* STATE */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    STATE COVERAGE
                  </span>

                  <h3>
                    Responses by state
                  </h3>
                </div>

                <Activity size={18} />

              </div>


              {stateData.length === 0 ? (

                <div className="admin-empty-state">

                  <Activity size={22} />

                  <p>
                    State response data will appear
                    as surveys are submitted.
                  </p>

                </div>

              ) : (

                <div className="admin-state-response-list">

                  {stateData
                    .slice(0, 7)
                    .map((item) => (

                      <div
                        className="admin-state-response-row"
                        key={item.state}
                      >

                        <div className="admin-state-response-info">

                          <strong>
                            {item.state}
                          </strong>

                          <span>
                            {item.respondedSchools}
                            {" of "}
                            {item.totalSchools}
                            {" schools"}
                          </span>

                        </div>


                        <div className="admin-state-response-number">

                          <strong>
                            {item.responseCount}
                          </strong>

                          <span>
                            responses
                          </span>

                        </div>


                        <div className="admin-state-response-rate">

                          <strong>
                            {item.participationRate}%
                          </strong>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              SURVEY PARTICIPATION
          ================================================= */}

          <div className="admin-panel admin-participation-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  SURVEY PARTICIPATION
                </span>

                <h3>
                  School participation
                </h3>
              </div>

              <span className="admin-panel-meta">
                {participatingSchools} of{" "}
                {totalSchools} schools
              </span>

            </div>


            <div className="admin-participation-main">

              <div className="admin-participation-number">

                <strong>
                  {loading
                    ? "—"
                    : `${participationRate}%`}
                </strong>

                <span>
                  participation rate
                </span>

              </div>


              <div className="admin-participation-track">

                <span
                  style={{
                    width: `${participationRate}%`,
                  }}
                />

              </div>


              <div className="admin-participation-legend">

                <span>
                  <CheckCircle2 size={14} />
                  Participating{" "}
                  <strong>
                    {participatingSchools}
                  </strong>
                </span>

                <span>
                  <Clock3 size={14} />
                  Not started{" "}
                  <strong>
                    {Math.max(
                      totalSchools -
                        participatingSchools,
                      0
                    )}
                  </strong>
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              PERSPECTIVES + LAST 7 DAYS
          ================================================= */}

          <div className="admin-response-new-grid">

            {/* PERSPECTIVES */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    RESPONSE PERSPECTIVES
                  </span>

                  <h3>
                    Who is responding
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
                                highestPerspectiveCount) *
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


            {/* LAST 7 DAYS */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    RESPONSE ACTIVITY
                  </span>

                  <h3>
                    Last 7 days
                  </h3>
                </div>

                <span className="admin-panel-meta">
                  {responseTrend.reduce(
                    (sum, day) =>
                      sum + day.count,
                    0
                  )}{" "}
                  submissions
                </span>

              </div>


              <div className="admin-new-trend">

                {responseTrend.map(
                  (day) => (

                    <div
                      className="admin-new-trend-column"
                      key={day.label}
                    >

                      <strong>
                        {day.count}
                      </strong>

                      <div className="admin-new-trend-track">

                        <span
                          style={{
                            height: `${
                              (day.count /
                                highestTrendCount) *
                              100
                            }%`,
                          }}
                        />

                      </div>

                      <span>
                        {day.label}
                      </span>

                      <small>
                        {day.shortDate}
                      </small>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              LAST 7 SUBMISSIONS
          ================================================= */}

          <div className="admin-response-new-grid">

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    RECENT ACTIVITY
                  </span>

                  <h3>
                    Last 7 submissions
                  </h3>
                </div>

                <ClipboardList size={18} />

              </div>


              {latestResponses.length === 0 ? (

                <div className="admin-empty-state">

                  <ClipboardList size={22} />

                  <p>
                    No survey submissions yet.
                  </p>

                </div>

              ) : (

                <div className="admin-new-latest-list">

                  {latestResponses.map(
                    (response) => (

                      <button
                        className="admin-new-latest-row"
                        key={response.id}
                      >

                        <div className="admin-new-latest-icon">
                          <ClipboardList
                            size={16}
                          />
                        </div>


                        <div className="admin-new-latest-info">

                          <strong>
                            {response.school?.name ||
                              "Unknown school"}
                          </strong>

                          <span>
                            {formatPerspective(
                              response.role
                            )}
                          </span>

                        </div>


                        <div className="admin-new-latest-time">

                          <strong>
                            {formatDate(
                              response.submitted_at
                            )}
                          </strong>

                          <span>
                            {formatTime(
                              response.submitted_at
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


            {/* MOST ACTIVE SCHOOLS */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="admin-panel-label">
                    SCHOOL ACTIVITY
                  </span>

                  <h3>
                    Most active schools
                  </h3>
                </div>

                <School size={18} />

              </div>


              {activeSchoolData.length === 0 ? (

                <div className="admin-empty-state">

                  <School size={22} />

                  <p>
                    School activity will appear
                    as responses are submitted.
                  </p>

                </div>

              ) : (

                <div className="admin-active-school-list">

                  {activeSchoolData.map(
                    (item, index) => (

                      <button
                        className="admin-active-school-row"
                        key={
                          item.school?.id
                        }
                        onClick={() =>
                          openSchool(
                            item.school?.id
                          )
                        }
                      >

                        <span className="admin-active-school-rank">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>


                        <div className="admin-active-school-info">

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
                              .join(
                                ", "
                              )}
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

          </div>


          {/* =================================================
              PARTICIPATION GAPS
          ================================================= */}

          <div className="admin-panel admin-gap-panel">

            <div className="admin-panel-header">

              <div>
                <span className="admin-panel-label">
                  PARTICIPATION GAPS
                </span>

                <h3>
                  Schools with incomplete perspectives
                </h3>
              </div>

              <span className="admin-panel-meta">
                {participationGaps.length} shown
              </span>

            </div>


            {participationGaps.length === 0 ? (

              <div className="admin-gap-success">

                <CheckCircle2 size={22} />

                <div>
                  <strong>
                    No participation gaps
                  </strong>

                  <p>
                    All currently participating
                    schools have responses across
                    every perspective.
                  </p>
                </div>

              </div>

            ) : (

              <div className="admin-gap-list">

                {participationGaps.map(
                  (school) => (

                    <button
                      className="admin-gap-row"
                      key={school.id}
                      onClick={() =>
                        openSchool(
                          school.id
                        )
                      }
                    >

                      <div className="admin-gap-school">

                        <School size={17} />

                        <div>
                          <strong>
                            {school.name}
                          </strong>

                          <span>
                            {[
                              school.city,
                              school.state,
                            ]
                              .filter(Boolean)
                              .join(
                                ", "
                              )}
                          </span>
                        </div>

                      </div>


                      <div className="admin-gap-progress">

                        <span>
                          {school.perspectiveCount}
                          /4 perspectives
                        </span>

                        <div>
                          <span
                            style={{
                              width: `${
                                (school.perspectiveCount /
                                  4) *
                                100
                              }%`,
                            }}
                          />
                        </div>

                      </div>


                      <div className="admin-gap-missing">

                        {school.missingPerspectives.map(
                          (role) => (
                            <span
                              key={role}
                            >
                              {formatPerspective(
                                role
                              )}
                            </span>
                          )
                        )}

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

        </section>

      </main>

    </div>
  );
}

export default AdminResponses;