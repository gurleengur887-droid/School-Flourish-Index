import React from "react";

import Hero from "../components/Hero";

import InsightSection from "../components/InsightSection";
import CreatorSection from "../components/CreatorSection";
import PerspectivesShowcase from "../components/PerspectivesShowcase";
import Testimonials from "../components/Testimonials";
import SEO from "../components/SEO";
const Home = () => {
 

  return (
    <>
      <SEO
  title="School Flourish Index — Understanding School Wellbeing"
  description="The School Flourish Index brings together voices from across education to understand wellbeing and collective flourishing in schools."
  url="/"
/>

      <main>

        <Hero />

        <PerspectivesShowcase/>
        <CreatorSection />
        <Testimonials />
<InsightSection />
      </main>
    </>
  );
};

export default Home;