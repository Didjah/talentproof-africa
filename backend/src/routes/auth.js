const router  = require("express").Router();
const jwt     = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User    = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
router.post("/register",
  body("phone").notEmpty().trim(),
  body("password").isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    try {
      const { phone, email, password, role } = req.body;
      const user = await User.create({
        phone,
        email:         email || null,
        password_hash: password,
        role:          role === "recruteur" ? "recruteur" : "talent",
      });
      res.status(201).json({ success: true, token: sign(user.id), user: { id: user.id, phone: user.phone, role: user.role } });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return res.status(409).json({ success: false, message: "Ce numéro est déjà enregistré" });
      next(err);
    }
  }
);

// POST /api/auth/login
router.post("/login",
  body("phone").notEmpty(),
  body("password").notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    try {
      const { phone, password } = req.body;
      const user = await User.findOne({ where: { phone } });
      if (!user || !(await user.checkPassword(password)))
        return res.status(401).json({ success: false, message: "Identifiants incorrects" });

      res.json({ success: true, token: sign(user.id), user: { id: user.id, phone: user.phone, role: user.role } });
    } catch (err) { next(err); }
  }
);

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
