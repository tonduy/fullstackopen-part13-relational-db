const {Model, DataTypes} = require("sequelize")
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
        yearWritten: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Year must be integer',
                },
                min: {
                    args: 1991,
                    msg: 'Year minimum is 1991',
                },
                max: {
                    args: new Date().getFullYear(),
                    msg: 'Year cannot be greater than current year',
                },
            },
        }
    },
    {
        sequelize,
        modelName: 'blogs',
        tableName: 'blogs',
        timestamps: false,
        underscored: true,
    }
)

module.exports = Blog