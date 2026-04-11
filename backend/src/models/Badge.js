const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Badge — badge de confiance généré automatiquement
 * Compatible Open Badges 3.0 (IMS Global)
 */
const Badge = sequelize.define("Badge", {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  profile_id: {
    type:      DataTypes.UUID,
    allowNull: false,
  },
  badge_type: {
    type:      DataTypes.ENUM(
      "aucune_preuve",
      "document_disponible",
      "video_disponible",
      "profil_verifie",    // document + vidéo
      "valide_par_pairs",  // profil PRO
      "certifie_partenaire"
    ),
    allowNull: false,
  },
  issued_by: {
    type:         DataTypes.STRING(150),
    defaultValue: "TalentProof",
  },
  metadata: {
    type:    DataTypes.JSONB,
    comment: "Données Open Badges 3.0 (JSON-LD)",
  },
}, {
  tableName:   "badges",
  timestamps:  true,
  underscored: true,
});

module.exports = Badge;
