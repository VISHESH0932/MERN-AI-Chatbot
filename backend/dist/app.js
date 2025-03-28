import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
dotenv.config();
// dotenv.config({ path:resolve(__dirname, '../../.env') });
const app = express();
//middlewares
app.use(cors({
    origin: ["http://localhost:5173", "https://mern-ai-chatbot.netlify.app/"] // Allow frontend
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
app.get("/", (req, res) => {
    res.send({
        activeStatus: true,
        error: false,
        message: "Server is running",
    });
});
export default app;
