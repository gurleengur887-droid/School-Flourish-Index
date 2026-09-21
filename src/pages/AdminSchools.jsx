import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  Search,
    FileText,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";
function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    loadSchoolData();
  }, []);

  async function loadSchoolData() {
    setLoading(true);

    const [schoolsResult, responsesResult] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name, city, state, country")
        .order("name", { ascending: true }),

      supabase
        .from("survey_responses")
        .select("id, school_id, role, submitted_at"),
    ]);

    if (schoolsResult.error) {
      console.error("Error loading schools:", schoolsResult.error);
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

  /*
   * Build participation information for every school
   */
  const schoolData = useMemo(() => {
    return schools.map((school) => {
      const schoolResponses = responses.filter(
        (response) => response.school_id === school.id
      );

      const parent = schoolResponses.filter(
        (response) => response.role === "parent"
      ).length;

      const teacher = schoolResponses.filter(
        (response) => response.role === "teacher"
      ).length;

      const student = schoolResponses.filter(
        (response) => response.role === "student"
      ).length;

      const leader = schoolResponses.filter(
        (response) => response.role === "leader"
      ).length;

      const lastResponse = schoolResponses.length
        ? schoolResponses.reduce((latest, current) => {
            return new Date(current.submitted_at) >
              new Date(latest.submitted_at)
              ? current
              : latest;
          })
        : null;

      return {
        ...school,
        totalResponses: schoolResponses.length,
        parent,
        teacher,
        student,
        leader,
        perspectives: [
          parent > 0,
          teacher > 0,
          student > 0,
          leader > 0,
        ].filter(Boolean).length,
        lastResponse,
      };
    });
  }, [schools, responses]);

  /*
   * Summary numbers
   */
  const totalSchools = schools.length;

  const schoolsWithResponses = schoolData.filter(
    (school) => school.totalResponses > 0
  ).length;

  const schoolsAwaitingResponses = schoolData.filter(
    (school) => school.totalResponses === 0
  ).length;

  /*
   * Search + filters
   */
  const cities = [
    ...new Set(
      schools
        .map((school) => school.city)
        .filter(Boolean)
    ),
  ].sort();

  const states = [
    ...new Set(
      schools
        .map((school) => school.state)
        .filter(Boolean)
    ),
  ].sort();

  const filteredSchools = schoolData.filter((school) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      school.name.toLowerCase().includes(searchText) ||
      (school.city || "").toLowerCase().includes(searchText) ||
      (school.state || "").toLowerCase().includes(searchText);

    const matchesCity =
      selectedCity === "all" ||
      school.city === selectedCity;

    const matchesState =
      selectedState === "all" ||
      school.state === selectedState;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" &&
        school.totalResponses > 0) ||
      (selectedStatus === "awaiting" &&
        school.totalResponses === 0);

    return (
      matchesSearch &&
      matchesCity &&
      matchesState &&
      matchesStatus
    );
  });

  function formatLastActivity(date) {
    if (!date) return "No activity";

    const submitted = new Date(date);
    const now = new Date();

    const difference = Math.floor(
      (now - submitted) / (1000 * 60 * 60 * 24)
    );

    if (difference === 0) return "Today";
    if (difference === 1) return "Yesterday";
    if (difference < 7) return `${difference} days ago`;

    return submitted.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function openSchool(schoolId) {
    window.location.href = `/admin/schools/${schoolId}`;
  }

  return (
    <div className="admin-dashboard">
<SEO
  title="Manage Schools — School Flourish Index"
  description="Manage schools and School Flourish Index administration data."
  url="/admin/schools"
  noIndex
/>
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-mark">S</div>

          <div>
            <span>School Flourish</span>
            <strong>INDEX</strong>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() => (window.location.href = "/admin")}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button className="admin-nav-item active">
            <School size={18} />
            <span>Schools</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/responses")
            }
          >
            <ClipboardList size={18} />
            <span>Responses</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/results")
            }
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
              (window.location.href = "/dashboard")
            }
          >
            <Eye size={18} />
            <span>Public Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/settings")
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

            <h1>Schools</h1>

            <p className="admin-header-description">
              Monitor school participation and survey activity
              across the School Flourish Index.
            </p>

          </div>

          {/* TOP-RIGHT FILTER */}

          <div className="admin-school-selector">

            <div className="admin-view-filter">

              <span>VIEWING</span>

              <select
                value={selectedState}
                onChange={(e) =>
                  setSelectedState(e.target.value)
                }
              >
                <option value="all">All states</option>

                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) =>
                  setSelectedCity(e.target.value)
                }
              >
                <option value="all">All cities</option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="awaiting">
                  Awaiting responses
                </option>
              </select>

            </div>

          </div>

        </header>


        {/* =========================
            SCHOOL OVERVIEW
        ========================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <p className="admin-eyebrow">
                SCHOOL DIRECTORY
              </p>

              <h2>School participation</h2>

            </div>

            <span className="admin-live-label">
              ● Live data
            </span>

          </div>


          {/* Stats */}

          <div className="admin-stats">

            <div className="admin-stat">

              <span>Total schools</span>

              <strong>
                {loading ? "—" : totalSchools}
              </strong>

              <small>
                Schools in the SFI directory
              </small>

            </div>

            <div className="admin-stat">

              <span>With responses</span>

              <strong>
                {loading ? "—" : schoolsWithResponses}
              </strong>

              <small>
                Schools with survey activity
              </small>

            </div>

            <div className="admin-stat">

              <span>Awaiting responses</span>

              <strong>
                {loading ? "—" : schoolsAwaitingResponses}
              </strong>

              <small>
                Schools with no submissions yet
              </small>

            </div>

          </div>


          {/* Search */}

          <div className="admin-schools-toolbar">

            <div className="admin-school-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search by school, city or state..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* =========================
              SCHOOL TABLE
          ========================= */}

          <div className="admin-panel admin-schools-panel">

            {loading ? (

              <div className="admin-empty-state">
                <p>Loading school data...</p>
              </div>

            ) : filteredSchools.length === 0 ? (

              <div className="admin-empty-state">

                <School size={22} />

                <p>
                  No schools match your search or filter.
                </p>

              </div>

            ) : (

              <div className="admin-school-table">

                {/* Table header */}

                <div className="admin-school-table-header">

                  <span>School</span>
                  <span>Responses</span>
                  <span>Perspectives</span>
                  <span>Last activity</span>
                  <span>Status</span>

                </div>


                {/* Rows */}

                {filteredSchools.map((school) => (

                  <button
                    className="admin-school-table-row"
                    key={school.id}
                    onClick={() =>
                      openSchool(school.id)
                    }
                  >

                    <div className="admin-school-name">

                      <div className="admin-school-icon">
                        <School size={19} />
                      </div>

                      <div>

                        <strong>
                          {school.name}
                        </strong>

                        <span>
                          {[
                            school.city,
                            school.state,
                            school.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>

                      </div>

                    </div>


                    <div className="admin-school-number">
                      {school.totalResponses}
                    </div>


                    <div className="admin-school-perspectives">

                      <span
                        className={
                          school.parent
                            ? "completed"
                            : ""
                        }
                      >
                        P
                      </span>

                      <span
                        className={
                          school.teacher
                            ? "completed"
                            : ""
                        }
                      >
                        T
                      </span>

                      <span
                        className={
                          school.student
                            ? "completed"
                            : ""
                        }
                      >
                        S
                      </span>

                      <span
                        className={
                          school.leader
                            ? "completed"
                            : ""
                        }
                      >
                        L
                      </span>

                    </div>


                    <div className="admin-school-last">

                      {formatLastActivity(
                        school.lastResponse?.submitted_at
                      )}

                    </div>


                    <div>

                      <span
                        className={
                          school.totalResponses > 0
                            ? "admin-school-status active"
                            : "admin-school-status waiting"
                        }
                      >
                        {school.totalResponses > 0
                          ? "Active"
                          : "Awaiting"}
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminSchools;