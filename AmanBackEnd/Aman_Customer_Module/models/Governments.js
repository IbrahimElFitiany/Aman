const { DataTypes } = require('sequelize');

const GovernmentModel = (sequelize) => {
  const Government = sequelize.define('government', {
    gov_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gov_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'governments',
    timestamps: false,
  });

  return Government;
};

module.exports = GovernmentModel;
