const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const User = require('./User');
const Blog = require('./Blog');

class ReadingList extends Model {}

ReadingList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Blog, key: 'id' },
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_list',
    tableName: 'reading_list'
});

module.exports = ReadingList;