import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Users,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";
function AdminIndividualResponse() {
  const { schoolId, responseId } = useParams();
  const navigate = useNavigate();

  const [response, setResponse] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResponse();
  }, [schoolId, responseId]);

  async function loadResponse() {
    setLoading(true);
    setError("");

    const [responseResult, schoolResult] = await Promise.all([
      supabase
        .from("survey_responses")
        .select(
          "id, school_id, role, submitted_at, response_data, created_at"
        )
        .eq("id", responseId)
        .eq("school_id", schoolId)
        .single(),

      supabase
        .from("schools")
        .select("id, name, city, state, country")
        .eq("id", schoolId)
        .single(),
    ]);

    if (responseResult.error) {
      console.error(
        "Error loading individual response:",
        responseResult.error
      );

      setError("We couldn't load this survey response.");
    }

    if (schoolResult.error) {
      console.error(
        "Error loading school:",
        schoolResult.error
      );
    }

    setResponse(responseResult.data || null);
    setSchool(schoolResult.data || null);

    setLoading(false);
  }

  function getRoleLabel(role) {
    const labels = {
      parent: "Parent",
      teacher: "Teacher",
      student: "Student",
      leader: "Leadership",
    };

    return labels[role] || role || "Unknown";
  }

  function getRoleIcon(role) {
    if (role === "parent") {
      return <Users size={20} />;
    }

    if (role === "teacher") {
      return <BriefcaseBusiness size={20} />;
    }

    if (role === "student") {
      return <GraduationCap size={20} />;
    }

    if (role === "leader") {
      return <UserRound size={20} />;
    }

    return <ClipboardList size={20} />;
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatKey(key) {
    if (!key) return "";

    return String(key)
      .replace(/^_migration_/, "")
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function formatValue(value) {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => formatValue(item))
        .join(", ");
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .map(
          ([key, item]) =>
            `${formatKey(key)}: ${formatValue(item)}`
        )
        .join(" • ");
    }

    return String(value);
  }

  function goBack() {
    navigate(
      `/admin/schools/${schoolId}/perspective/${response?.role || ""}`
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <main className="admin-main">
          <div className="admin-loading">
            Loading response...
          </div>
        </main>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="admin-dashboard">
        <main className="admin-main">
          <button
            className="admin-back-button"
            onClick={() =>
              navigate(`/admin/schools/${schoolId}`)
            }
          >
            <ArrowLeft size={16} />
            Back to school
          </button>

          <section className="admin-section">
            <div className="admin-panel">
              <div className="admin-empty-state">
                <ClipboardList size={24} />

                <div>
                  <strong>
                    {error || "Response not found"}
                  </strong>

                  <p>
                    This response may no longer exist or
                    may not belong to this school.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const responseData = response.response_data || {};

  const entries = Object.entries(responseData).filter(
    ([key]) =>
      !key.startsWith("_migration_")
  );

  return (
    <div className="admin-dashboard">
      <SEO
  title="Response Details — School Flourish Index"
  description="View an individual School Flourish Index survey response."
  url="/admin/response"
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
              (window.location.href = "/admin")
            }
          >
            Overview
          </button>

          <button
            className="admin-nav-item active"
            onClick={() =>
              (window.location.href = "/admin/schools")
            }
          >
            Schools
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/responses")
            }
          >
            Responses
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/results")
            }
          >
            Results
          </button>

          <div className="admin-nav-divider" />

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            Public Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              (window.location.href = "/admin/settings")
            }
          >
            Settings
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>SCHOOL FLOURISH INDEX</span>
        </div>
      </aside>

      {/* MAIN */}

      <main className="admin-main">
        <button
          className="admin-back-button"
          onClick={goBack}
        >
          <ArrowLeft size={16} />
          Back to {getRoleLabel(response.role)} responses
        </button>

        {/* HEADER */}

        <section className="admin-section">
          <div className="admin-detail-header">
            <div>
              <p className="admin-eyebrow">
                INDIVIDUAL RESPONSE
              </p>

              <h1>
                {getRoleLabel(response.role)} response
              </h1>

              <p className="admin-detail-subtitle">
                {school?.name || "School"}
                {school?.city
                  ? ` · ${school.city}`
                  : ""}
                {school?.state
                  ? ` · ${school.state}`
                  : ""}
              </p>
            </div>

            <div className="admin-response-meta">
              <div className="admin-role-badge">
                {getRoleIcon(response.role)}

                <span>
                  {getRoleLabel(response.role)}
                </span>
              </div>

              <div className="admin-submission-date">
                <CalendarDays size={16} />

                <span>
                  {formatDate(response.submitted_at)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RESPONSE INFORMATION */}

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">
                SUBMITTED DATA
              </p>

              <h2>
                Survey responses
              </h2>
            </div>

            <span className="admin-panel-meta">
              {entries.length} fields
            </span>
          </div>

          <div className="admin-response-detail-list">
            {entries.length === 0 ? (
              <div className="admin-panel">
                <div className="admin-empty-state">
                  <ClipboardList size={22} />

                  <p>
                    No response data is available for
                    this submission.
                  </p>
                </div>
              </div>
            ) : (
              entries.map(([key, value], index) => (
                <div
                  className="admin-response-detail-row"
                  key={`${key}-${index}`}
                >
                  <div className="admin-response-detail-label">
                    {formatKey(key)}
                  </div>

                  <div className="admin-response-detail-value">
                    {formatValue(value)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RESPONSE ID */}

        <section className="admin-section">
          <div className="admin-response-id">
            <span>RESPONSE ID</span>

            <code>{response.id}</code>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminIndividualResponse;