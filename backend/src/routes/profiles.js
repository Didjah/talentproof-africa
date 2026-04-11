const router  = require("express").Router();
const Profile = require("../models/Profile");
const Badge   = require("../models/Badge");
const { requireAuth } = require("../middleware/auth");

// GET /api/profiles/:id — profil public
router.get("/:id", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { id: req.params.id, is_published: true },
    });
    if (!profile) return res.status(404).json({ success: false, message: "Profil introuvable" });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
});

// POST /api/profiles — création
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { full_name, job_title, city, country, availability, bio, years_experience, profile_type } = req.body;
    const profile = await Profile.create({
      user_id: req.user.id,
      profile_type: profile_type || "simple",
      full_name, job_title, city, country, availability, bio, years_experience,
    });

    // Badge initial : aucune preuve
    await Badge.create({
      profile_id: profile.id,
      badge_type: "aucune_preuve",
    });

    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
});

// PATCH /api/profiles/:id — mise à jour
router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, message: "Profil introuvable" });

    await profile.update(req.body);
    await refreshBadge(profile);

    res.json({ success: true, profile });
  } catch (err) { next(err); }
});

// Recalcule le badge de confiance après mise à jour du profil
async function refreshBadge(profile) {
  let badge_type = "aucune_preuve";
  if (profile.has_document && profile.has_video) badge_type = "profil_verifie";
  else if (profile.has_document) badge_type = "document_disponible";
  else if (profile.has_video)    badge_type = "video_disponible";

  await Badge.upsert({ profile_id: profile.id, badge_type });
}

module.exports = router;
