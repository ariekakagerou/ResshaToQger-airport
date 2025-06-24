import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', userProfileRoutes);

// Cek rute yang tersedia
app._router.stack.forEach((r) => {
    if (r.route) {
        console.log(r.route.path);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});