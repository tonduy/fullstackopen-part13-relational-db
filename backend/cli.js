require('dotenv').config()
const { Sequelize, DataTypes, Model} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL)

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

const main = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
        const blogs = await Blog.findAll();
        blogs.forEach((blog) => {
            console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
        });
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await sequelize.close();
    }
}

main()