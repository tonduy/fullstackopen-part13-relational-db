const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog
        }
    })
    res.json(users)
})

router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id
        const read = req.query.read
        const where = {}

        if (read === 'true' || read === 'false') {
            where.read = (read === 'true')
        }

        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ['id']
            },
            include: {
                model: Blog,
                as: 'readings',
                attributes: {
                    exclude: ['userId'],
                    include: ['yearWritten']
                },
                through: {
                    as: 'readinglists',
                    attributes: ['read', 'id'],
                    where
                },
            }
        })

        if (!user) {
            const error = new Error('User not found');
            error.name = 'ValidationError';
            return next(error);
        }

        res.status(200).json({
            user
        })
    } catch (error) {
        return next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch(error) {
        next(error)
    }
})

router.put('/:username', async (req, res, next) => {
    if(!req.body.username){
        const error = new Error('Username required');
        error.name = 'ValidationError';
        return next(error);
    }
    const user = await User.findOne({username: req.params.username})
    if (user) {
        user.username = req.body.username;
        try {
            await user.save();
            res.status(200).json(user);
        } catch (error){
            return next(error);
        }
    } else {
        res.status(404).end()
    }
})

module.exports = router