const { fn, col, literal } = require('sequelize');
const {Blog} = require("../models");
const router = require('express').Router()

router.get('/', async (req, res, next) => {
    try {
        const author = await Blog.findAll({
            attributes: [
                [fn('COUNT', col('author')), 'articles'],
                [fn('SUM', col('likes')), 'likes'],
                'author'
            ],
            group: ['author'],
            order: [[literal('likes DESC')]]
        });

        const result = author.map(data => ({
            author: data.author,
            articles: data.dataValues.articles,
            likes: data.dataValues.likes
        }));

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return next(error)
    }
});

module.exports = router