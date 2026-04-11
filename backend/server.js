require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const rateLimit   = require("express-rate-limit");
const { sequelize } = require("./src/config/database");

// Routes
const authRoutes     = require("./src/routes/auth");
const profileRoutes  = require("./src/routes/profiles");
const documentRoutes = require("./src/routes/documents");
const badgeRoutes    = require("./src/routes/badges");
const searchRoutes   = require("./src/routes/search");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Sécurité ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 req/15min

// ── Parsing ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Routes API ────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/profiles",  profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/badges",    badgeRoutes);
app.use("/api/search",    searchRoutes);

// ── Santé ─────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "TalentProof API", version: "0.1.0" });
});

// ── Erreur globale ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
});

// ── Démarrage ─────────────────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connexion PostgreSQL établie");
    return sequelize.sync({ alter: process.env.NODE_ENV === "development" });
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 TalentProof API démarrée sur http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Impossible de démarrer :", err.message);
    process.exit(1);
  });
