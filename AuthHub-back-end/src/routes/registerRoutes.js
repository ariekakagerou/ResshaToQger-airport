import express from "express";
import bcrypt from "bcryptjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "../config/config.js";

const router = express.Router();

// Register
router.post("/register", async(req, res) => {
    const { name, email, password, username, gender, dateofbirth } = req.body;
    if (!name || !email || !password || !username || !gender || !dateofbirth) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRef = doc(db, "users", email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return res.status(400).json({ message: "User already exists." });
        }

        await setDoc(userRef, {
            name,
            email,
            password: hashedPassword,
            username,
            gender,
            dateofbirth,
            createdAt: new Date()
        });
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});

export default router;