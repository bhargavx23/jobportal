# TODO: Fix Frontend-Backend Connection Issue

## Backend Changes

- [x] Update CORS configuration in backend_only/index.js to remove incorrect backend URL from allowedOrigins

## Frontend Changes

- [x] Create .env file in frontend_only with VITE_API_BASE_URL
- [x] Update frontend_only/src/context/AuthContext.jsx to use environment variable
- [ ] Update frontend_only/src/pages/Home.jsx to use environment variable
- [ ] Update frontend_only/src/pages/UserDashboard.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ReviewJobApplications.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ReviewApplications.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ManageUsers.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ManageJobs.jsx to use environment variable
- [ ] Update frontend_only/src/pages/JobList.jsx to use environment variable
- [ ] Update frontend_only/src/pages/JobDetails.jsx to use environment variable
- [ ] Update frontend_only/src/pages/CreateJob.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ApplyJob.jsx to use environment variable
- [ ] Update frontend_only/src/pages/ApplicationDetails.jsx to use environment variable
- [ ] Update frontend_only/src/pages/AdminDashboard.jsx to use environment variable
- [ ] Update frontend_only/src/components/JobCard.jsx to use environment variable
- [ ] Update frontend_only/src/components/home/BookSingleCard.jsx to use environment variable
- [ ] Update frontend_only/src/components/home/BookModal.jsx to use environment variable
- [ ] Update frontend_only/src/components/home/BooksTable.jsx to use environment variable

## Followup Steps

- [ ] Set FRONTEND_URL environment variable in Render backend dashboard
- [ ] Redeploy backend to Render
- [ ] Test frontend connection
