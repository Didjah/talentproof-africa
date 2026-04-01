const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Document — pièces jointes optionnelles d'un profil
 * Accès privé par défaut : seul le recruteur autorisé peut voir le fichier.
 */
const Document = sequelize.define("Document", {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  profile_id: {
    type:      DataTypes.UUID,
    allowNull: false,
  },
  doc_type: {
    type:      DataTypes.ENUM("diplome", "certificat", "attestation", "autre"),
    allowNull: false,
  },
  label: {
    type:    DataTypes.STRING(150),
    comment: "Ex: BTS Génie Civil 2022 — Université de Dakar",
  },
  file_url: {
    type:      DataTypes.STRING,
    allowNull: false,
    comment:   "URL S3/R2 — accès signé, non public",
  },
  is_private: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
    comment:      "Documents privés par défaut",
  },
  issued_by: {
    type:    DataTypes.STRING(150),
    comment: "Institution émettrice",
  },
  issued_at: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName:   "documents",
  timestamps:  true,
  underscored: true,
});

module.exports = Document;
