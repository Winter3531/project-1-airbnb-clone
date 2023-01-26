const express = require('express');

const {Review, User, Spot, ReviewImage, SpotImage} = require('../../db/models');
const {sequelize} = require('../../db/models');
const {requireAuth} = require('../../utils/auth');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation')

const router = express.Router();

const reviewValidation = [
    check('review')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy: true})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

// Get all Reviews by current User
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

// Add an Image to a Review by ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    // get req data
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const img = req.body.url
    const review = await Review.findOne({
        where: {
            id: reviewId
        },
        include: {
            model: ReviewImage
        },
        attributes: {
            include: [
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM ReviewImages
                    WHERE reviewId = ${reviewId}
                )`), "imgCount"],
            ]
        }
    })

    // authorize user and verify review exists
    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    };
    if(review.userId !== userId){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };


    const reviewData = review.toJSON();
    // check for image count
    if(reviewData.imgCount === 10){
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }


    // add the image
    ReviewImage.create({
        url: img,
        reviewId: reviewData.id
    })


    const newImg = await ReviewImage.findOne({
        where: {
            url: img
        }
    })

    const plainImg = newImg.toJSON();
    delete plainImg.createdAt;
    delete plainImg.updatedAt;
    delete plainImg.reviewId;

    res.json(plainImg)
})

// Edit Review
router.put('/:reviewId', requireAuth, reviewValidation, async (req, res) => {
    // get req data
    const reviewId = req.params.reviewId
    const userId = req.user.id

    const review = await Review.findOne({
        where: {
            id: reviewId
        }
    })

    // review exists && belongs to user
    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    if(review.userId !== userId){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    // update review
    review.update({
        userId: userId,
        spotId: review.spotId,
        review: req.body.review,
        stars: req.body.stars
    })


    res.json(review)
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const review = await Review.findOne({
        where: {
            id: reviewId
        }
    })


    // authorize user and verify review exists
    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    };
    if(review.userId !== userId){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    Review.destroy({
        where: {
            id: reviewId
        }
    })

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })

})

module.exports = router;
