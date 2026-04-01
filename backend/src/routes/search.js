const router  = require("express").Router();
const { Op }  = require("sequelize");
const Profile = require("../models/Profile");
const Badge   = require("../models/Badge");

/**
 * GET /api/search?metier=maçon&ville=Dakar&pays=SN&has_video=true&has_document=true
 */
router.get("/", async (req, res, next) => {
  try {
    const { metier, ville, pays, has_video, has_document, page = 1, limit = 20 } = req.query;

    const where = { is_published: true };

    if (metier) where.job_title = { [Op.iLike]: `%${metier}%` };
    if (ville)  where.city      = { [Op.iLike]: `%${ville}%` };
    if (pays)   where.country   = pays.toUpperCase();
    if (has_video    === "true") where.has_video    = true;
    if (has_document === "true") where.has_document = true;

    const { count, rows } = await Profile.findAndCountAll({
      where,
      include: [{ model: Badge, as: "badge", attributes: ["badge_type"] }],
      limit:   parseInt(limit),
      offset:  (parseInt(page) - 1) * parseInt(limit),
      order:   [["updated_at", "DESC"]],
      attributes: { exclude: ["user_id"] },
    });

    res.json({
      success: true,
      total:   count,
      page:    parseInt(page),
      pages:   Math.ceil(count / parseInt(limit)),
      results: rows,
    });
  } catch (err) { next(err); }
});

module.exports = router;
