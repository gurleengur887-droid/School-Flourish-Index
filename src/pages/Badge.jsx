import React, { useRef, useState } from "react";
import "../styles/badge.css";
import { supabase } from "../lib/supabase";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
/*
 * =========================================================
 * TEACHER + LEADER BADGE
 * =========================================================
 */

const TEACHER_LEADER_BADGE =
  "/assets/teacher_leader_badge.jpeg";

const Badge = () => {
  const [email, setEmail] = useState("");
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const badgeRef = useRef(null);

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

      if (
        role !== "teacher" &&
        role !== "leader"
      ) {
        throw new Error(
          "This badge is currently available for teachers and school leaders. A badge for your survey type will be available soon."
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

    const image = new Image();

    image.src = TEACHER_LEADER_BADGE;

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

      ctx.fillStyle = "#ffffff";

      ctx.font =
        "700 42px Arial, sans-serif";

      ctx.fillText(
        badgeData.name.toUpperCase(),
        canvas.width / 2,
        535
      );

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
    };

    image.onerror = () => {
      setError(
        "Unable to load the Teacher/Leader badge template."
      );
    };
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
              completing the SFI teacher or leader survey
              to access your personalized badge.
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
                className="badge-preview"
                ref={badgeRef}
              >

                <img
                  src={TEACHER_LEADER_BADGE}
                  alt="SFI Teacher and Leader Participation Badge"
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

            {/* =================================================
                SOCIAL
            ================================================= */}

            <div className="badge-social">

              <span className="badge-social-eyebrow">
                FLAUNT YOUR BADGE
              </span>

              <h2>
                Share your SFI journey 
              </h2>

              <p>
                Proud to be part of the School Flourish
                Index? Share your badge and let your
                network know.
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

          </div>
        )}

      </section>

    </main>
  );
};

export default Badge;