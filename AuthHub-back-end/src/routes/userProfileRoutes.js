import express from "express";
import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import db from "../config/config.js";

const router = express.Router();

// Dapatkan Profil Pengguna
router.get("/user-profile", async(req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    console.log("Token:", token);
    if (!token) {
        return res.status(401).json({ message: "Tidak diizinkan." });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        const userRef = doc(db, "users", decoded.email);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = docSnap.data();
        res.status(200).json({
            name: user.name,
            email: user.email,
            username: user.username,
            gender: user.gender,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token.", error });
    }
});

export default router;