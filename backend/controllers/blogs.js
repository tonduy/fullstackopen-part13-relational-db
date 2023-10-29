const router = require('express').Router()
const { Blog, User} = require('../models')
const {Op} = require("sequelize");
const {tokenExtractor} = require("../util/middleware");


const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (req.blog){
        next()
    } else {
        const error = new Error('Blog not found');
        next(error);
    }
}

router.get('/', async (req, res) => {
    const { search } = req.query;

    const findAllOptions = {
        include: {
            model: User
        },
        order: [['likes', 'DESC']]
    };

    if (search) {
        findAllOptions.where = {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    author: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]

        };
    }


    const blogs = await Blog.findAll(findAllOptions)
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    const { author, url, title, likes } = req.body;

    if (!author || !url || !title) {
        const error = new Error('Author, URL, and Title are required');
        error.name = 'ValidationError';
        return next(error);
    }

    try {
        const user= await User.findByPk(req.decodedToken.id)
        const newBlog = await Blog.create({ author, url, title, likes, userId: user.id });
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Error:', error);
        next(error)
    }
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
    try {
        if (req.blog) {
            const user= await User.findByPk(req.decodedToken.id)

            if (req.blog.userId === user.id){
                await req.blog.destroy();
                res.status(204).send();
            } else {
                const error = new Error('No permission');
                error.name = 'PermissionError';
                return next(error);
            }

        } else {
            return res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return next(error)
    }
});

router.put('/:id', blogFinder, async (req, res, next) => {
    if (!req.body.likes){
        const error = new Error('Likes are required');
        error.name = 'ValidationError';
        return next(error);
    }

    if (req.blog) {
        req.blog.likes = req.body.likes;
        try {
            await req.blog.save();
            res.status(200).json(req.blog);
        } catch (error) {
            next(error);
        }
    } else {
        return res.status(404).end();
    }

});

module.exports = router