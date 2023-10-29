const express = require('express');
const router = express.Router();
const ReadingList = require('../models/ReadingList');
const {tokenExtractor} = require("../util/middleware");
const {User} = require("../models");

router.post('/', async (req, res, next) => {
    try {
        const { blogId, userId } = req.body;

        const reading = await ReadingList.create({
            userId,
            blogId,
        });

        res.status(201).json(reading);
    } catch (error) {
        return next(error)
    }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {

    if(!req.body.hasOwnProperty('read')){
        const error = new Error('Read status required');
        error.name = 'ValidationError';
        return next(error);
    }

    try {
        const readinglist = await ReadingList.findByPk(req.params.id)

        if (!readinglist) {
            return next('No readinglist found')
        }

        const user= await User.findByPk(req.decodedToken.id)

        if (readinglist.userId !== user.id) {
            const error = new Error('No permission');
            error.name = 'PermissionError';
            return next(error);
        }

        readinglist.read = req.body.read

        await readinglist.save()

        console.log(JSON.stringify(readinglist, null, 2))
        return res.status(200).json(readinglist)

    } catch (error) {
        next(error)
    }
})

module.exports = router;