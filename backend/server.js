require("dotenv").config();
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET tanimli degil. backend/.env dosyasini olusturun (ornek: backend/.env.example).");
  process.exit(1);
}
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { initDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.get("/api-docs.json", (req, res) => res.status(200).json(swaggerSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
