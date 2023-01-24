const express = require('express');

const { Spot } = require('../../db/models')
const { SpotImage, Review, User } = require('../../db/models')
const {sequelize} = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const {check} = require('express-validator')

const router = express.Router();

const validateNewSpot = [
    check('address')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .isString()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

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

router.post('/', requireAuth, validateNewSpot, async (req, res, next) => {
    // aquire req info
    const newSpotData = req.body
    const userId = req.user.id

    // add ownerId to the spot object
    newSpotData.ownerId = userId;

    // create the spot
    Spot.create(newSpotData);

    // obtain the created spot for the response
    const spot = await Spot.findOne({
        where: {
            address: newSpotData.address
        }
    })

    res.status(201).json(spot);
})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // aquire req data
    const userId = req.user.id
    const spotId = req.params.spotId;

    // get spot
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    // determine if spot exists
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    };
    // user authorization
    if(spot.ownerId !== userId){
        return res.status(403).json({
            message: "Authorization Invalid",
            statusCode: 403
        })
    };

    // put new spot data into an object
    const newSpotData = req.body;
    newSpotData.spotId = spotId

    // make the spot
    SpotImage.create(newSpotData)

    // pull the made spot for response
    const newImg = await SpotImage.findOne({
        where: {
            url: req.body.url
        }
    })

    // convert img to POJO to be able to manipulate it for res
    const plainImg = newImg.toJSON()
    delete plainImg.spotId
    delete plainImg.createdAt
    delete plainImg.updatedAt

    res.status(200).json(plainImg)

})

router.put('/:spotId', requireAuth, validateNewSpot, async(req, res, next) => {
    // get params data
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const spotData = req.body;

    // verify valid spot then valid user
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    };
    if(spot.ownerId !== userId){
        return res.status(403).json({
            message: "Authorization Invalid",
            statusCode: 403
        })
    };

    spot.update(spotData)

    res.status(200).json(spot)

})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    console.log(spot)
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    if(spot.ownerId !== req.user.id){
        return res.status(403).json({
            message: "Authorization Invalid",
            statusCode: 403
        })
    }

    await Spot.destroy({
        where: {
            id: spotId
        }
    })

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router
