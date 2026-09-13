import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  BookOpen,
  Backpack,
  Sprout,
} from "lucide-react";

import "../styles/testimonials.css";

const testimonials = [
  {
    id: 1,
    type: "parent",
    label: "PARENT VOICE",
    name: "Ananya Sharma",
    quote: "My child feels seen, supported and excited to learn.",
    icon: Heart,
  },
  {
    id: 2,
    type: "teacher",
    label: "TEACHER VOICE",
    name: "Rohan Mehta",
    quote: "I feel trusted, valued and part of a team that cares.",
    icon: BookOpen,
  },
  {
    id: 3,
    type: "student",
    label: "STUDENT VOICE",
    name: "Aarav Kapoor",
    quote: "I've found a place where I can truly be myself.",
    icon: Backpack,
  },
  {
    id: 4,
    type: "leader",
    label: "LEADER VOICE",
    name: "Priya Malhotra",
    quote: "When people flourish, the whole school moves forward.",
    icon: Sprout,
  },
  {
    id: 5,
    type: "parent",
    label: "PARENT VOICE",
    name: "Simran Arora",
    quote: "Communication has improved so much. We finally feel heard.",
    icon: Heart,
  },
  {
    id: 6,
    type: "teacher",
    label: "TEACHER VOICE",
    name: "Neha Bhatia",
    quote: "It feels different when your voice actually shapes change.",
    icon: BookOpen,
  },
  {
    id: 7,
    type: "student",
    label: "STUDENT VOICE",
    name: "Meher Kaur",
    quote: "I feel more confident knowing that my perspective matters.",
    icon: Backpack,
  },
  {
    id: 8,
    type: "leader",
    label: "LEADER VOICE",
    name: "Vikram Singh",
    quote: "Better listening creates better decisions for everyone.",
    icon: Sprout,
  },
  {
    id: 9,
    type: "parent",
    label: "PARENT VOICE",
    name: "Kavya Sharma",
    quote: "I finally feel like my child's experience is being understood.",
    icon: Heart,
  },
  {
    id: 10,
    type: "teacher",
    label: "TEACHER VOICE",
    name: "Arjun Verma",
    quote: "We have better conversations because we are listening differently.",
    icon: BookOpen,
  },
  {
    id: 11,
    type: "student",
    label: "STUDENT VOICE",
    name: "Ishaan Gill",
    quote: "It feels good to know that what I think actually matters.",
    icon: Backpack,
  },
  {
    id: 12,
    type: "leader",
    label: "LEADER VOICE",
    name: "Manpreet Kaur",
    quote: "Small changes in how we listen can change an entire school.",
    icon: Sprout,
  },
];

const filters = [
  { id: "all", label: "All voices" },
  { id: "parent", label: "Parents" },
  { id: "teacher", label: "Teachers" },
  { id: "student", label: "Students" },
  { id: "leader", label: "Leaders" },
];

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [current, setCurrent] = useState(0);

  const filteredTestimonials =
    activeFilter === "all"
      ? testimonials
      : testimonials.filter(
          (item) => item.type === activeFilter
        );

  const visibleCards = 4;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTestimonials.length / visibleCards
    )
  );

  const currentPage = Math.min(
    current,
    totalPages - 1
  );

  const startIndex =
    currentPage * visibleCards;

  const displayedTestimonials =
    filteredTestimonials.slice(
      startIndex,
      startIndex + visibleCards
    );

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setCurrent(0);
  };

  const previous = () => {
    setCurrent((prev) =>
      prev === 0
        ? totalPages - 1
        : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      prev === totalPages - 1
        ? 0
        : prev + 1
    );
  };

  return (
    <section className="sfi-testimonials">

      {/* Decorative background elements */}

      <div className="sfi-testimonials-glow"></div>

      <div className="sfi-testimonials-leaf leaf-one"></div>
      <div className="sfi-testimonials-leaf leaf-two"></div>
      <div className="sfi-testimonials-leaf leaf-three"></div>


      <div className="sfi-testimonials-inner">

        {/* =================================
            HEADER
        ================================= */}

        <div className="sfi-testimonials-header">

          <div className="sfi-testimonials-kicker">
            <span></span>
            <p>VOICES THAT MATTER</p>
            <span></span>
          </div>

          <h2>
            Every voice
            <br />
            <em>adds to the picture.</em>
          </h2>

          <p className="sfi-testimonials-intro">
            A school is experienced differently
            by everyone inside it. These are the
            voices that help us see the whole picture.
          </p>

        </div>


        {/* =================================
            FILTERS
        ================================= */}

        <div className="sfi-testimonials-filters">

          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={
                activeFilter === filter.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleFilter(filter.id)
              }
            >
              {filter.label}
            </button>
          ))}

        </div>


        {/* =================================
            TESTIMONIAL AREA
        ================================= */}

        <div className="sfi-testimonials-stage">

          {/* Connecting line */}

          <svg
            className="sfi-testimonials-lines"
            viewBox="0 0 1400 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 170 C170 70 260 300 450 185 S760 85 920 190 S1190 290 1400 130" />

            <path d="M0 350 C180 245 310 405 490 300 S780 215 970 320 S1210 400 1400 275" />

            <circle cx="170" cy="125" r="5" />
            <circle cx="450" cy="185" r="5" />
            <circle cx="920" cy="190" r="5" />
            <circle cx="1190" cy="260" r="5" />
            <circle cx="310" cy="385" r="5" />
            <circle cx="970" cy="320" r="5" />
          </svg>


          {/* Center statement */}

          <div className="sfi-testimonials-center">

            <span>ONE SCHOOL</span>

            <strong>
              MANY
              <br />
              VOICES
            </strong>

            <small>
              LISTEN · UNDERSTAND · FLOURISH
            </small>

          </div>


          {/* Cards */}

          <div className="sfi-testimonials-grid">

            {displayedTestimonials.map(
              (testimonial, index) => {

                const Icon = testimonial.icon;

                return (
                  <article
                    key={testimonial.id}
                    className={`sfi-testimonial-card sfi-card-${testimonial.type} sfi-card-position-${index + 1}`}
                  >

                    <div className="sfi-testimonial-icon">
                      <Icon
                        size={27}
                        strokeWidth={1.25}
                      />
                    </div>

                    <div className="sfi-testimonial-content">

                      <span className="sfi-testimonial-label">
                        {testimonial.label}
                      </span>

                      <blockquote>
                        “{testimonial.quote}”
                      </blockquote>

                      <div className="sfi-testimonial-line"></div>

                      <div className="sfi-testimonial-person">

                        <strong>
                          {testimonial.name}
                        </strong>

                        <span>
                          {testimonial.type === "leader"
                            ? "School Leader"
                            : testimonial.type.charAt(0).toUpperCase() +
                              testimonial.type.slice(1)}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>


          {/* Navigation */}

          <button
            type="button"
            className="sfi-testimonials-arrow sfi-arrow-left"
            onClick={previous}
            aria-label="Previous testimonials"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.2}
            />
          </button>

          <button
            type="button"
            className="sfi-testimonials-arrow sfi-arrow-right"
            onClick={next}
            aria-label="Next testimonials"
          >
            <ArrowRight
              size={20}
              strokeWidth={1.2}
            />
          </button>

        </div>


        {/* =================================
            FOOTER
        ================================= */}

        <div className="sfi-testimonials-footer">

          <div className="sfi-testimonials-footer-copy">
            <span></span>

            <p>
              DIFFERENT VOICES.
              <br />
              ONE SHARED
              <br />
              FLOURISHING.
            </p>
          </div>


          <div className="sfi-testimonials-pagination">

            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === currentPage
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrent(index)
                  }
                  aria-label={`Testimonial page ${
                    index + 1
                  }`}
                />
              )
            )}

          </div>


          <div className="sfi-testimonials-mark">
            SCHOOL FLOURISH INDEX
            <span></span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Testimonials;