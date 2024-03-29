'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  History.init(
    {
      // viet nhung thuoc tinh cua History vao day
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      files: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'History'
    }
  );
  return History;
};
