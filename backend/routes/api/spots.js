const express = require('express');

const { Spot } = require('../../db/models')
const { SpotImage, Review, User } = require('../../db/models')
const {sequelize} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: SpotImage
            }
        ],
        attributes: {
            include: [
                [sequelize.literal(`(
                    SELECT AVG(stars)
                    FROM Reviews
                    WHERE spotId = Spot.id)`
                ), "avgRating"],
            ]
        }
    });

    const spotsList = [];
    allSpots.forEach(spot => {
        spotsList.push(spot.toJSON());
    })

    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'None'
        }
        if(!spot.avgRating){
            spot.avgRating = 'None'
        }
        delete spot.SpotImages
    })

    res.json(spotsList)
})

router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id
    const allSpots = await Spot.findAll({
        where: {
            ownerId: id
        },
        include: [
            {
                model: SpotImage
            },{
                model: Review
            }
        ],
        attributes: {
            include: [
                [sequelize.literal(`(
                    SELECT AVG(stars)
                    FROM Reviews
                    WHERE spotId = Spot.id)`
                ), "avgRating"],
            ]
        }
    })
    const spotsList = [];
    allSpots.forEach(spots => {
        spotsList.push(spots.toJSON());
    });

    spotsList.forEach(spot => {
        delete spot.Reviews
        spot.SpotImages.forEach(images => {
            if (images.preview === true){
                spot.previewImage = images.url
            }
        })
        if(!spot.previewImage){
            spot.previewImage = 'None'
        }
        if(!spot.avgRating){
            spot.avgRating = 'None'
        }
        delete spot.SpotImages
    })


    res.json({
        Spots: spotsList
    })
})

router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId;

    console.log(id)

    const spot = await Spot.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: SpotImage
            },{
                model: Review
            },{
                model: User
            }
        ],
        attributes: {
            include: [
                [sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Reviews
                    WHERE spotId = ${id}
                )`), "numReviews"],
                [sequelize.literal(`(
                    SELECT AVG(stars)
                    FROM Reviews
                    WHERE spotId = ${id})`
                ), "avgStarRating"],
            ],
        },
    })

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.statusCode = 404;
        console.log(err)
        return res.json({
            message: err.message,
            statusCode: err.statusCode
        })
    }

    const spotData = spot.toJSON();

    spotData.Owner = spotData.User
    delete spotData.Owner.username
    delete spotData.User

    delete spotData.Reviews

    spotData.SpotImages.forEach(spot => {
        delete spot.spotId;
        delete spot.createdAt;
        delete spot.updatedAt;
    })

    return res.json(spotData)
})


module.exports = router
