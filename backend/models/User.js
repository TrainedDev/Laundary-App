const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const LaundryUsers = sequelize.define(
    "LaundryUsers",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Name is required" } },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email already in use" },
        validate: { isEmail: { msg: "Please provide a valid email" } },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [6], msg: "Password must be at least 6 characters" },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "staff"),
        defaultValue: "staff",
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    },
  );

  LaundryUsers.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return LaundryUsers;
};
