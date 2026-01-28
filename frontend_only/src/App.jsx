import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageJobs from "./pages/ManageJobs";
import ManageUsers from "./pages/ManageUsers";
import CreateJob from "./pages/CreateJob";
import ReviewApplications from "./pages/ReviewApplications";
import ReviewJobApplications from "./pages/ReviewJobApplications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * APP COMPONENT - MAIN APPLICATION ROUTING
 *
 * This is the root component that sets up all routes for the Job Portal application
 * Uses React Router to handle navigation between different pages
 *
 * Route Structure:
 * - Public routes: Home, Login, Register, Job browsing pages
 * - Protected routes: User dashboard, Admin dashboard with role-based access control
 * - Admin-only routes: Wrapped with ProtectedRoute component for security
 */
const App = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      {/* Home page - landing page for all users */}
      <Route path="/" element={<Home />} />

      {/* Job listing page - search and browse all available jobs */}
      <Route path="/jobs" element={<JobList />} />

      {/* Detailed view of a specific job with application button */}
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Job application form - allows users to apply for a job */}
      <Route path="/jobs/:id/apply" element={<ApplyJob />} />

      {/* User authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== PROTECTED USER ROUTES ===== */}
      {/* User dashboard - view applications and profile */}
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* ===== PROTECTED ADMIN ROUTES ===== */}
      {/* Admin dashboard main page - shows statistics and overview */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Create new job posting */}
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute adminOnly={true}>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      {/* Manage existing jobs - edit and delete */}
      <Route
        path="/admin/jobs/manage"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManageJobs />
          </ProtectedRoute>
        }
      />

      {/* Review all job applications */}
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute adminOnly={true}>
            <ReviewApplications />
          </ProtectedRoute>
        }
      />

      {/* Review applications for a specific job */}
      <Route
        path="/admin/job/:jobId/applications"
        element={
          <ProtectedRoute adminOnly={true}>
            <ReviewJobApplications />
          </ProtectedRoute>
        }
      />

      {/* Detailed view of a specific application */}
      <Route
        path="/admin/applications/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <ApplicationDetails />
          </ProtectedRoute>
        }
      />

      {/* Manage system users - update roles, delete users */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
