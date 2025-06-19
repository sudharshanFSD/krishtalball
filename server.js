const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const transferRoutes = require("./routes/transferRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const expenditureRoutes = require("./routes/expenditureRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://militarymanagement.netlify.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/assets", transferRoutes);
app.use("/api/assets", assignmentRoutes);
app.use("/api/asset", expenditureRoutes);
app.use("/api/asset", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/asset",purchaseRoutes);

// Connect DB and start server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("MongoDB connection failed:", err.message);
});
