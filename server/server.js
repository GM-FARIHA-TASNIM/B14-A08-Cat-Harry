require("dotenv").config();
const bookingRoutes = require("./routes/booking.routes");

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const studioRoutes = require("./routes/studio.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Home API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudioSpace Server is running!",
  });
});

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// Studio Routes
app.use("/api/studios", studioRoutes);
app.use("/api/bookings", bookingRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`StudioSpace Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
