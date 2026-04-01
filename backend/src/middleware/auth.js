const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Vérifie le token JWT et attache req.user à la requête.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Non authentifié" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findByPk(payload.id, {
      attributes: ["id", "phone", "role", "is_verified"],
    });
    if (!user) throw new Error("Utilisateur introuvable");
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
}

/**
 * Restreint l'accès à certains rôles.
 * Usage : requireRole("recruteur") ou requireRole("admin")
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
