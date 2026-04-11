const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt        = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type:          DataTypes.UUID,
    defaultValue:  DataTypes.UUIDV4,
    primaryKey:    true,
  },
  phone: {
    type:      DataTypes.STRING(20),
    allowNull: false,
    unique:    true,
    comment:   "Numéro WhatsApp / téléphone — identifiant principal",
  },
  email: {
    type:      DataTypes.STRING,
    allowNull: true,
    unique:    true,
    validate:  { isEmail: true },
  },
  password_hash: {
    type:      DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type:         DataTypes.ENUM("talent", "recruteur", "admin"),
    defaultValue: "talent",
  },
  is_verified: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
  preferred_language: {
    type:         DataTypes.STRING(5),
    defaultValue: "fr",
    comment:      "fr | en | sw | ar | pt | ha",
  },
}, {
  tableName:  "users",
  timestamps: true,
  underscored: true,
});

// Hash du mot de passe avant sauvegarde
User.beforeCreate(async (user) => {
  user.password_hash = await bcrypt.hash(user.password_hash, 12);
});

User.prototype.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password_hash);
};

module.exports = User;
