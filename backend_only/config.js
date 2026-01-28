// Server port configuration - defines which port the backend will listen on
// For production on Render, PORT is automatically assigned
export const PORT = process.env.PORT || 'https://jobportal-995j.onrender.com';

// MongoDB connection URL - Use environment variable for security
// Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
// For development, falls back to local MongoDB
export const mongoDBURL =
  process.env.MONGODB_URL || "mongodb+srv://jobportal:jobportal1122@cluster0.jok63q4.mongodb.net/jobportal?appName=Cluster0";

// JWT Secret - Must be stored in environment variables for security
// IMPORTANT: Never commit actual secret to repository
// Generate strong secret with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "fallback_secret_change_in_production_generate_strong_secret_in_env";
