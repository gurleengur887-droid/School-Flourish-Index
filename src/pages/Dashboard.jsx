import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Users,
  Sparkles,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PublicStrengthsSection from "../components/PublicStrengthsSection";
import "../styles/dashboard.css";
import SEO from "../components/SEO";

const DEFAULT_SETTINGS = {
  is_enabled: true,
  show_collective_insights: true,
  show_region_insights: true,
  show_perspective_distribution: true,
  show_participation_count: true,
  show_my_insights: true,
 
};

const DEFAULT_INSIGHTS = {
  total_responses: 0,
  regions: [],
  cities: [],
  perspectives: [],
  public_dimensions: [],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [insights, setInsights] = useState(DEFAULT_INSIGHTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [settingsResult, insightsResult] = await Promise.all([
        supabase
          .from("public_dashboard_settings")
          .select("*")
          .limit(1)
          .single(),

        supabase.rpc("get_public_dashboard_insights"),
      ]);

      if (settingsResult.error) {
        console.error(
          "Unable to load public dashboard settings:",
          settingsResult.error
        );
      } else if (settingsResult.data) {
        setSettings({
          is_enabled:
            settingsResult.data.is_enabled ??
            DEFAULT_SETTINGS.is_enabled,

          show_collective_insights:
            settingsResult.data.show_collective_insights ??
            DEFAULT_SETTINGS.show_collective_insights,

          show_region_insights:
            settingsResult.data.show_region_insights ??
            DEFAULT_SETTINGS.show_region_insights,

          show_perspective_distribution:
            settingsResult.data.show_perspective_distribution ??
            DEFAULT_SETTINGS.show_perspective_distribution,

          show_participation_count:
            settingsResult.data.show_participation_count ??
            DEFAULT_SETTINGS.show_participation_count,

          show_my_insights:
            settingsResult.data.show_my_insights ??
            DEFAULT_SETTINGS.show_my_insights,

        });
      }

      if (insightsResult.error) {
        console.error(
          "Unable to load public dashboard insights:",
          insightsResult.error
        );
      } else if (insightsResult.data) {
       setInsights({
  total_responses:
    insightsResult.data.total_responses ?? 0,

  regions:
    Array.isArray(insightsResult.data.regions)
      ? insightsResult.data.regions
      : [],

  cities:
    Array.isArray(insightsResult.data.cities)
      ? insightsResult.data.cities
      : [],

  perspectives:
    Array.isArray(insightsResult.data.perspectives)
      ? insightsResult.data.perspectives
      : [],

  public_dimensions:
    Array.isArray(insightsResult.data.public_dimensions)
      ? insightsResult.data.public_dimensions
      : [],
});
      }
    } catch (error) {
      console.error(
        "Unexpected error loading public dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getPerspectiveCount = (name) => {
    const item = insights.perspectives.find(
      (perspective) =>
        perspective.name?.toLowerCase() === name.toLowerCase()
    );

    return item?.response_count ?? 0;
  };

  const getPercentage = (count) => {
    if (!insights.total_responses) return 0;

    return Math.round(
      (count / insights.total_responses) * 100
    );
  };

  const largestRegion =
    insights.regions.length > 0
      ? insights.regions[0]
      : null;

  const leadingPerspective =
    insights.perspectives.length > 0
      ? insights.perspectives[0]
      : null;

  if (loading) {
    return (
      <main className="public-dashboard-page">
        <div className="public-dashboard-loading">
          Loading insights...
        </div>
      </main>
    );
  }

  if (!settings.is_enabled) {
    return (
      <main className="public-dashboard-page">
        <section className="public-dashboard-disabled">

          <div className="public-dashboard-disabled-icon">
            <ShieldCheck size={24} />
          </div>

          <span className="public-eyebrow">
            SCHOOL FLOURISH INDEX
          </span>

          <h1>
            Insights are currently unavailable.
          </h1>

          <p>
            The public dashboard has temporarily been
            disabled by the administration.
          </p>

        </section>
      </main>
    );
  }

  return (
    <main className="public-dashboard-page">
<SEO
  title="School Flourish Index — Collective Insights"
  description="Explore the collective picture of flourishing in education through participation, perspectives and emerging insights from the School Flourish Index."
  url="/dashboard"
/>
      {/* =========================================
          HERO
      ========================================= */}

      <section className="public-dashboard-hero">

        <div className="public-dashboard-hero-inner">

          <div className="public-eyebrow">
            SCHOOL FLOURISH INDEX
          </div>

          <h1>
            A Clear picture of how
            <br />
            <em>schools are flourishing.</em>
          </h1>

          <p>
            Every voice adds another perspective to our
            understanding of wellbeing and flourishing
            in education.
          </p>

          <div className="public-dashboard-hero-actions">

            <button
              className="public-primary-button"
              onClick={() =>
                (window.location.href = "/surveys")
              }
            >
              Share Your Voice
              <ArrowRight size={16} />
            </button>

            <span>
              {insights.total_responses > 0
                ? `${insights.total_responses} voices are already contributing.`
                : "Be one of the first voices to contribute."}
            </span>

          </div>

        </div>

      </section>


   {/* =========================================
    YOUR INSIGHTS
========================================= */}

{settings.show_my_insights && (
  <section className="public-dashboard-my-insights">
    <div className="public-dashboard-container">

      <div className="public-my-insights-card">

        <div className="public-my-insights-icon">
          <Sparkles size={21} />
        </div>

        <div className="public-my-insights-content">

          <span className="public-card-eyebrow">
            YOUR INSIGHTS
          </span>

          <h2>
            Your voice. Your journey.
          </h2>

          <p>
            Want to understand what your responses reveal?
            Connect with us to explore your individual insights
            and learn more about your experience.
          </p>

        </div>

        <div className="public-my-insights-action">
          <button
            type="button"
            className="public-insights-view-button"
            onClick={() => navigate("/insights-access")}
          >
            View Insights
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  </section>
)}


      {/* =========================================
          THE COLLECTIVE PICTURE
      ========================================= */}

      {settings.show_collective_insights && (
        <section className="public-pulse-section">

          <div className="public-dashboard-container">

            <div className="public-section-heading">

              <div>

                <span className="public-card-eyebrow">
                  THE COLLECTIVE PICTURE
                </span>

                <h2>
                  A growing view of the voices shaping SFI.
                </h2>

              </div>

              <p>
                Every response adds another perspective
                to the picture of flourishing in education.
              </p>

            </div>


            <div className="public-pulse-grid">

              {settings.show_participation_count && (
                <div className="public-pulse-card public-pulse-card-large">

                  <div className="public-pulse-icon">
                    <Users size={21} />
                  </div>

                  <div className="public-pulse-content">

                    <span>
                      TOTAL RESPONSES
                    </span>

                    <strong>
                      {insights.total_responses}
                    </strong>

                    <p>
                      voices contributing to the
                      collective picture
                    </p>

                  </div>

                </div>
              )}


              <div className="public-pulse-card">

                <div className="public-pulse-icon">
                  <Globe2 size={20} />
                </div>

                <div className="public-pulse-content">

                  <span>
                    REGIONS CONTRIBUTING
                  </span>

                  <strong>
                    {insights.regions.length}
                  </strong>

                  <p>
                    regions with responses
                  </p>

                </div>

              </div>


              <div className="public-pulse-card">

                <div className="public-pulse-icon">
                  <MapPin size={20} />
                </div>

                <div className="public-pulse-content">

                  <span>
                    CITY PARTICIPATION
                  </span>

                  <strong>
                    {insights.cities.length}
                  </strong>

                  <p>
                    cities with responses
                  </p>

                </div>

              </div>


              <div className="public-pulse-card">

                <div className="public-pulse-icon">
                  <BarChart3 size={20} />
                </div>

                <div className="public-pulse-content">

                  <span>
                    LEADING PERSPECTIVE
                  </span>

                  <strong>
                    {leadingPerspective
                      ? leadingPerspective.response_count
                      : "—"}
                  </strong>

                  <p>
                    {leadingPerspective
                      ? `${leadingPerspective.name} responses`
                      : "Waiting for responses"}
                  </p>

                </div>

              </div>

            </div>


            {largestRegion && (
              <div className="public-featured-stat">

                <div className="public-featured-stat-label">
                  <Globe2 size={17} />
                  <span>
                    LARGEST PARTICIPATING REGION
                  </span>
                </div>

                <div className="public-featured-stat-main">

                  <strong>
                    {largestRegion.name}
                  </strong>

                  <span>
                    {largestRegion.response_count} responses
                  </span>

                </div>

              </div>
            )}

          </div>

        </section>
      )}
{/* =========================================
    WHERE SCHOOLS ARE STRONGEST
========================================= */}

{settings.show_collective_insights && (
  <PublicStrengthsSection
    dimensions={insights.public_dimensions}
  />
)}

      {/* =========================================
          WHERE VOICES ARE COMING FROM
      ========================================= */}

      {settings.show_collective_insights && (
        <section className="public-dashboard-data-section">

          <div className="public-dashboard-container">

            <div className="public-section-heading public-section-heading-centered">

              <span className="public-card-eyebrow">
                WHERE VOICES ARE COMING FROM
              </span>

              <h2>
                Participation across places.
              </h2>

              <p>
                See where people are contributing to
                the growing collective picture.
              </p>

            </div>


            <div className="public-location-grid">

              {/* =====================================
                  REGIONS
              ===================================== */}

              {settings.show_region_insights && (
                <div className="public-data-card">

                  <div className="public-data-card-header">

                    <div className="public-data-card-title">

                      <div className="public-panel-icon">
                        <Globe2 size={18} />
                      </div>

                      <div>

                        <span>
                          REGIONAL PARTICIPATION
                        </span>

                        <h3>
                          A growing map of voices.
                        </h3>

                      </div>

                    </div>

                  </div>


                  <div className="public-bars">

                    {insights.regions.length > 0 ? (
                      insights.regions.map((region) => {

                        const percentage =
                          getPercentage(
                            region.response_count
                          );

                        return (
                          <div
                            className="public-bar-row"
                            key={region.name}
                          >

                            <div className="public-bar-meta">

                              <span>
                                {region.name}
                              </span>

                              <strong>
                                {region.response_count}
                              </strong>

                            </div>

                            <div className="public-bar-track">

                              <div
                                className="public-bar-fill"
                                style={{
                                  width: `${Math.max(
                                    percentage,
                                    2
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>
                        );
                      })
                    ) : (
                      <div className="public-no-data">
                        Regional participation will
                        appear here as responses arrive.
                      </div>
                    )}

                  </div>

                </div>
              )}


              {/* =====================================
                  CITIES
              ===================================== */}

              {settings.show_region_insights && (
                <div className="public-data-card">

                  <div className="public-data-card-header">

                    <div className="public-data-card-title">

                      <div className="public-panel-icon">
                        <MapPin size={18} />
                      </div>

                      <div>

                        <span>
                          CITY PARTICIPATION
                        </span>

                        <h3>
                          Where the most voices are coming from.
                        </h3>

                      </div>

                    </div>

                  </div>


                  <div className="public-city-list">

                    {insights.cities.length > 0 ? (
                      insights.cities.map(
                        (city, index) => {

                          const percentage =
                            getPercentage(
                              city.response_count
                            );

                          return (
                            <div
                              className="public-city-row"
                              key={`${city.name}-${city.state}`}
                            >

                              <div className="public-city-rank">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div className="public-city-main">

                                <div className="public-city-meta">

                                  <div>

                                    <strong>
                                      {city.name}
                                    </strong>

                                    {city.state && (
                                      <span>
                                        {city.state}
                                      </span>
                                    )}

                                  </div>

                                  <strong>
                                    {city.response_count}
                                  </strong>

                                </div>

                                <div className="public-city-track">

                                  <div
                                    className="public-city-fill"
                                    style={{
                                      width: `${Math.max(
                                        percentage,
                                        2
                                      )}%`,
                                    }}
                                  />

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="public-no-data">
                        City participation will appear
                        here as more people contribute.
                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </section>
        
      )}


      {/* =========================================
          WHO IS BEING HEARD?
      ========================================= */}

      {settings.show_collective_insights &&
        settings.show_perspective_distribution && (
          <section className="public-perspectives-section">

            <div className="public-dashboard-container">

              <div className="public-section-heading">

                <div>

                  <span className="public-card-eyebrow">
                    WHO IS BEING HEARD?
                  </span>

                  <h2>
                    Different voices, one collective picture.
                  </h2>

                </div>

                <p>
                  A richer picture of flourishing begins
                  with hearing from different perspectives.
                </p>

              </div>


              <div className="public-perspective-grid">

                {[
                  "Teacher",
                  "Parent",
                  "Student",
                  "Leader",
                ].map((perspective) => {

                  const count =
                    getPerspectiveCount(
                      perspective
                    );

                  const percentage =
                    getPercentage(count);

                  return (
                    <div
                      className="public-perspective-card"
                      key={perspective}
                    >

                      <div className="public-perspective-top">

                        <div className="public-perspective-dot" />

                        <span>
                          {perspective}
                        </span>

                      </div>


                      <div className="public-perspective-number">
                        {count > 0 ? count : "—"}
                      </div>


                      <div className="public-perspective-bottom">

                        <span>
                          {count > 0
                            ? `${percentage}% of responses`
                            : "Awaiting responses"}
                        </span>

                      </div>


                      <div className="public-perspective-track">

                        <div
                          className="public-perspective-fill"
                          style={{
                            width: `${Math.max(
                              percentage,
                              count > 0 ? 2 : 0
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>
        )}


      {/* =========================================
          PRIVACY
      ========================================= */}

      <section className="public-dashboard-privacy">

        <div className="public-dashboard-container">

          <div className="public-privacy-note">

            <div className="public-privacy-icon">
              <ShieldCheck size={18} />
            </div>

            <div>

              <strong>
                Your voice stays yours.
              </strong>

              <p>
                Public insights show collective patterns
                without exposing individual responses or
                school-specific information.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="public-dashboard-cta">

        <div className="public-dashboard-container">

          <span className="public-eyebrow">
            BE PART OF THE PICTURE
          </span>

          <h2>
            Haven't shared your perspective yet?
          </h2>

          <p>
            Your experience can help make the collective
            picture more meaningful.
          </p>

          <button
  className="public-cta-start-button"
  onClick={() =>
    (window.location.href = "/surveys")
  }
>
  Start a Survey
  <ArrowRight size={16} />
</button>

        </div>

      </section>

    </main>
  );
}