import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/admin_login.css";
import SEO from "../components/SEO";
function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <main className="admin-login-page">
      <SEO
  title="Admin Login — School Flourish Index"
  description="Secure administration access for the School Flourish Index."
  url="/admin/login"
  noIndex
/>
      <div className="admin-login-wrapper">

        <div className="admin-login-brand">
          <div className="admin-login-mark">SFI</div>

          <span className="admin-login-eyebrow">
            SCHOOL FLOURISH INDEX
          </span>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to access the SFI administration system.
          </p>
        </div>

        <div className="admin-login-panel">

          <div className="admin-login-panel-header">
            <span>ADMINISTRATION</span>
            <h2>Sign in</h2>
          </div>

          <form onSubmit={handleLogin}>

            <div className="admin-login-field">
              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-password-wrapper">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <div className="admin-login-footer">
            <span>PRIVATE ADMIN AREA</span>
            <span>SFI</span>
          </div>

        </div>

      </div>
    </main>
  );
}

export default AdminLogin;