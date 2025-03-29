/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator"; // Corrected path assuming 'helpers' directory

// Define User type
type User = {
  name: string;
  email: string;
};

// Define Authentication Context type
type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<UserAuth | null>(null);

// Define the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect hook runs once on component mount to check existing auth status
  useEffect(() => {
      // Function to check authentication status using cookies
      async function checkStatus() {
          try {
              // Attempt to verify authentication status via API call
              console.log("AuthContext: Checking initial authentication status...");
              const data = await checkAuthStatus();

              // If successful (API returned 200 OK with user data)
              console.log("AuthContext: Initial auth status check successful.", data);
              setUser({ email: data.email, name: data.name });
              setIsLoggedIn(true);

          } catch (error: unknown) {
              // If the check fails (e.g., 401 Unauthorized - Token Not Received or Expired)
              if (error instanceof Error) {
                  console.warn("AuthContext: Initial auth status check failed:", error.message);
              } else {
                  console.warn("AuthContext: An unknown error occurred during auth status check.");
              }
              // It's expected this might fail on initial load due to browser cookie timing,
              // or if the user genuinely isn't logged in or the token is invalid.
              // We intentionally do nothing here, the state remains logged out.
              setIsLoggedIn(false); // Explicitly ensure logged out state if check fails
              setUser(null);       // Explicitly ensure no user data if check fails
          }
      }

      // Call the function to check status when the provider mounts
      checkStatus();

  }, []); // Empty dependency array ensures this runs only once

  // Login function
  const login = async (email: string, password: string) => {
      // Call API helper
      const data = await loginUser(email, password);
      // Update state on successful login
      if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
      }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
      // Call API helper
      const data = await signupUser(name, email, password);
      // Update state on successful signup
      if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
      }
  };

  // Logout function
  const logout = async () => {
      // Call API helper to clear server-side session/cookie
      await logoutUser();
      // Clear local state
      setIsLoggedIn(false);
      setUser(null);
      // Optional: Force reload to clear any residual state, though not always necessary
      // Consider redirecting instead using useNavigate() from react-router-dom
      // window.location.reload();
  };

  // Value provided by the context
  const value = {
      user,
      isLoggedIn,
      login,
      logout,
      signup,
  };

  // Return the provider wrapping children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
      throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};