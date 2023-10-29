const router = require('express').Router()

const Session = require("../models/session")
const {tokenExtractor} = require("../util/middleware");


router.delete('/', tokenExtractor, async (req, res, next) => {

    try {
        const session = await Session.findOne({
            where: {
                userId: req.decodedToken.id,
                token: req.token,
            },
        });

        if (session) {
            await session.destroy();
            return res.status(200).json({ message: 'Logged out successfully' })
        } else {
            const error = new Error('Session not found');
            error.name = 'ValidationError';
            return next(error);
        }
    } catch (error) {
        return next(error);
    }
})

module.exports = router