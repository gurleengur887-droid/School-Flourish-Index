import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  School,
  ClipboardList,
  Users,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Search,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import "../styles/admin_response_details.css";
import SEO from "../components/SEO";
const ROLE_CONFIG = {
  parent: {
    label: "Parent",
    description: "Family perspective",
    icon: Users,
  },

  teacher: {
    label: "Teacher",
    description: "Teaching perspective",
    icon: BriefcaseBusiness,
  },

  student: {
    label: "Student",
    description: "Student perspective",
    icon: GraduationCap,
  },

  leader: {
    label: "Leadership",
    description: "Leadership perspective",
    icon: UserRound,
  },
};

function getResponseName(response, index) {
  const data = response?.response_data || {};

  const possibleNameKeys = [
    "Name",
    "Full Name",
    "Full name",
    "Your Name",
    "Your name",
    "Name:",
    "Full Name:",
    "Full name:",
    "Respondent Name",
    "Respondent name",
  ];

  for (const key of possibleNameKeys) {
    const value = data[key];

    if (
      value &&
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function getEmail(response) {
  const data = response?.response_data || {};

  const possibleEmailKeys = [
    "Email address",
    "Email Address",
    "Email",
    "email",
    "Email:",
  ];

  for (const key of possibleEmailKeys) {
    const value = data[key];

    if (
      value &&
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function getSecondaryInfo(response) {
  const data = response?.response_data || {};

  const roleKeys = [
    "Current Role/Position",
    "Current Role",
    "Position",
    "Role",
  ];

  for (const key of roleKeys) {
    const value = data[key];

    if (
      value &&
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function AdminPerspectiveResponses() {
  const { schoolId, role } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const roleConfig =
    ROLE_CONFIG[role] || {
      label: role,
      description: "Survey perspective",
      icon: ClipboardList,
    };

  const RoleIcon = roleConfig.icon;

  useEffect(() => {
    loadData();
  }, [schoolId, role]);

  async function loadData() {
    setLoading(true);

    const [
      schoolResult,
      responsesResult,
    ] = await Promise.all([
      supabase
        .from("schools")
        .select(
          "id, name, city, state, country"
        )
        .eq("id", schoolId)
        .single(),

      supabase
        .from("survey_responses")
        .select(
          "id, school_id, role, submitted_at, response_data, created_at"
        )
        .eq("school_id", schoolId)
        .eq("role", role)
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

  const filteredResponses = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return responses;
    }

    return responses.filter((response) => {
      const name =
        getResponseName(response, 0) || "";

      const email =
        getEmail(response) || "";

      const secondary =
        getSecondaryInfo(response) || "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        secondary.toLowerCase().includes(query)
      );
    });
  }, [responses, search]);

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

          <h1>
            Loading responses...
          </h1>

        </main>

      </div>
    );
  }

  if (!school) {
    return (
      <div className="admin-dashboard">
<SEO
  title="Perspective Responses — School Flourish Index"
  description="View School Flourish Index responses by school perspective."
  url="/admin/perspective"
  noIndex
/>
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

        <button
          className="admin-back-button"
          onClick={() =>
            navigate(
              `/admin/schools/${schoolId}`
            )
          }
        >
          <ArrowLeft size={17} />
          Back to {school.name}
        </button>

        {/* HEADER */}

        <header className="admin-response-directory-header">

          <div className="admin-response-directory-title">

            <div className="admin-response-big-icon">
              <RoleIcon size={24} />
            </div>

            <div>

              <p className="admin-eyebrow">
                {roleConfig.label.toUpperCase()} RESPONSES
              </p>

              <h1>
                {roleConfig.label} responses
              </h1>

              <p className="admin-header-description">
                {school.name}
                {school.city
                  ? ` · ${school.city}`
                  : ""}
              </p>

            </div>

          </div>

          <div className="admin-response-total">

            <strong>
              {responses.length}
            </strong>

            <span>
              {roleConfig.label.toLowerCase()}{" "}
              {responses.length === 1
                ? "response"
                : "responses"}
            </span>

          </div>

        </header>

        {/* DIRECTORY */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <p className="admin-eyebrow">
                RESPONSE DIRECTORY
              </p>

              <h2>
                Submitted responses
              </h2>

            </div>

            <div className="admin-response-search">

              <Search size={17} />

              <input
                type="text"
                placeholder={`Search ${roleConfig.label.toLowerCase()} responses`}
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

          </div>

          <div className="admin-panel">

            {filteredResponses.length === 0 ? (

              <div className="admin-empty-state">

                <ClipboardList size={22} />

                <p>
                  {search
                    ? `No ${roleConfig.label.toLowerCase()} responses match your search.`
                    : `No ${roleConfig.label.toLowerCase()} responses have been submitted for this school yet.`}
                </p>

              </div>

            ) : (

              <div className="admin-perspective-list">

                {filteredResponses.map(
                  (response, index) => {

                    const name =
                      getResponseName(
                        response,
                        index
                      );

                    const email =
                      getEmail(response);

                    const secondary =
                      getSecondaryInfo(
                        response
                      );

                    return (
                      <button
                        type="button"
                        key={response.id}
                        className="admin-perspective-response-row"
                        onClick={() =>
                          openResponse(
                            response.id
                          )
                        }
                      >

                        <div className="admin-perspective-response-number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </div>

                        <div className="admin-perspective-response-icon">
                          <RoleIcon size={18} />
                        </div>

                        <div className="admin-perspective-response-main">

                          <strong>
                            {name ||
                              `${roleConfig.label} response ${
                                String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )
                              }`}
                          </strong>

                          <div className="admin-perspective-response-meta">

                            {email && (
                              <span>
                                {email}
                              </span>
                            )}

                            {secondary && (
                              <span>
                                {secondary}
                              </span>
                            )}

                          </div>

                        </div>

                        <time>
                          {formatDate(
                            response.submitted_at
                          )}
                        </time>

                        <ArrowRight
                          size={18}
                          className="admin-perspective-row-arrow"
                        />

                      </button>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminPerspectiveResponses;