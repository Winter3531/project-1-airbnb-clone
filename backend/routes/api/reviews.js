const express = require('express');

const {Review, User, Spot, ReviewImage} = require('../../db/models');
const {sequelize} = require('../../db/models');
const {requireAuth} = require('../../utils/auth');
const {check} = require('express-validator');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    // get the review
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User
            },{
                model: Spot
            },{
                model: ReviewImage
            }
        ]
    })

    // convert the review and included data to a standard pojo
    const userReviewData = []
    reviews.forEach()

    res.json(reviews);
})

module.exports = router;
