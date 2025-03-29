import User from "../models/User.js";
import { hash, compare } from "bcryptjs";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
// Helper function to define cookie options based on environment
const getCookieOptions = (includeExpires = false) => {
    const options = {
        path: "/",
        // Domain is omitted (Option A - recommended)
        httpOnly: true, // Helps prevent XSS attacks
        signed: true, // Assumes you are using cookie-parser with a secret
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-site (prod), 'lax' for same-site (dev)
    };
    if (includeExpires) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // Set expiration for 7 days
        options.expires = expires;
    }
    return options;
};
export const getAllUsers = async (req, res, next) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        console.error("Error in getAllUsers:", error); // Log the actual error
        // Check if error is an instance of Error to safely access message
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        // Send a 500 status for server errors
        return res.status(500).json({ message: "ERROR", cause: errorMessage });
    }
};
export const userSignup = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).send("User already registered"); // 409 Conflict is more appropriate
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // --- Corrected Cookie Handling ---
        const cookieOptions = getCookieOptions(false); // Get options for clearing (no expires)
        res.clearCookie(COOKIE_NAME, cookieOptions);
        const token = createToken(user._id.toString(), user.email, "7d");
        const cookieOptionsWithExpires = getCookieOptions(true); // Get options for setting (with expires)
        res.cookie(COOKIE_NAME, token, cookieOptionsWithExpires);
        // --- End Corrected Cookie Handling ---
        return res
            .status(201)
            .json({ message: "OK", name: user.name, email: user.email }); // Return minimal info
    }
    catch (error) {
        console.error("Error in userSignup:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return res.status(500).json({ message: "ERROR", cause: errorMessage });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        //user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered"); // 401 Unauthorized
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password"); // 403 Forbidden
        }
        // --- Corrected Cookie Handling ---
        const cookieOptions = getCookieOptions(false); // Get options for clearing (no expires)
        res.clearCookie(COOKIE_NAME, cookieOptions);
        const token = createToken(user._id.toString(), user.email, "7d");
        const cookieOptionsWithExpires = getCookieOptions(true); // Get options for setting (with expires)
        res.cookie(COOKIE_NAME, token, cookieOptionsWithExpires);
        // --- End Corrected Cookie Handling ---
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email }); // Return minimal info
    }
    catch (error) {
        console.error("Error in userLogin:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return res.status(500).json({ message: "ERROR", cause: errorMessage });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        // User ID and email are expected to be in res.locals.jwtData from the verifyToken middleware
        if (!res.locals.jwtData || !res.locals.jwtData.id) {
            // This case should ideally be caught by verifyToken, but good to double-check
            return res.status(401).send("Authentication data missing");
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            // If token was valid but user doesn't exist (e.g., deleted after token issued)
            console.warn(`Valid token received for non-existent user ID: ${res.locals.jwtData.id}`);
            // Optionally clear the invalid cookie
            const cookieOptions = getCookieOptions(false);
            res.clearCookie(COOKIE_NAME, cookieOptions);
            return res.status(401).send("User not found associated with this token");
        }
        // We already know the ID matches because we found the user by that ID.
        // The email check might be redundant if ID is the primary identifier in the token.
        // if (user.email !== res.locals.jwtData.email) {
        //   console.warn(`Token ID ${res.locals.jwtData.id} email mismatch: DB (${user.email}) vs Token (${res.locals.jwtData.email})`);
        //   return res.status(401).send("User identity mismatch");
        // }
        console.log("User verified successfully:", user.email);
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.error("Error in verifyUser:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        // It's possible the findById fails if the ID format is wrong etc.
        return res.status(500).json({ message: "ERROR", cause: errorMessage });
    }
};
export const userLogout = async (req, res, next) => {
    try {
        // User verification part - Technically, the verifyToken middleware should already have run
        // if this route is protected. Re-checking the user here might be redundant IF
        // verifyToken correctly attaches valid user data AND handles errors.
        // If verifyToken failed, the request wouldn't reach here unless the route isn't protected.
        // Assuming the route IS protected by verifyToken:
        if (!res.locals.jwtData || !res.locals.jwtData.id) {
            console.warn("Logout attempted without verified user data in res.locals");
            // Still attempt to clear cookie as a best effort, but respond unauthorized
            const cookieOptions = getCookieOptions(false);
            res.clearCookie(COOKIE_NAME, cookieOptions);
            return res.status(401).json({ message: "Unauthorized: Cannot verify user for logout." });
        }
        // Optional: You could log the logout action tied to the user ID
        console.log(`Logging out user: ${res.locals.jwtData.id}`);
        // --- Corrected Cookie Handling ---
        // Clear the cookie using consistent options
        const cookieOptions = getCookieOptions(false); // Get options for clearing
        res.clearCookie(COOKIE_NAME, cookieOptions);
        // --- End Corrected Cookie Handling ---
        return res
            .status(200)
            .json({ message: "OK" }); // Simple confirmation is usually enough for logout
    }
    catch (error) {
        console.error("Error in userLogout:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return res.status(500).json({ message: "ERROR", cause: errorMessage });
    }
};
