import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * AUTH CONTEXT
 * Global state management for user authentication
 * Handles login, registration, logout, and profile updates
 * Persists auth token in localStorage for session management
 */

// Create the authentication context
const AuthContext = createContext();

/**
 * CUSTOM HOOK: useAuth
 * Provides access to authentication context in any component
 *
 * Usage: const { user, login, register, logout } = useAuth();
 *
 * Throws error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AUTH PROVIDER COMPONENT
 * Wraps the entire application to provide authentication state globally
 *
 * State:
 * - user: Current authenticated user object (null if not logged in)
 * - loading: Boolean indicating if auth is being initialized
 *
 * Methods:
 * - login(): Authenticate user with email/password
 * - register(): Create new user account
 * - logout(): Clear authentication and user data
 * - updateProfile(): Update user profile information
 */
export const AuthProvider = ({ children }) => {
  // State to hold current authenticated user
  const [user, setUser] = useState(null);

  // State to track if app is still checking for existing session
  const [loading, setLoading] = useState(true);

  /**
   * INITIALIZATION EFFECT
   * Runs on component mount to check if user has existing valid session
   *
   * Process:
   * 1. Check localStorage for saved JWT token
   * 2. Verify token hasn't expired (using jwtDecode)
   * 3. Fetch user profile from backend if token is valid
   * 4. Clear invalid/expired tokens
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Decode token to check expiration (without verifying signature)
          const decoded = jwtDecode(token);

          // Check if token hasn't expired
          // decoded.exp is in seconds, Date.now() is in milliseconds
          if (decoded.exp * 1000 > Date.now()) {
            // Token is still valid, fetch user profile from backend
            const response = await axios.get(
              "https://jobportal-995j.onrender.com/api/auth/profile",
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            // Set user data from response
            setUser(response.data);
          } else {
            // Token has expired, remove it from localStorage
            localStorage.removeItem("token");
          }
        } catch (error) {
          // Error decoding or validating token, clear it
          localStorage.removeItem("token");
        }
      }

      // Mark auth initialization as complete
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * LOGIN METHOD
   * Authenticates user with email and password
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   *
   * @returns {Promise<object>} { success: boolean, message?: string }
   *
   * On success:
   * - Saves JWT token to localStorage
   * - Sets user state with user data
   */
  const login = async (email, password) => {
    try {
      // Send login request to backend
      const response = await axios.post(
        "https://jobportal-995j.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      // Extract token and user data from response
      const { token, user: userData } = response.data;

      // Save token to localStorage for persistent sessions
      localStorage.setItem("token", token);

      // Set authenticated user in state
      setUser(userData);

      return { success: true };
    } catch (error) {
      // Return error message from backend or generic message
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  /**
   * REGISTER METHOD
   * Creates new user account and logs them in automatically
   *
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} role - User's role (default: "user")
   *
   * @returns {Promise<object>} { success: boolean, message?: string }
   *
   * On success:
   * - Creates user account
   * - Saves JWT token to localStorage
   * - Sets user state with user data
   */
  const register = async (name, email, password, role = "user") => {
    try {
      // Send registration request to backend
      const response = await axios.post(
        "https://jobportal-995j.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          role,
        },
      );

      // Extract token and user data from response
      const { token, user: userData } = response.data;

      // Save token to localStorage for persistent sessions
      localStorage.setItem("token", token);

      // Set authenticated user in state
      setUser(userData);

      return { success: true };
    } catch (error) {
      // Return error message from backend or generic message
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  /**
   * LOGOUT METHOD
   * Clears authentication and user data
   * Removes token from localStorage
   */
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear user state
    setUser(null);
  };

  /**
   * UPDATE PROFILE METHOD
   * Updates authenticated user's profile information
   *
   * @param {object} updates - Object containing fields to update
   *                          Example: { name: "John", profile: { phone: "123..." } }
   *
   * @returns {Promise<object>} { success: boolean, message?: string }
   *
   * On success:
   * - Updates user state with new data
   */
  const updateProfile = async (updates) => {
    try {
      // Get token from localStorage for authentication
      const token = localStorage.getItem("token");

      // Send update request to backend
      const response = await axios.put(
        "https://jobportal-995j.onrender.com/api/auth/profile",
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update user state with response data
      setUser(response.data.user);

      return { success: true };
    } catch (error) {
      // Return error message from backend or generic message
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };

  /**
   * CONTEXT VALUE
   * Object containing all authentication state and methods
   * Made available to all consuming components via useAuth hook
   */
  const value = {
    user, // Current authenticated user (null if not logged in)
    login, // Function to login
    register, // Function to register new user
    logout, // Function to logout
    updateProfile, // Function to update user profile
    loading, // Boolean indicating if auth is still initializing
  };

  // Provider wraps children and makes auth data available to entire app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
