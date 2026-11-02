import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Disable framework fingerprint
app.disable("x-powered-by");

// Home route
app.get("/", (req, res) => {
    res.render("index", {
        title: "SecureTask",
        description: "DevSecOps Security Lab",
        status: "Application running successfully"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        application: "SecureTask",
        version: "1.0.0"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

export default app;