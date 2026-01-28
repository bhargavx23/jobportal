# Job Portal MERN Stack

A full-stack web application for a job portal, built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to register, login, browse job listings, apply for jobs, and administrators to manage jobs, users, and applications.

## Features

- **User Authentication**: Secure registration and login with JWT tokens.
- **Job Listings**: Browse, search, and filter jobs by location, type, and category.
- **Job Applications**: Users can apply for jobs with resume uploads and cover letters.
- **Admin Dashboard**: Manage users, jobs, and review applications.
- **User Dashboard**: View applied jobs and profile management.
- **File Uploads**: Support for resume and company logo uploads.
- **Responsive UI**: Modern, responsive design using Tailwind CSS.
- **Notifications**: User-friendly notifications using Notistack.
- **Routing**: Client-side routing with React Router DOM.

## Tech Stack

### Backend

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user, job, and application data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **Multer**: Middleware for handling file uploads.
- **CORS**: Middleware for handling Cross-Origin Resource Sharing.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **React Router DOM**: Declarative routing for React.
- **Axios**: HTTP client for making API requests.
- **Tailwind CSS**: Utility-first CSS framework.
- **Notistack**: Notification library for React.
- **React Icons**: Icon library for React.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bhargavpasupuleti/job-portal-mern-stack.git
   cd job-portal-mern-stack
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `config.js` file in the `backend` directory with your MongoDB URL and port:
     ```javascript
     export const PORT = 30000;
     export const mongoDBURL =
       "mongodb+srv://your-username:your-password@cluster.mongodb.net/jobPortal?retryWrites=true&w=majority";
     export const JWT_SECRET = "your-jwt-secret-key";
     ```
   - Update the URL if using a cloud MongoDB instance.

5. Create admin user:
   ```bash
   cd backend
   node createAdmin.js
   ```

## Running the App

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

   The backend will run on `http://localhost:3001`.

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (default Vite port).

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs

- `GET /api/jobs` - Get all jobs (with pagination, search, filters)
- `GET /api/jobs/stats` - Get job statistics
- `GET /api/jobs/:id` - Get single job details
- `POST /api/jobs` - Create a new job (admin only)
- `PUT /api/jobs/:id` - Update a job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)
- `POST /api/jobs/:id/apply` - Apply for a job

### Applications

- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job (admin only)
- `PUT /api/applications/:id/status` - Update application status (admin only)
- `POST /api/applications` - Create a new application
- `DELETE /api/applications/:id` - Delete an application

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete a user (admin only)
- `GET /api/admin/jobs` - Get all jobs (admin only)
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/applications` - Get all applications (admin only)
- `GET /api/admin/applications/recent` - Get recent applications (admin only)

## Project Structure

```
job-portal-mern-stack/
├── backend/
│   ├── config.js
│   ├── index.js
│   ├── createAdmin.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── jobModel.js
│   │   └── applicationModel.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── jobsRoute.js
│   │   ├── applicationsRoute.js
│   │   └── adminRoute.js
│   ├── middleware/
│   │   └── auth.js
│   ├── public/
│   │   └── uploads/
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── JobCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Logo.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── ApplyJob.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── ManageJobs.jsx
│   │   │   ├── ReviewApplications.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   └── ReviewApplications.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
├── .gitignore
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the ISC License.

## Author

Bhargav Pasupuleti
