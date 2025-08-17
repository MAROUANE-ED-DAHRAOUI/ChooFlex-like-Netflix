const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const movieRoutes = require("./routes/movies");

const listRoutes = require("./routes/list");
const seriesRoutes = require("./routes/series");

dotenv.config();

if (!process.env.URL_MONGO) {
  console.error("ERROR: URL_MONGO is not set in .env file");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is not set in .env file");
  process.exit(1);
}

mongoose.connect(process.env.URL_MONGO)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// CORS middleware - Allow requests from frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ChooFlex API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/series", seriesRoutes);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
