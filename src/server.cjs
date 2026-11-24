
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET is required");
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "student" && password === "1234") {
        const token = jwt.sign(
            { username },
            SECRET,
            { expiresIn: "1h" }
        );

        return res.json({ token });
    }

    res.status(401).json({
        message: "Invalid username or password"
    });
});

// Protected endpoint
app.get("/dashboard", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token required"
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        res.json({
            message: `Welcome, ${decoded.username}!`,
            username: decoded.username
        });
    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
