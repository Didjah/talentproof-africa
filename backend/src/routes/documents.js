const router   = require("express").Router();
const multer   = require("multer");
const Document = require("../models/Document");
const Profile  = require("../models/Profile");
const { requireAuth } = require("../middleware/auth");

// Stockage local (remplacer par multer-s3 en production)
const storage = multer.diskStorage({
  destination: "uploads/documents/",
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// POST /api/documents — upload d'un document
router.post("/", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    const { profile_id, doc_type, label, issued_by, issued_at } = req.body;

    const profile = await Profile.findOne({ where: { id: profile_id, user_id: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, message: "Profil introuvable" });

    const doc = await Document.create({
      profile_id,
      doc_type,
      label,
      file_url:   req.file.path,
      issued_by,
      issued_at:  issued_at || null,
      is_private: true,
    });

    // Met à jour le flag has_document sur le profil
    await profile.update({ has_document: true });

    res.status(201).json({ success: true, document: doc });
  } catch (err) { next(err); }
});

// GET /api/documents/:profile_id — liste (propriétaire uniquement)
router.get("/:profile_id", requireAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: { id: req.params.profile_id, user_id: req.user.id },
    });
    if (!profile) return res.status(403).json({ success: false, message: "Accès refusé" });

    const docs = await Document.findAll({
      where:      { profile_id: req.params.profile_id },
      attributes: { exclude: ["file_url"] }, // URL non exposée dans la liste
    });
    res.json({ success: true, documents: docs });
  } catch (err) { next(err); }
});

module.exports = router;
