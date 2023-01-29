const express = require('express');

const { User, Review, Spot, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
        // get req data
        const user = req.user.id
        const imageId = Number(req.params.imageId);

        // image exists?
        const reviewImage = await ReviewImage.findOne({
            where: {
                id: imageId
            }
        })

        if (!reviewImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found",
                statusCode: 404
            })
        }

        // spot belongs to user?
        const review = await Review.findOne({
            where: {
                id: reviewImage.reviewId
            }
        })

        if (user !== review.userId) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            })
        }

        // delete spotImage
        ReviewImage.destroy({
            where: {
                id: imageId
            }
        })

        res.status(200).json({
            message: "Successfully deleted",
            statusCode: 200
        })
})

module.exports = router;
