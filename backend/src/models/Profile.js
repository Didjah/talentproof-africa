const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Profile = sequelize.define("Profile", {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  user_id: {
    type:      DataTypes.UUID,
    allowNull: false,
  },
  profile_type: {
    type:         DataTypes.ENUM("simple", "pro"),
    defaultValue: "simple",
    comment:      "simple = Moovijob-style | pro = vidéo + validation pairs",
  },
  // ── Informations de base ──────────────────────────────────
  full_name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  job_title: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    comment:   "Ex: Maçon, Développeur, Couturière",
  },
  city: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type:      DataTypes.STRING(5),
    allowNull: false,
    comment:   "Code ISO pays : SN, CI, CM, NG…",
  },
  availability: {
    type:         DataTypes.ENUM("immediate", "1_month", "negotiable"),
    defaultValue: "negotiable",
  },
  // ── Description ──────────────────────────────────────────
  bio: {
    type:    DataTypes.TEXT,
    comment: "Description libre ou générée par IA",
  },
  years_experience: {
    type: DataTypes.SMALLINT,
  },
  // ── Médias ───────────────────────────────────────────────
  avatar_url: {
    type: DataTypes.STRING,
  },
  video_url: {
    type:    DataTypes.STRING,
    comment: "URL S3/R2 de la vidéo de démonstration",
  },
  // ── Flags de confiance (calculés automatiquement) ────────
  has_document: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
  has_video: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_peer_validated: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
    comment:      "Validé par un pair — profils PRO uniquement",
  },
  // ── Visibilité ────────────────────────────────────────────
  is_published: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName:   "profiles",
  timestamps:  true,
  underscored: true,
});

module.exports = Profile;
