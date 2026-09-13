import React, { useState } from "react";
import { ArrowUpRight, BarChart3,  Menu, X } from "lucide-react";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${menuOpen ? "navbar-menu-active" : ""}`}>

      <div className="navbar-container">

        {/* BRAND */}
        <a href="/" className="navbar-brand" onClick={closeMenu}>
         <div className="brand-mark">
  <img
    src="/logo.png"
    alt="School Flourish Index"
  />
</div>

          <div className="brand-copy">
            <span className="brand-name">SFI</span>

            <span className="brand-tagline">
              SCHOOL FLOURISH INDEX
            </span>
          </div>
        </a>


        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-links">

          <a href="/surveys">
            Surveys
          </a>

          <a href="/about">
            About
          </a>

          <a href="/dashboard" className="dashboard">
            <BarChart3 size={17} strokeWidth={1.6} />
            <span>Insights</span>
          </a>

        </nav>


        {/* MOBILE MENU BUTTON */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>

      </div>


      {/* BACKDROP */}
      <div
        className={`mobile-overlay ${
          menuOpen ? "mobile-overlay-visible" : ""
        }`}
        onClick={closeMenu}
      />


      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "mobile-menu-open" : ""
        }`}
      >

        <div className="mobile-menu-inner">

          <span className="mobile-menu-eyebrow">
            EXPLORE SFI
          </span>


          <nav className="mobile-menu-links">

            <a href="#surveys" onClick={closeMenu}>
              <span>Surveys</span>
              <ArrowUpRight size={20} strokeWidth={1.4} />
            </a>


            <a href="/dashboard" onClick={closeMenu}>
              <span>Insights</span>
              <ArrowUpRight size={20} strokeWidth={1.4} />
            </a>


            <a href="/about" onClick={closeMenu}>
              <span>About</span>
              <ArrowUpRight size={20} strokeWidth={1.4} />
            </a>

          </nav>


          <div className="mobile-menu-footer">
            <span>
              School Flourish Index
            </span>

            <span>
              Parent · Teacher · Student · Leader
            </span>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;