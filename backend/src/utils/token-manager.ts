import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"; // Import specific error types
import { COOKIE_NAME } from "./constants.js";

// createToken remains the same
export const createToken = (id: string, email: string, expiresIn: string) => {
    const payload = { id, email };
    // Ensure JWT_SECRET is available, otherwise signing will fail silently or throw later
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET environment variable is not set.");
        throw new Error("JWT Secret is missing in server configuration."); // Throw error early
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn,
    });
    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // --- Added Logging ---
    console.log(`-----------------------------------------------------`);
    console.log(`verifyToken called for path: ${req.originalUrl || req.path}`); // Log the full path
    console.log('Raw Cookies Header:', req.headers.cookie || 'No Cookie Header Sent'); // Log raw header received
    console.log('req.cookies (parsed, unsigned):', req.cookies); // Log cookies parsed without secret
    console.log('req.signedCookies (parsed, signed):', req.signedCookies); // Log cookies parsed WITH secret
    // --- End Added Logging ---

    const token = req.signedCookies[`${COOKIE_NAME}`];

    // --- Added Logging ---
    console.log(`Token read for cookie "${COOKIE_NAME}":`, token ? 'FOUND (present in signedCookies)' : 'NOT FOUND (missing or invalid signature)');
    // --- End Added Logging ---

    if (!token || token.trim() === "") {
        // --- Added Logging ---
        console.warn(`--> Token Not Received or empty for cookie "${COOKIE_NAME}" on path ${req.originalUrl || req.path}. Sending 401.`);
        console.log(`-----------------------------------------------------`);
        // --- End Added Logging ---
        return res.status(401).json({ message: "Token Not Received" }); // Make sure cookie-parser secret matches signing secret
    }

    // Removed the unnecessary Promise wrapper around jwt.verify
    jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, success: JwtPayload | string | undefined) => {
        if (err) {
            // --- Improved Error Logging & Response ---
            console.error(`--> JWT Verification Error on path ${req.originalUrl || req.path}:`, err.message); // Log specific error
            let responseMessage = "Token Authentication Failed";
            if (err instanceof TokenExpiredError) {
                responseMessage = "Token Expired";
            } else if (err instanceof JsonWebTokenError) {
                // This catches invalid signature, malformed token, etc.
                responseMessage = "Token Invalid"; // More specific than "Expired"
                // Potential cause: JWT_SECRET mismatch between signing and verification, or token tampering.
                console.error("--> Potential causes: JWT_SECRET mismatch, token tampered, malformed token.");
            }
             console.log(`-----------------------------------------------------`);
            return res.status(401).json({ message: responseMessage });
            // --- End Improved Error Handling ---
        } else {
            // --- Success Case ---
            console.log(`--> Token Verification Successful for path ${req.originalUrl || req.path}`);
            console.log(`-----------------------------------------------------`);
            res.locals.jwtData = success; // Attach decoded payload for subsequent handlers
            return next(); // Proceed to the next middleware/handler (e.g., verifyUser)
            // --- End Success Case ---
        }
    });
};