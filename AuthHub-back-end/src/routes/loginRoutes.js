import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import db from "../config/config.js";

const router = express.Router();

// Login
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const userRef = doc(db, "users", email);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const user = docSnap.data();
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

export default router;