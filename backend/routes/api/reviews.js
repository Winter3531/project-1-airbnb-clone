const express = require('express');

const {Review, User, Spot, ReviewImage, SpotImage} = require('../../db/models');
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
    reviews.forEach(data => {
        userReviewData.push(data.toJSON());
    })

    for(let i = 0; i < userReviewData.length; i++){
        const review = userReviewData[i];

        delete review.User.username;

        delete review.Spot.description
        delete review.Spot.createdAt
        delete review.Spot.updatedAt

        const preview = await SpotImage.findOne({
            where: [
                {
                    spotId: review.Spot.id
                }
            ]
        });
        review.Spot.previewImage = preview.url;

        review.ReviewImages.forEach(reviewImg => {
            delete reviewImg.reviewId
            delete reviewImg.createdAt
            delete reviewImg.updatedAt
        })
    }


    res.json({
        Reviews: userReviewData
    });
})



module.exports = router;
