import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Surveys from "./pages/Surveys";
import Perspective from "./pages/Perspective";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminSchools from "./pages/AdminSchools";
import AdminSchoolDetails from "./pages/AdminSchoolDetails";
import AdminResponses from "./pages/AdminResponses";
import AdminResults from "./pages/AdminResults";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import InsightsAccess from "./pages/InsightsAccess";
import AdminIndividualResponse from "./pages/AdminIndividualResponse";
import AdminPerspectiveResponses from "./pages/AdminPerspectiveResponses";
import Badge from "./pages/Badge";
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/surveys" element={<Surveys />} />

        <Route path="/perspective" element={<Perspective />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insights-access" element={<InsightsAccess />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/badge" element={<Badge />} />
        {/* PROTECTED ADMIN ROUTES */}

        <Route element={<ProtectedAdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
  
          <Route
            path="/admin/schools"
            element={<AdminSchools />}
          />

          <Route
            path="/admin/schools/:schoolId"
            element={<AdminSchoolDetails />}
          />

          <Route
            path="/admin/responses"
            element={<AdminResponses />}
          />

          <Route
            path="/admin/results"
            element={<AdminResults />}
          />
<Route
  path="/admin/settings"
  element={<AdminSettings />}
/>
<Route
  path="/admin/schools/:schoolId/response/:responseId"
  element={<AdminIndividualResponse />}
/>
<Route
  path="/admin/schools/:schoolId/perspective/:role"
  element={<AdminPerspectiveResponses />}
/>

        </Route>

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;