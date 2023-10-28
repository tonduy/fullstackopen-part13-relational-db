require('dotenv').config()
const { Sequelize, DataTypes, Model} = require('sequelize');
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

app.use(express.json());

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
        Blog.sync()
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

app.get('/api/blogs', async (req, res) => {
    const notes = await Blog.findAll()
    res.json(notes)
})

app.post('/api/blogs', async (req, res) => {
    const { author, url, title, likes } = req.body;

    if (!author || !url || !title) {
        return res.status(400).json({ error: 'Author, URL, and Title are required' });
    }

    try {
        const newBlog = await Blog.create({ author, url, title, likes });
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            await blog.destroy();
            res.status(204).send();
        } else {
            return res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})