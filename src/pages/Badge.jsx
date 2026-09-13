import React, { useRef, useState } from "react";
import "../styles/badge.css";
import { supabase } from "../lib/supabase";

const Badge = () => {
  const [email, setEmail] = useState("");
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const badgeRef = useRef(null);

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
        await supabase.functions.invoke("badge-lookup", {
          body: {
            email: cleanEmail,
          },
        });

      if (functionError) {
        console.error("Badge function error:", functionError);
        throw new Error(
          functionError.message || "Failed to fetch badge."
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

      setBadgeData(data.badge);
    } catch (err) {
      console.error("Badge lookup error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadBadge = () => {
    if (!badgeData) return;

    const image = new Image();

    image.src = "/assets/sfi_badge.png";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Draw original badge template
      ctx.drawImage(image, 0, 0);

      // Name styling
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#111111";
      ctx.font = "700 48px Arial, sans-serif";

      // Draw respondent's name
      ctx.fillText(
        badgeData.name.toUpperCase(),
        canvas.width / 2,
        680
      );

      // Create download
      const link = document.createElement("a");

      link.download = `${badgeData.name.replace(
        /[^a-z0-9]/gi,
        "-"
      )}-SFI-Badge.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();
    };

    image.onerror = () => {
      setError("Unable to load the badge template.");
    };
  };

  return (
    <main className="badge-page">
      <section className="badge-container">

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
                onChange={(e) => setEmail(e.target.value)}
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
                Your SFI Survey 2026 participation badge is
                ready to download.
              </p>

            </div>

            <div className="badge-preview-wrapper">

              <div
                className="badge-preview"
                ref={badgeRef}
              >
                <img
                  src="/assets/sfi_badge.png"
                  alt="SFI Survey Participant Badge"
                />

                <div className="badge-name">
                  {badgeData.name}
                </div>
              </div>

            </div>

            <div className="badge-actions">

              <button
                className="download-badge-btn"
                onClick={downloadBadge}
              >
                Download My Badge
              </button>

              <button
                className="back-badge-btn"
                onClick={() => {
                  setBadgeData(null);
                  setEmail("");
                  setError("");
                }}
              >
                Search Again
              </button>

            </div>
<div className="badge-social">
  <span className="badge-social-eyebrow">
    FLAUNT YOUR BADGE
  </span>

  <h2>Share your SFI journey ✨</h2>

  <p>
    Proud to be part of the School Flourish Index?
    Share your badge and let your network know.
  </p>

  <div className="badge-social-links">
    <a
      href="https://www.instagram.com/skillsphereflourish?igsi=NHhudWV0amNiMjl3"
      target="_blank"
      rel="noopener noreferrer"
      className="badge-social-link"
    >
      Instagram
    </a>

    <a
      href="YOUR_LINKEDIN_LINK"
      target="_blank"
      rel="noopener noreferrer"
      className="badge-social-link"
    >
      LinkedIn
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