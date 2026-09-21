import React, { useRef, useState } from "react";
import "../styles/badge.css";
import { supabase } from "../lib/supabase";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
/*
 * =========================================================
 * TEACHER + LEADER BADGE
 * =========================================================
 */

const BADGE_TEMPLATES = {
  teacher: {
    image: "/assets/teacher_leader_badge.jpeg",
    alt: "SFI Teacher Participation Badge",
  },

  leader: {
    image: "/assets/teacher_leader_badge.jpeg",
    alt: "SFI School Leader Participation Badge",
  },

  parent: {
    image: "/assets/student_parent_badge.png",
    alt: "SFI Parent Participation Badge",
  },

  student: {
    image: "/assets/student_parent_badge.png",
    alt: "SFI Student Participation Badge",
  },
};
const Badge = () => {
  const [email, setEmail] = useState("");
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [downloadMessage, setDownloadMessage] = useState("");
  const badgeRef = useRef(null);
const [insightForm, setInsightForm] = useState({
  email: "",
  whatsapp: "",
  role: "",
});

const [insightLoading, setInsightLoading] = useState(false);
const [insightMessage, setInsightMessage] = useState("");
const [insightError, setInsightError] = useState("");
  /*
   * =========================================================
   * FIND BADGE
   * =========================================================
   */

  const findBadge = async (e) => {
    e.preventDefault();

    setError("");
    setBadgeData(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke(
          "badge-lookup",
          {
            body: {
              email: cleanEmail,
            },
          }
        );

      if (functionError) {
        console.error(
          "Badge function error:",
          functionError
        );

        throw new Error(
          functionError.message ||
            "Failed to fetch your badge."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "We couldn't find your SFI response."
        );
      }

      if (!data.badge?.name) {
        throw new Error(
          "Your response was found, but your name could not be retrieved."
        );
      }

      /*
       * The Edge Function already returns:
       * badge.role
       *
       * This page is currently ONLY for:
       * - teacher
       * - leader
       */

      const role = data.badge.role
        ?.toString()
        .trim()
        .toLowerCase();

      if (!role) {
        throw new Error(
          "We couldn't identify your survey role."
        );
      }

    if (!BADGE_TEMPLATES[role]) {
  throw new Error(
    "We couldn't identify a supported SFI badge for your survey role."
  );
}

      setBadgeData({
        ...data.badge,
        role,
      });

    } catch (err) {
      console.error(
        "Badge lookup error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * DOWNLOAD BADGE
   * =========================================================
   */

  const downloadBadge = () => {
    if (!badgeData) return;

   const template = BADGE_TEMPLATES[badgeData.role];

if (!template) return;

const image = new Image();
image.src = template.image;
    image.onload = () => {
      const canvas =
        document.createElement("canvas");

      const ctx =
        canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      /*
       * Draw the new Teacher / Leader badge
       */

      ctx.drawImage(
        image,
        0,
        0
      );

      /*
       * =====================================================
       * NAME
       * =====================================================
       *
       * We will fine-tune the position after checking
       * exactly where the name looks best on the new badge.
       */
ctx.textAlign = "center";
ctx.textBaseline = "middle";

const isParentStudent =
  badgeData.role === "parent" ||
  badgeData.role === "student";

if (isParentStudent) {
  // Parent + Student badge
  ctx.fillStyle = "#263d35";
  ctx.font = "700 50px Arial, sans-serif";

  ctx.fillText(
    badgeData.name.toUpperCase(),
    canvas.width * 0.505,
    canvas.height * 0.32
  );
} else {
  // Teacher + Leader badge
  // KEEP THE ORIGINAL POSITION
  ctx.fillStyle = "#263d35";
  ctx.font = "700 50px Arial, sans-serif";

  ctx.fillText(
    badgeData.name.toUpperCase(),
    canvas.width / 2,
    690
  );
}
      /*
       * =====================================================
       * CREATE DOWNLOAD
       * =====================================================
       */

      const link =
        document.createElement("a");

      link.download =
        `${badgeData.name.replace(
          /[^a-z0-9]/gi,
          "-"
        )}-SFI-Badge.png`;

     link.href =
  canvas.toDataURL("image/png");

link.click();

setDownloadMessage("Your SFI badge has been downloaded successfully!");

setTimeout(() => {
  setDownloadMessage("");
}, 4000);
    };

    image.onerror = () => {
      setError(
        "Unable to load your SFI badge template."
      );
    };
  };
const requestInsights = async (e) => {
  e.preventDefault();

  setInsightMessage("");
  setInsightError("");

  const cleanEmail = insightForm.email.trim().toLowerCase();
  const cleanWhatsapp = insightForm.whatsapp.trim();
  const cleanRole = insightForm.role.trim().toLowerCase();

  if (!cleanEmail) {
    setInsightError("Please enter the email you used for the SFI survey.");
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
   const { error } = await supabase
  .from("report_requests")
  .insert({
    email: cleanEmail,
    whatsapp: cleanWhatsapp,
    role: cleanRole,
    status: "pending",
  });

    if (error) {
      console.error("Insight request error:", error);
      throw new Error(
        error.message || "Unable to submit your insight request."
      );
    }

    setInsightMessage(
      "Your request has been received. We’ll prepare your SFI insights and send them to you."
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
  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const searchAgain = () => {
    setBadgeData(null);
    setEmail("");
    setError("");
  };
const badgeTemplate = badgeData
  ? BADGE_TEMPLATES[badgeData.role]
  : null;
  return (
    <main className="badge-page">

      <section className="badge-container">

        {/* =================================================
            EMAIL / INTRO
        ================================================= */}

        {!badgeData && (
          <div className="badge-intro">

            <span className="badge-eyebrow">
              SCHOOL FLOURISH INDEX
            </span>

            <h1>
              Get Your SFI Badge
            </h1>

            <p>
             Enter the email address you used while
completing the SFI survey to access your
personalized badge.
            </p>

            <form
              onSubmit={findBadge}
              className="badge-form"
            >

              <label htmlFor="badge-email">
                Email Address
              </label>

              <input
                id="badge-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Finding Your Badge..."
                  : "See My Badge"}
              </button>

            </form>

            {error && (
              <div className="badge-error">
                {error}
              </div>
            )}

          </div>
        )}

        {/* =================================================
            BADGE RESULT
        ================================================= */}

        {badgeData && (
          <div className="badge-result">

            <div className="badge-heading">

              <span className="badge-eyebrow">
                YOUR BADGE IS READY
              </span>

              <h1>
                Thank you,{" "}
                {badgeData.name.split(" ")[0]}!
              </h1>

              <p>
                Your SFI Survey 2026 participation
                badge is ready to download.
              </p>

            </div>

            {/* =================================================
                BADGE PREVIEW
            ================================================= */}

            <div className="badge-preview-wrapper">

            <div
  className={`badge-preview ${
    badgeData.role === "parent" || badgeData.role === "student"
      ? "badge-preview-parent-student"
      : ""
  }`}
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

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="badge-actions">

              <button
                className="download-badge-btn"
                onClick={downloadBadge}
              >
                Download My Badge
              </button>

              <button
                className="back-badge-btn"
                onClick={searchAgain}
              >
                Search Again
              </button>

            </div>
{downloadMessage && (
  <div className="badge-download-success">
    {downloadMessage}
  </div>
)}
           {/* =================================================
    SHARE + INSIGHTS
================================================= */}

<div className="badge-bottom-grid">

  {/* =================================================
      SOCIAL / FLAUNT YOUR BADGE
  ================================================= */}

  <div className="badge-social">

    <span className="badge-social-eyebrow">
      FLAUNT YOUR BADGE
    </span>

    <h2>
      Share your SFI journey
    </h2>

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


  {/* =================================================
      REQUEST INSIGHTS
  ================================================= */}

  <div className="badge-insights">

    <span className="badge-insights-eyebrow">
      YOUR SFI INSIGHTS
    </span>

    <h2>
      Request your insights
    </h2>

    <p>
      Want to see what your SFI responses reveal?
      Share the details below and we’ll prepare your
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
            Teacher
          </option>

          <option value="parent">
            Parent
          </option>

          <option value="student">
            Student
          </option>

          <option value="leader">
            Leader
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
      <div className="badge-insights-error">
        {insightError}
      </div>
    )}


    {insightMessage && (
      <div className="badge-insights-success">
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