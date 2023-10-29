const {Model, DataTypes} = require("sequelize");
const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        author: {
            type: DataTypes.STRING,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'blogs',
        tableName: 'blogs', // Specify the table name to match your existing "blogs" table
        timestamps: false,
        underscored: true,
    }
);

module.exports = Blog