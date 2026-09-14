import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import "../styles/surveys.css";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";
const normalize = (value) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

const Surveys = () => {
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [schoolsError, setSchoolsError] = useState("");

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [addingSchool, setAddingSchool] = useState(false);
  const [submittingSchool, setSubmittingSchool] = useState(false);

  const [newSchool, setNewSchool] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
  });
  // =====================================
  // ALWAYS OPEN SURVEY PAGE FROM THE TOP
  // =====================================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // =====================================
  // LOAD SCHOOLS FROM SUPABASE
  // =====================================

  useEffect(() => {
    const fetchSchools = async () => {
      setSchoolsLoading(true);
      setSchoolsError("");

      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading schools:", error);

        setSchoolsError(
          "We couldn't load the school directory. Please try again."
        );

        setSchools([]);
      } else {
        setSchools(data || []);
      }

      setSchoolsLoading(false);
    };

    fetchSchools();
  }, []);

  // =====================================
  // SELECT SCHOOL
  // =====================================

  const selectSchool = (school) => {
    setSelectedSchool(school);
    setSchoolOpen(false);
  };

  // =====================================
  // ADD NEW SCHOOL
  // =====================================

  const submitNewSchool = async () => {
    const name = newSchool.name.trim();
    const country = newSchool.country.trim();
    const state = newSchool.state.trim();
    const city = newSchool.city.trim();

    if (!name || !country || !state || !city) {
      return;
    }

    setSubmittingSchool(true);
    setSchoolsError("");

    // Check the schools already loaded into the app
    const duplicateSchool = schools.find(
      (school) =>
        normalize(school.name) === normalize(name) &&
        normalize(school.country) === normalize(country) &&
        normalize(school.state) === normalize(state) &&
        normalize(school.city) === normalize(city)
    );

    if (duplicateSchool) {
      setSelectedSchool(duplicateSchool);

      sessionStorage.setItem(
        "sfi_selected_school",
        JSON.stringify(duplicateSchool)
      );

      setSubmittingSchool(false);
      navigate("/perspective");
      return;
    }

    // Insert new school into Supabase
    const { data, error } = await supabase
      .from("schools")
      .insert({
        name,
        country,
        state,
        city,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding school:", error);

      // Unique constraint = someone added the same school
      // between our check and the insert.
      if (error.code === "23505") {
        const {
          data: latestSchools,
          error: fetchError,
        } = await supabase
          .from("schools")
          .select("*")
          .order("name", { ascending: true });

        if (!fetchError && latestSchools) {
          const existingSchool = latestSchools.find(
            (school) =>
              normalize(school.name) === normalize(name) &&
              normalize(school.country) === normalize(country) &&
              normalize(school.state) === normalize(state) &&
              normalize(school.city) === normalize(city)
          );

          if (existingSchool) {
            setSchools(latestSchools);
            setSelectedSchool(existingSchool);

            sessionStorage.setItem(
              "sfi_selected_school",
              JSON.stringify(existingSchool)
            );

            setSubmittingSchool(false);
            navigate("/perspective");
            return;
          }
        }
      }

      setSchoolsError(
        "We couldn't add this school right now. Please try again."
      );

      setSubmittingSchool(false);
      return;
    }

    // Successfully created
    setSchools((prev) =>
      [...prev, data].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    setSelectedSchool(data);

    sessionStorage.setItem(
      "sfi_selected_school",
      JSON.stringify(data)
    );

    setSubmittingSchool(false);

    navigate("/perspective");
  };

  // =====================================
  // CONTINUE WITH SELECTED SCHOOL
  // =====================================

  const continueToPerspective = () => {
    if (!selectedSchool) return;

    sessionStorage.setItem(
      "sfi_selected_school",
      JSON.stringify(selectedSchool)
    );

    navigate("/perspective");
  };

  return (
    <main className="surveys-page">
      <SEO
  title="Take the SFI Survey — School Flourish Index"
  description="Share your perspective and contribute your voice to the School Flourish Index, a growing picture of wellbeing and flourishing in education."
  url="/surveys"
/>
      <section className="survey-hero">

        <div className="survey-hero-container">

          {/* =====================================
              LEFT — HERO
          ===================================== */}

          <div className="survey-hero-left">

            <div className="survey-section-label">
              <span className="survey-label-line"></span>

              <span>
                START A SURVEY
              </span>
            </div>

            <div className="survey-hero-content">

              <h1 className="survey-hero-title">
                Your perspective
                <span>helps shape the picture.</span>
              </h1>

              <p className="survey-hero-description">
                School life looks different from every
                perspective. Tell us what you experience,
                so we can understand the fuller picture
                together.
              </p>

              <div className="survey-hero-note">

                <span className="survey-hero-dot"></span>

                <span>
                  Parent · Teacher · Student · Leader
                </span>

                <span>·</span>

                <span>
                  Built for reflection
                </span>

              </div>

            </div>
          </div>


          {/* =====================================
              RIGHT — SCHOOL SELECTOR
          ===================================== */}

          <div className="survey-school-side">

            {/* Decorative botanical */}
            <div
              className="school-botanical"
              aria-hidden="true"
            >
              <span className="botanical-stem"></span>
              <span className="botanical-leaf botanical-leaf-one"></span>
              <span className="botanical-leaf botanical-leaf-two"></span>
              <span className="botanical-leaf botanical-leaf-three"></span>
            </div>


            {/* Back offset card */}
            <div
              className="school-card-back"
              aria-hidden="true"
            ></div>


            {/* =====================================
                ANIMATED CARD
            ===================================== */}

            <div
              className={`school-card-flip ${
                addingSchool
                  ? "is-add-school"
                  : "is-school-selection"
              }`}
            >

              {!addingSchool ? (

                /* =====================================
                   SCHOOL SELECTION CARD
                ===================================== */

                <div className="school-selection-panel">

                  {/* CARD TOP */}

                  <div className="school-panel-top">

                    <span className="school-panel-eyebrow">
                      01 / YOUR SCHOOL
                    </span>

                    <span className="school-panel-mini-line"></span>

                  </div>


                  {/* CARD DECORATIVE MARK */}

                  <div
                    className="school-card-mark"
                    aria-hidden="true"
                  >
                    <span></span>
                  </div>


                  {/* HEADER */}

                  <div className="school-panel-header">

                    <h2>
                      Every
                      <br />
                      perspective
                      <br />
                      has a <em>place.</em>
                    </h2>

                    <p>
                      Tell us which school your
                      experience belongs to.
                    </p>

                  </div>


                  {/* =====================================
                      SCHOOL SELECTOR
                  ===================================== */}

                  <div className="school-dropdown-wrapper">

                    <button
                      type="button"
                      className={`school-dropdown ${
                        schoolOpen
                          ? "school-dropdown-open"
                          : ""
                      }`}
                      onClick={() =>
                        setSchoolOpen((prev) => !prev)
                      }
                      disabled={schoolsLoading}
                    >

                      <div className="school-dropdown-copy">

                        <span>
                          {schoolsLoading
                            ? "LOADING SCHOOLS"
                            : selectedSchool
                            ? "SELECTED SCHOOL"
                            : "SELECT YOUR SCHOOL"}
                        </span>

                        <strong>
                          {schoolsLoading
                            ? "Loading school directory..."
                            : selectedSchool
                            ? selectedSchool.name
                            : "Choose your school"}
                        </strong>

                        {selectedSchool && (
                          <small>
                            {selectedSchool.city}
                            {" · "}
                            {selectedSchool.state}
                            {" · "}
                            {selectedSchool.country}
                          </small>
                        )}

                      </div>

                      <ChevronDown
                        size={18}
                        strokeWidth={1.2}
                        className="school-chevron"
                      />

                    </button>


                    {/* =====================================
                        SCHOOL DIRECTORY
                    ===================================== */}

                    {schoolOpen && !schoolsLoading && (

                      <div className="school-dropdown-menu">

                        <div className="school-menu-heading">
                          SELECT YOUR SCHOOL
                        </div>

                        <div className="school-options">

                          {schools.length > 0 ? (

                            schools.map((school) => (

                              <button
                                key={school.id}
                                type="button"
                                className="school-option"
                                onClick={() =>
                                  selectSchool(school)
                                }
                              >

                                <div>

                                  <strong>
                                    {school.name}
                                  </strong>

                                  <span>
                                    {school.city}
                                    {" · "}
                                    {school.state}
                                    {" · "}
                                    {school.country}
                                  </span>

                                </div>

                                {selectedSchool?.id ===
                                  school.id && (

                                  <Check
                                    size={15}
                                    strokeWidth={1.4}
                                  />

                                )}

                              </button>

                            ))

                          ) : (

                            <div className="school-empty-state">
                              No schools have been added yet.
                            </div>

                          )}

                        </div>

                      </div>

                    )}

                    {/* =====================================
                        OR DIVIDER
                    ===================================== */}

                    <div className="school-add-divider">

                      <span></span>

                      <em>or</em>

                      <span></span>

                    </div>


                    {/* =====================================
                        ADD SCHOOL — ALWAYS VISIBLE
                    ===================================== */}

                    <button
                      type="button"
                      className="add-school-button"
                      onClick={() => {
                        setSchoolOpen(false);
                        setAddingSchool(true);
                        setSchoolsError("");
                      }}
                    >

                      <span className="add-school-plus">

                        <Plus
                          size={15}
                          strokeWidth={1.3}
                        />

                      </span>

                      <span className="add-school-copy">

                        Can't find your school?

                        <strong>
                          Add a new school
                        </strong>

                      </span>

                      <ArrowRight
                        size={16}
                        strokeWidth={1.2}
                      />

                    </button>

                  </div>


                  {/* ERROR */}

                  {schoolsError && (
                    <p className="school-error">
                      {schoolsError}
                    </p>
                  )}


                  {/* FOOTER */}

                  <div className="school-panel-footer">

                    <span>
                      Your school helps us place
                      your perspective in context.
                    </span>

                    {selectedSchool && (

                      <span className="school-confirmed">

                        <Check
                          size={12}
                          strokeWidth={1.5}
                        />

                        Selected

                      </span>

                    )}

                  </div>


                  {/* CONTINUE */}

                  {selectedSchool && (

                    <button
                      type="button"
                      className="school-continue-button"
                      onClick={continueToPerspective}
                    >

                      <span>
                        Continue
                      </span>

                      <ArrowRight
                        size={16}
                        strokeWidth={1.3}
                      />

                    </button>

                  )}

                </div>

              ) : (

                /* =====================================
                   ADD SCHOOL CARD
                ===================================== */

                <div className="school-selection-panel add-school-panel">

                  {/* BACK */}

                  <button
                    type="button"
                    className="school-back"
                    onClick={() => {
                      setAddingSchool(false);
                      setSchoolsError("");
                    }}
                    disabled={submittingSchool}
                  >

                    <ArrowLeft
                      size={14}
                      strokeWidth={1.2}
                    />

                    Back to schools

                  </button>


                  {/* HEADER */}

                  <div className="add-school-heading">

                    <span>
                      SCHOOL NOT LISTED?
                    </span>

                    <h2>
                      Tell us about
                      <br />
                      your <em>school.</em>
                    </h2>

                    <p>
                      A few details are all we need
                      to place it correctly.
                    </p>

                  </div>


                  {/* FORM */}

                  <div className="add-school-form">

                    <label className="add-school-full">

                      <span>
                        SCHOOL NAME
                      </span>

                      <input
                        type="text"
                        placeholder="Enter school name"
                        value={newSchool.name}
                        onChange={(e) =>
                          setNewSchool({
                            ...newSchool,
                            name: e.target.value,
                          })
                        }
                        disabled={submittingSchool}
                      />

                    </label>


                    <label>

                      <span>
                        COUNTRY
                      </span>

                      <input
                        type="text"
                        placeholder="Country"
                        value={newSchool.country}
                        onChange={(e) =>
                          setNewSchool({
                            ...newSchool,
                            country: e.target.value,
                          })
                        }
                        disabled={submittingSchool}
                      />

                    </label>


                    <label>

                      <span>
                        STATE / PROVINCE
                      </span>

                      <input
                        type="text"
                        placeholder="State or province"
                        value={newSchool.state}
                        onChange={(e) =>
                          setNewSchool({
                            ...newSchool,
                            state: e.target.value,
                          })
                        }
                        disabled={submittingSchool}
                      />

                    </label>


                    <label className="add-school-full">

                      <span>
                        CITY / TOWN
                      </span>

                      <input
                        type="text"
                        placeholder="City or town"
                        value={newSchool.city}
                        onChange={(e) =>
                          setNewSchool({
                            ...newSchool,
                            city: e.target.value,
                          })
                        }
                        disabled={submittingSchool}
                      />

                    </label>

                  </div>


                  {/* ERROR */}

                  {schoolsError && (
                    <p className="school-error">
                      {schoolsError}
                    </p>
                  )}


                  {/* SUBMIT */}

                  <button
                    type="button"
                    className="add-school-submit"
                    onClick={submitNewSchool}
                    disabled={submittingSchool}
                  >

                    <span>
                      {submittingSchool
                        ? "Saving..."
                        : "Continue"}
                    </span>

                    {!submittingSchool && (
                      <ArrowRight
                        size={16}
                        strokeWidth={1.3}
                      />
                    )}

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =====================================
            BOTTOM DECORATIVE ORBIT
        ===================================== */}

        <div
          className="survey-bottom-orbit"
          aria-hidden="true"
        >
         
        </div>

      </section>
    </main>
  );
};

export default Surveys;