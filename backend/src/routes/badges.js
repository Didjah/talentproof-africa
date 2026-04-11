const router  = require("express").Router();
const Badge   = require("../models/Badge");
const Profile = require("../models/Profile");

// GET /api/badges/:profile_id — badge public du profil
router.get("/:profile_id", async (req, res, next) => {
  try {
    const badge = await Badge.findOne({
      where: { profile_id: req.params.profile_id },
      order: [["created_at", "DESC"]],
    });
    if (!badge) return res.status(404).json({ success: false, message: "Badge introuvable" });
    res.json({ success: true, badge });
  } catch (err) { next(err); }
});

module.exports = router;
