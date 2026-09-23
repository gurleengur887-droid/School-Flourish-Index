import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  School,
  ClipboardList,
  BarChart3,
  Eye,
  Settings,
  Globe2,
  Users,
  Save,
  Sparkles,
    FileText,
    Inbox,
} from "lucide-react";

import SEO from "../components/SEO";
import { supabase } from "../lib/supabase";

import "../styles/admin_dashboard.css";

/* =========================================
   DEFAULT SETTINGS
========================================= */

const DEFAULT_SETTINGS = {
  is_enabled: true,

  show_collective_insights: true,
  show_region_insights: true,
  show_perspective_distribution: true,
  show_participation_count: true,
  show_my_insights: true,


};


/* =========================================
   ADMIN SETTINGS
========================================= */

export default function AdminSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  /* =========================================
     LOAD SETTINGS
  ========================================= */

  useEffect(() => {
    loadSettings();
  }, []);


  const loadSettings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("public_dashboard_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error loading settings:", error);

      setMessage("Unable to load settings.");
      setLoading(false);

      return;
    }

    if (data) {
      setSettings({
        is_enabled:
          data.is_enabled ??
          DEFAULT_SETTINGS.is_enabled,

        show_collective_insights:
          data.show_collective_insights ??
          DEFAULT_SETTINGS.show_collective_insights,

        show_region_insights:
          data.show_region_insights ??
          DEFAULT_SETTINGS.show_region_insights,

        show_perspective_distribution:
          data.show_perspective_distribution ??
          DEFAULT_SETTINGS.show_perspective_distribution,

        show_participation_count:
          data.show_participation_count ??
          DEFAULT_SETTINGS.show_participation_count,

        show_my_insights:
          data.show_my_insights ??
          DEFAULT_SETTINGS.show_my_insights,

       
      });
    }

    setLoading(false);
  };


  /* =========================================
     UPDATE LOCAL SETTING
  ========================================= */

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  };


  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");

   

    const { data: existingRow, error: fetchError } =
      await supabase
        .from("public_dashboard_settings")
        .select("id")
        .limit(1)
        .single();

    if (fetchError || !existingRow) {
      console.error(fetchError);

      setMessage("Unable to save settings.");
      setSaving(false);

      return;
    }


    const { error } = await supabase
      .from("public_dashboard_settings")
      .update({
        is_enabled: settings.is_enabled,

        show_collective_insights:
          settings.show_collective_insights,

        show_region_insights:
          settings.show_region_insights,

        show_perspective_distribution:
          settings.show_perspective_distribution,

        show_participation_count:
          settings.show_participation_count,

        show_my_insights:
          settings.show_my_insights,

       

        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRow.id);


    if (error) {
      console.error(error);

      setMessage("Unable to save settings.");
      setSaving(false);

      return;
    }


    
    setMessage("Settings saved successfully.");
    setSaving(false);
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="admin-dashboard">

        <AdminSidebar navigate={navigate} />

        <main className="admin-main">

          <div className="admin-loading">
            Loading settings...
          </div>

        </main>

      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="admin-dashboard">

      <SEO
        title="Admin Settings — School Flourish Index"
        description="Manage School Flourish Index public dashboard settings."
        url="/admin/settings"
        noIndex
      />

      <AdminSidebar navigate={navigate} />


      <main className="admin-main">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="admin-header admin-settings-header">

          <div>

            <div className="admin-eyebrow">
              ADMINISTRATION
            </div>

            <h1>
              Settings
            </h1>

            <p className="admin-header-description">
              Control what appears on the public dashboard.
            </p>

          </div>


          <button
            className="admin-settings-save"
            onClick={saveSettings}
            disabled={saving}
          >

            <Save size={15} />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>


        {/* =====================================
            SAVE MESSAGE
        ===================================== */}

        {message && (
          <div className="admin-settings-message">
            {message}
          </div>
        )}


        {/* =====================================
            PUBLIC DASHBOARD
        ===================================== */}

        <section className="admin-panel admin-settings-panel">

          <div className="admin-panel-header">

            <span className="admin-panel-label">
              PUBLIC EXPERIENCE
            </span>

            <h3>
              Public Dashboard
            </h3>

            <p className="admin-settings-section-description">
              Control which parts of the public dashboard
              are visible to visitors.
            </p>

          </div>


          {/* MASTER SWITCH */}

          <SettingToggle
            icon={<Globe2 size={17} />}
            title="Public Dashboard"
            description="Enable or disable the entire public dashboard."
            checked={settings.is_enabled}
            onChange={(value) =>
              updateSetting("is_enabled", value)
            }
          />


          {/* COLLECTIVE */}

          <SettingToggle
            icon={<BarChart3 size={17} />}
            title="Collective Insights"
            description="Show the main collective picture and aggregated insights."
            checked={settings.show_collective_insights}
            onChange={(value) =>
              updateSetting(
                "show_collective_insights",
                value
              )
            }
          />


          {/* REGION */}

          <SettingToggle
            icon={<Globe2 size={17} />}
            title="Region-wise Insights"
            description="Show regional and city participation information."
            checked={settings.show_region_insights}
            onChange={(value) =>
              updateSetting(
                "show_region_insights",
                value
              )
            }
          />


          {/* PERSPECTIVES */}

          <SettingToggle
            icon={<Users size={17} />}
            title="Perspective Distribution"
            description="Show Teacher, Parent, Student and Leader participation."
            checked={
              settings.show_perspective_distribution
            }
            onChange={(value) =>
              updateSetting(
                "show_perspective_distribution",
                value
              )
            }
          />


          {/* PARTICIPATION */}

          <SettingToggle
            icon={<Users size={17} />}
            title="Participation Count"
            description="Show the total number of community responses."
            checked={
              settings.show_participation_count
            }
            onChange={(value) =>
              updateSetting(
                "show_participation_count",
                value
              )
            }
          />


          {/* MY INSIGHTS */}

          <SettingToggle
            icon={<Sparkles size={17} />}
            title="My Insights"
            description="Allow respondents to access their individual insights."
            checked={settings.show_my_insights}
            onChange={(value) =>
              updateSetting(
                "show_my_insights",
                value
              )
            }
          />

        </section>


        
       
        {/* =====================================
            CONTROL SUMMARY
        ===================================== */}

        <section className="admin-panel admin-settings-panel">

          <div className="admin-panel-header">

            <span className="admin-panel-label">
              CURRENT PUBLIC EXPERIENCE
            </span>

            <h3>
              Dashboard Visibility
            </h3>

            <p className="admin-settings-section-description">
              Quick overview of what visitors will currently see.
            </p>

          </div>


          <div className="admin-settings-summary">

            <SummaryItem
              label="Public Dashboard"
              enabled={settings.is_enabled}
            />

            <SummaryItem
              label="Collective Insights"
              enabled={
                settings.show_collective_insights
              }
            />

            <SummaryItem
              label="Region Insights"
              enabled={
                settings.show_region_insights
              }
            />

            <SummaryItem
              label="Perspective Distribution"
              enabled={
                settings.show_perspective_distribution
              }
            />

            <SummaryItem
              label="Participation Count"
              enabled={
                settings.show_participation_count
              }
            />

            <SummaryItem
              label="My Insights"
              enabled={
                settings.show_my_insights
              }
            />

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================
   SIDEBAR
========================================= */

function AdminSidebar({ navigate }) {

  return (
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
          onClick={() =>
            navigate("/admin")
          }
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
    (window.location.href = "/admin/reports")
  }
>
  <FileText size={18} />
  <span>Insights / Reports</span>
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
          <span>Public Dashboard</span>
        </button>


        <button
          className="admin-nav-item active"
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
  );
}


/* =========================================
   TOGGLE
========================================= */

function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}) {

  return (
    <div className="admin-setting-row">

      <div className="admin-setting-info">

        <div className="admin-setting-icon">
          {icon}
        </div>


        <div>

          <h4>
            {title}
          </h4>

          <p>
            {description}
          </p>

        </div>

      </div>


      <button
        type="button"
        className={`admin-toggle ${
          checked ? "active" : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
        aria-pressed={checked}
      >

        <span />

      </button>

    </div>
  );
}


/* =========================================
   SUMMARY ITEM
========================================= */

function SummaryItem({
  label,
  enabled,
}) {

  return (
    <div className="admin-settings-summary-item">

      <div>

        <span>
          {label}
        </span>

      </div>


      <strong
        className={
          enabled
            ? "admin-setting-status enabled"
            : "admin-setting-status disabled"
        }
      >
        {enabled
          ? "VISIBLE"
          : "HIDDEN"}
      </strong>

    </div>
  );
}