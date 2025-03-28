import express from "express";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { fileURLToPath } from "url";
import path from "path";
// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve frontend build directly from frontend/dist
app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});
const PORT = process.env.PORT || 5000;
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log(`Server Open & connected To database 🤖 on port ${PORT}`));
})
    .catch((err) => console.log(err));
