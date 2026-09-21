import React, { useEffect, useState } from "react";

import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  FileText,
  Inbox,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../styles/admin_dashboard.css";
import SEO from "../components/SEO";

function AdminReportRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("report_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        throw fetchError;
      }

      setRequests(data || []);
    } catch (err) {
      console.error("Report request loading error:", err);

      setError(
        err?.message ||
          "Unable to load insight requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRole = (role) => {
    if (!role) return "—";

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1).toLowerCase()
    );
  };

  return (
    <div className="admin-dashboard admin-report-requests-page">

      <SEO
        title="Requested Insights — School Flourish Index"
        description="View School Flourish Index insight requests."
        url="/admin/requested-insights"
        noIndex
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-mark">
            SFI
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
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            className="admin-nav-item"
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
            <BarChart3 size={18} />
            <span>Results</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/reports")
            }
          >
            <FileText size={18} />
            <span>Insights / Reports</span>
          </button>

          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate("/admin/requested-insights")
            }
          >
            <Inbox size={18} />
            <span>Requested Insights</span>
          </button>

          <div className="admin-nav-divider" />

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <Eye size={18} />
            <span>Public Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/settings")
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

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main admin-report-requests-main">

        <header className="reports-hero">

          <div className="reports-hero-copy">

            <div className="reports-kicker">
              REQUESTED INSIGHTS
            </div>

            <h1>
              Insight requests
            </h1>

            <p>
              View respondents who have requested
              their School Flourish Index insights.
            </p>

          </div>

          <div className="reports-hero-icon">
            <Inbox size={30} />
          </div>

        </header>


        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <section className="report-request-summary">

          <div className="report-request-stat">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="report-request-stat">
            <span>Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>

        </section>


        {/* =====================================================
            REQUEST LIST
        ===================================================== */}

        <section className="report-requests-card">

          <div className="report-requests-card-header">

            <div>
              <span className="generator-label">
                INBOX
              </span>

              <h2>
                Recent requests
              </h2>
            </div>

            <button
              type="button"
              className="report-request-refresh"
              onClick={loadRequests}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>


          {error && (
            <div className="report-request-error">
              {error}
            </div>
          )}


          {loading ? (
            <div className="report-request-empty">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (

            <div className="report-request-empty">
              No insight requests have been received yet.
            </div>

          ) : (

            <div className="report-request-table-wrapper">

              <table className="report-request-table">

                <thead>
                  <tr>
                    <th>Email</th>
                    <th>WhatsApp</th>
                    <th>Perspective</th>
                    <th>Status</th>
                    <th>Requested</th>
                  </tr>
                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr key={request.id}>

                      <td>
                        <strong>
                          {request.email}
                        </strong>
                      </td>

                      <td>
                        {request.whatsapp}
                      </td>

                      <td>
                        <span className="report-request-role">
                          {formatRole(request.role)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`report-request-status report-request-status-${request.status}`}
                        >
                          {formatRole(request.status)}
                        </span>
                      </td>

                      <td>
                        {formatDate(request.created_at)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminReportRequests;