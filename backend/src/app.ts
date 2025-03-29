// import statements and dotenv.config() remain the same...
import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

// --- Updated CORS Configuration ---
const allowedOrigins = [
    'https://mern-ai-chatbot.netlify.app', // <<< Your Deployed Netlify URL
    'http://localhost:5173'               // <<< Your Localhost URL (check port)
];

interface CorsOptions {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
  methods: string;
  credentials: boolean;
  allowedHeaders: string[];
}

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in the allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow
    } else {
      console.error(`CORS blocked origin: ${origin}`); // Good for debugging Vercel logs
      callback(new Error('Not allowed by CORS')); // Block
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // More complete method list
  credentials: true, // Keep this for cookies/auth
  allowedHeaders: ["Content-Type", "Authorization"], // Keep allowed headers
};

app.use(cors(corsOptions)); // Use the options object

// --- Rest of your middleware and routes ---
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); // Ensure COOKIE_SECRET is set in Vercel env vars!
app.use(morgan("dev"));
app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
    res.send({
        activeStatus:true,
        error:false,
        message:"Server is running",
    })
});

export default app;