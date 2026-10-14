import React, { useRef, useState } from "react";
import "../styles/badge.css";
import { supabase } from "../lib/supabase";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

/* =========================================================
   BADGE TEMPLATES
   Database roles remain unchanged:
   teacher, leader, parent, student
========================================================= */

const BADGE_TEMPLATES = {
  teacher: {
    image: "/assets/educator_badge.jpeg",
    alt: "SFI Educator Participation Badge",

    namePosition: {
      x: 0.5,
      y: 0.515,
      color: "#263d35",
      fontSize: 42,
      maxWidth: 0.8,
    },
  },

  leader: {
    image: "/assets/leader_badge.jpeg",
    alt: "SFI School Leader Participation Badge",

    namePosition: {
      x: 0.5,
      y: 0.515,
      color: "#263d35",
      fontSize: 42,
      maxWidth: 0.8,
    },
  },

  parent: {
    image: "/assets/parent_badge.jpeg",
    alt: "SFI Parent Participation Badge",

  namePosition: {
  x: 0.5,
  y: 0.32,
  color: "#263d35",
  fontSize: 52,
  maxWidth: 0.65,
},
  },

  student: {
    image: "/assets/student_badge.jpeg",
    alt: "SFI Student Participation Badge",

   namePosition: {
  x: 0.5,
  y: 0.32,
  color: "#263d35",
  fontSize: 52,
  maxWidth: 0.65,
},
  },
};

/* =========================================================
   HELPERS
========================================================= */

const normalizeRole = (role) => {
  return String(role || "").trim().toLowerCase();
};

const safeFilename = (name) => {
  return (
    String(name || "SFI")
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "SFI"
  );
};

/* =========================================================
   BADGE COMPONENT
========================================================= */

const Badge = () => {
  const [email, setEmail] = useState("");
  const [badgeData, setBadgeData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");
  const [downloading, setDownloading] = useState(false);

  const badgeRef = useRef(null);
  const downloadMessageTimer = useRef(null);

  /* =======================================================
     INSIGHTS REQUEST STATE
  ======================================================= */

  const [insightForm, setInsightForm] = useState({
    email: "",
    whatsapp: "",
    role: "",
  });

  const [insightLoading, setInsightLoading] = useState(false);
  const [insightMessage, setInsightMessage] = useState("");
  const [insightError, setInsightError] = useState("");

  /* =======================================================
     FIND BADGE
  ======================================================= */

  const findBadge = async (e) => {
    e.preventDefault();

    setError("");
    setBadgeData(null);
    setDownloadMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("badge-lookup", {
          body: {
            email: cleanEmail,
          },
        });

      if (functionError) {
        console.error("Badge function error:", functionError);

        throw new Error(
          functionError.message || "Failed to fetch your badge."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "We couldn't find your SFI response."
        );
      }

      if (!data.badge?.name) {
        throw new Error(
          "Your response was found, but your name could not be retrieved."
        );
      }

      const role = normalizeRole(data.badge.role);

      if (!role) {
        throw new Error("We couldn't identify your survey role.");
      }

      if (!BADGE_TEMPLATES[role]) {
        throw new Error(
          "We couldn't identify a supported SFI badge for your survey role."
        );
      }

      setBadgeData({
        ...data.badge,
        name: String(data.badge.name).trim(),
        role,
      });
    } catch (err) {
      console.error("Badge lookup error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     DOWNLOAD BADGE
  ======================================================= */

  const downloadBadge = async () => {
    if (!badgeData || downloading) return;

    const template = BADGE_TEMPLATES[badgeData.role];

    if (!template) {
      setError("The badge template could not be found.");
      return;
    }

    setError("");
    setDownloadMessage("");
    setDownloading(true);

    try {
      const image = new Image();

      image.src = template.image;

      await new Promise((resolve, reject) => {
        image.onload = resolve;

        image.onerror = () => {
          reject(
            new Error(
              "Unable to load your badge template. Please check the image filename."
            )
          );
        };
      });

      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to prepare your badge for download.");
      }

      /* Draw the original badge design. */
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      /* ================================================
         DRAW RESPONDENT NAME
      ================================================ */

      const position = template.namePosition;
      const name = badgeData.name.toUpperCase();

      const x = canvas.width * position.x;
      const y = canvas.height * position.y;

      const maxWidth = canvas.width * position.maxWidth;

      let fontSize = position.fontSize;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = position.color;

      /* Reduce font size for longer names. */
      ctx.font = `700 ${fontSize}px Arial, sans-serif`;

      while (
        ctx.measureText(name).width > maxWidth &&
        fontSize > 14
      ) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px Arial, sans-serif`;
      }

      ctx.fillText(name, x, y, maxWidth);

      /* ================================================
         CREATE DOWNLOAD
      ================================================ */

      const link = document.createElement("a");

      link.download = `${safeFilename(
        badgeData.name
      )}-SFI-${badgeData.role}-Badge.png`;

      link.href = canvas.toDataURL("image/png");

      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloadMessage(
        "Your SFI badge has been downloaded successfully!"
      );

      if (downloadMessageTimer.current) {
        clearTimeout(downloadMessageTimer.current);
      }

      downloadMessageTimer.current = setTimeout(() => {
        setDownloadMessage("");
      }, 4000);
    } catch (err) {
      console.error("Badge download error:", err);

      setError(
        err.message || "Unable to download your badge. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  /* =======================================================
     REQUEST INSIGHTS
  ======================================================= */

  const requestInsights = async (e) => {
    e.preventDefault();

    setInsightMessage("");
    setInsightError("");

    const cleanEmail = insightForm.email.trim().toLowerCase();
    const cleanWhatsapp = insightForm.whatsapp.trim();
    const cleanRole = normalizeRole(insightForm.role);

    if (!cleanEmail) {
      setInsightError(
        "Please enter the email you used for the SFI survey."
      );
      return;
    }

    if (!cleanWhatsapp) {
      setInsightError("Please enter your WhatsApp number.");
      return;
    }

    if (!cleanRole) {
      setInsightError("Please select the perspective you completed.");
      return;
    }

    setInsightLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("report_requests")
        .insert({
          email: cleanEmail,
          whatsapp: cleanWhatsapp,
          role: cleanRole,
          status: "pending",
        });

      if (insertError) {
        console.error("Insight request error:", insertError);

        throw new Error(
          insertError.message ||
            "Unable to submit your insight request."
        );
      }

      setInsightMessage(
        "Your request has been received. We'll prepare your SFI insights and send them to you."
      );

      setInsightForm({
        email: "",
        whatsapp: "",
        role: "",
      });
    } catch (err) {
      console.error("Insight request submission failed:", err);

      setInsightError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setInsightLoading(false);
    }
  };

  /* =======================================================
     RESET / SEARCH AGAIN
  ======================================================= */

  const searchAgain = () => {
    setBadgeData(null);
    setEmail("");
    setError("");
    setDownloadMessage("");
  };

  /* =======================================================
     ACTIVE TEMPLATE
  ======================================================= */

  const badgeTemplate = badgeData
    ? BADGE_TEMPLATES[badgeData.role]
    : null;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="badge-page">
      <section className="badge-container">

        {/* ===============================================
            EMAIL / INTRO
        =============================================== */}

        {!badgeData && (
          <div className="badge-intro">
            <span className="badge-eyebrow">
              SCHOOL FLOURISH INDEX
            </span>

            <h1>Get Your SFI Badge</h1>

            <p>
              Enter the email address you used while completing
              the SFI survey to access your personalized badge.
            </p>

            <form onSubmit={findBadge} className="badge-form">
              <label htmlFor="badge-email">
                Email Address
              </label>

              <input
                id="badge-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? "Finding Your Badge..."
                  : "See My Badge"}
              </button>
            </form>

            {error && (
              <div className="badge-error" role="alert">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ===============================================
            BADGE RESULT
        =============================================== */}

        {badgeData && badgeTemplate && (
          <div className="badge-result">

            {/* BADGE HEADING */}

            <div className="badge-heading">
              <span className="badge-eyebrow">
                YOUR BADGE IS READY
              </span>

              <h1>
                Thank you, {badgeData.name.split(" ")[0]}!
              </h1>

              <p>
                Your SFI Survey 2026 participation badge is ready
                to download.
              </p>
            </div>

            {/* BADGE PREVIEW */}

            <div className="badge-preview-wrapper">
              <div
                className={`badge-preview badge-preview-${badgeData.role}`}
                ref={badgeRef}
              >
                <img
                  src={badgeTemplate.image}
                  alt={badgeTemplate.alt}
                />

                <div className="badge-name">
                  {badgeData.name}
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="badge-actions">
              <button
                type="button"
                className="download-badge-btn"
                onClick={downloadBadge}
                disabled={downloading}
              >
                {downloading
                  ? "Preparing Your Badge..."
                  : "Download My Badge"}
              </button>

              <button
                type="button"
                className="back-badge-btn"
                onClick={searchAgain}
              >
                Search Again
              </button>
            </div>

            {error && (
              <div className="badge-error" role="alert">
                {error}
              </div>
            )}

            {downloadMessage && (
              <div
                className="badge-download-success"
                role="status"
              >
                {downloadMessage}
              </div>
            )}

            {/* ==========================================
                SOCIAL + INSIGHTS
            ========================================== */}

            <div className="badge-bottom-grid">

              {/* SOCIAL / SHARE BADGE */}

              <div className="badge-social">
                <span className="badge-social-eyebrow">
                  FLAUNT YOUR BADGE
                </span>

                <h2>Share your SFI journey</h2>

                <p>
                  Proud to be part of the School Flourish Index?
                  Share your badge and let your network know.
                </p>

                <div className="badge-social-links">
                  <a
                    href="https://www.instagram.com/skillsphereflourish?igsi=NHhudWV0amNiMjl3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge-social-icon"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>

                  <a
                    href="YOUR_LINKEDIN_LINK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge-social-icon"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>

                <p className="badge-tag-text">
                  Tag us when you share your badge 💚
                </p>
              </div>

              {/* REQUEST INSIGHTS */}

              <div className="badge-insights">
                <span className="badge-insights-eyebrow">
                  YOUR SFI INSIGHTS
                </span>

                <h2>Request your insights</h2>

                <p>
                  Want to see what your SFI responses reveal?
                  Share the details below and we'll prepare your
                  personalised report.
                </p>

                <form
                  className="badge-insights-form"
                  onSubmit={requestInsights}
                >
                  <div className="badge-insights-field">
                    <label htmlFor="insight-email">
                      Survey Email
                    </label>

                    <input
                      id="insight-email"
                      type="email"
                      placeholder="Email used for the SFI survey"
                      value={insightForm.email}
                      onChange={(e) =>
                        setInsightForm({
                          ...insightForm,
                          email: e.target.value,
                        })
                      }
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="badge-insights-field">
                    <label htmlFor="insight-whatsapp">
                      WhatsApp Number
                    </label>

                    <input
                      id="insight-whatsapp"
                      type="tel"
                      placeholder="Enter your WhatsApp number"
                      value={insightForm.whatsapp}
                      onChange={(e) =>
                        setInsightForm({
                          ...insightForm,
                          whatsapp: e.target.value,
                        })
                      }
                      inputMode="tel"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="badge-insights-field">
                    <label htmlFor="insight-role">
                      Your Voice
                    </label>

                    <select
                      id="insight-role"
                      value={insightForm.role}
                      onChange={(e) =>
                        setInsightForm({
                          ...insightForm,
                          role: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">
                        Select your Voice
                      </option>

                      <option value="teacher">
                        Educator
                      </option>

                      <option value="leader">
                        Leader
                      </option>

                      <option value="parent">
                        Parent
                      </option>

                      <option value="student">
                        Student
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="badge-insights-btn"
                    disabled={insightLoading}
                  >
                    {insightLoading
                      ? "Submitting Request..."
                      : "Request My Insights"}
                  </button>
                </form>

                {insightError && (
                  <div
                    className="badge-insights-error"
                    role="alert"
                  >
                    {insightError}
                  </div>
                )}

                {insightMessage && (
                  <div
                    className="badge-insights-success"
                    role="status"
                  >
                    {insightMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Badge;