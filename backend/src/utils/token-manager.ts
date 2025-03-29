import { Request, Response, NextFunction } from "express";
// Import the default export for runtime values (functions, error classes)
import jwt from "jsonwebtoken";
// Import types separately for type checking (TypeScript resolves these)
import { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

// createToken remains the same
export const createToken = (id: string, email: string, expiresIn: string) => {
    const payload = { id, email };
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET environment variable is not set.");
        throw new Error("JWT Secret is missing in server configuration.");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn,
    });
    return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // --- Added Logging ---
    console.log(`-----------------------------------------------------`);
    console.log(`verifyToken called for path: ${req.originalUrl || req.path}`);
    console.log('Raw Cookies Header:', req.headers.cookie || 'No Cookie Header Sent');
    console.log('req.cookies (parsed, unsigned):', req.cookies);
    console.log('req.signedCookies (parsed, signed):', req.signedCookies);
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
        return res.status(401).json({ message: "Token Not Received" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, success: JwtPayload | string | undefined) => {
        if (err) {
            // --- Improved Error Logging & Response ---
            console.error(`--> JWT Verification Error on path ${req.originalUrl || req.path}:`, err.message);
            let responseMessage = "Token Authentication Failed";

            // Access error classes via the 'jwt' default import object
            if (err instanceof jwt.TokenExpiredError) { // Use jwt.TokenExpiredError
                responseMessage = "Token Expired";
            } else if (err instanceof jwt.JsonWebTokenError) { // Use jwt.JsonWebTokenError
                responseMessage = "Token Invalid";
                console.error("--> Potential causes: JWT_SECRET mismatch, token tampered, malformed token.");
            }
            console.log(`-----------------------------------------------------`);
            return res.status(401).json({ message: responseMessage });
            // --- End Improved Error Handling ---
        } else {
            // --- Success Case ---
            console.log(`--> Token Verification Successful for path ${req.originalUrl || req.path}`);
            console.log(`-----------------------------------------------------`);
            res.locals.jwtData = success;
            return next();
            // --- End Success Case ---
        }
    });
};