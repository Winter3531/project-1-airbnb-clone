const express = require('express');

const { Spot } = require('../../db/models')
const { SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')
const { sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator')
const {Op} = require('sequelize')

const router = express.Router();

const validateNewSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const reviewValidation = [
    check('review')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

// const dateValidator = [
//     check('startDate')
//         .exists({ checkFalsy: true })
//         // .isBefore('endDate')
//         .withMessage("startDate must be before endDate"),
//     check('endDate')
//         .exists({ checkFalsy: true })
//         // .isAfter('startDate')
//         .withMessage("endDate cannot be on or before startDate"),
//     handleValidationErrors
// ]

/*************** Get All Spots *******************/
router.get('/', async (req, res) => {
    // get req and query data
    let { page, size, minLat, maxLat, minLng,
         maxLng, minPrice, maxPrice } = req.query
    page = Number(page);
    size = Number(size);

    if (!size || size > 20 || size < 0) size = 20
    if (!page || page > 10 || page < 0) page = 1
    if (!minLat) minLat = -90
    if (!maxLat) maxLat = 90
    if (!minLng) minLng = -180
    if (!maxLng) maxLng = 180
    if (!minPrice) minPrice = 0
    if (!maxPrice) maxPrice = 100000
    // get all spots
    const allSpots = await Spot.findAll({
        where:{
            lat: {[Op.between]: [minLat, maxLat],},
            lng: {[Op.between]: [minLng, maxLng],},
            price: {[Op.between]: [minPrice, maxPrice],},
        },
        include: [
            {
                model: SpotImage
            }
        ],
        // attributes: {
        //     include: [
        //         [sequelize.literal(`(
        //             SELECT AVG(stars)
        //             FROM Reviews
        //             WHERE spotId = Spot.id)`
        //         ), "avgRating"],
        //     ]
        // }
        limit: size,
        offset: (page - 1)* size
    });

    const spotsList = [];
    allSpots.forEach(spot => {
        spotsList.push(spot.toJSON());
    })

    // spotsList.forEach(spot => {
    for await (let spot of spotsList) {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'None'
        }
        // avgRating
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        })
        let count = 0
        for await (let rev of reviews) {
            count += Number(rev.stars);
        }
        const avg = count / reviews.length;
        spot.avgRating = avg;
        if (!spot.avgRating) {
            spot.avgRating = 'None'
        }

        delete spot.SpotImages
    }
    spotsList.page = page;
    spotsList.size = size;

    res.json({
        Spots: spotsList,
        page,
        size
    })
    // res.json(allSpots)
})

/**************** Get all Spots owned by Current User ***************/
router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id
    const allSpots = await Spot.findAll({
        where: {
            ownerId: id
        },
        include: [
            {
                model: SpotImage
            }, {
                model: Review
            }
        ],
        // attributes: {
        //     include: [
        //         [sequelize.literal(`(
        //             SELECT AVG(stars)
        //             FROM Reviews
        //             WHERE spotId = Spot.id)`
        //         ), "avgRating"],
        //     ]
        // }
    })
    const spotsList = [];
    allSpots.forEach(spots => {
        spotsList.push(spots.toJSON());
    });

    // spotsList.forEach(spot => {
    for await (let spot of spotsList) {
        delete spot.Reviews
        spot.SpotImages.forEach(images => {
            if (images.preview === true) {
                spot.previewImage = images.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'None'
        }
        // avgRating
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        })
        let count = 0
        for await (let rev of reviews) {
            count += Number(rev.stars);
        }
        const avg = count / reviews.length;
        spot.avgRating = avg;
        if (!spot.avgRating) {
            spot.avgRating = 'None'
        }
        delete spot.SpotImages
    }


    res.json({
        Spots: spotsList
    })
})

/**************** Get specific Spot by ID ****************/
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId;

    // console.log(id)

    const spot = await Spot.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: SpotImage
            }, {
                model: Review
            }, {
                model: User
            }
        ],
        // attributes: {
        //     include: [
        //         [sequelize.literal(`(
        //             SELECT COUNT(*)
        //             FROM Reviews
        //             WHERE spotId = ${id}
        //         )`), "numReviews"],
        //         // [sequelize.literal(`(
        //         //     SELECT AVG(stars)
        //         //     FROM Reviews
        //         //     WHERE spotId = ${id})`
        //         // ), "avgStarRating"],
        //     ],
        // },
    })

    if (!spot) {
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

    // avgRating
    let count = 0
    for await (let rev of spotData.Reviews) {
        count += Number(rev.stars);
    }
    const avg = count / spotData.Reviews.length;
    spotData.avgStarRating = avg;

    if (!spotData.avgStarRating) {
        spotData.avgStarRating = 'None'
    }

    // numReviews
    spotData.numReviews = spotData.Reviews.length

    delete spotData.Reviews

    spotData.SpotImages.forEach(spot => {
        delete spot.spotId;
        delete spot.createdAt;
        delete spot.updatedAt;
    })

    return res.json(spotData)
})

/***************** Create New Spot *****************/
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

/****************** Add Image to Spot by ID ***************/
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
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    };
    // user authorization
    if (spot.ownerId !== userId) {
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

/*************** Edit specific Spot by ID **************/
router.put('/:spotId', requireAuth, validateNewSpot, async (req, res, next) => {
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
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    };
    if (spot.ownerId !== userId) {
        return res.status(403).json({
            message: "Authorization Invalid",
            statusCode: 403
        })
    };

    spot.update(spotData)

    res.status(200).json(spot)

})

/************** Get Reviews for Spot by ID ***********/
router.get('/:spotId/reviews', async (req, res) => {
    // get req data
    const spotId = req.params.spotId;

    // spot exists?
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // get reviews
    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User
            }, {
                model: ReviewImage
            }
        ]
    })

    const reviewData = []
    reviews.forEach(data => {
        reviewData.push(data.toJSON());
    })

    reviewData.forEach(data => {
        delete data.User.username
        data.ReviewImages.forEach(img => {
            delete img.reviewId;
            delete img.createdAt;
            delete img.updatedAt;
        })
    })

    res.json({
        Reviews: reviewData
    })
})

/**************** Create Review for Spot by ID **************/
router.post('/:spotId/reviews', requireAuth, reviewValidation, async (req, res) => {
    // get req data
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: {
            model: Review
        }
    })

    // spot exists?
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    console.log(userId)

    // user already has a review for the spot?
    for await (rev of spot.Reviews) {
        if (rev.userId === userId) {
            return res.status(403).json({
                message: "User already has a review for this spot",
                statusCode: 403
            })
        }

    }


    const reviewData = Review.create({
        userId,
        spotId,
        review: req.body.review,
        stars: req.body.stars
    })

    const newReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
    })



    res.status(201).json(newReview)
})

/**************** Get all Bookings by Spot ID **************/
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    // get req data
    const user = req.user.id;
    const spotId = req.params.spotId;

    // verify spot exists
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    };

    // console.log(spot.ownerId, user, spot.id, spotId)

    // If spot owner response
    if (spot.ownerId === user) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: {
                model: User
            }
        })

        const bookingsData = []
        bookings.forEach(data => {
            bookingsData.push(data.toJSON())
        })

        for await (data of bookingsData) {
            delete data.User.username;
        }



        res.json({
            Bookings: bookingsData
        })
    } else {
        // spot owner is not the user
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        })

        const bookingsData = [];
        bookings.forEach(data => {
            bookingsData.push(data.toJSON());
        })

        for await (data of bookingsData) {
            delete data.spotId
            delete data.userId
            delete data.createdAt
            delete data.updatedAt
        }

        res.json({
            Bookings: bookingsData
        })
    }
})

/************** Create Booking by Spot Id ************/
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    // get req data
    const user = req.user.id;
    const spotId = Number(req.params.spotId);
    const { startDate, endDate } = req.body;
    const testStart = new Date(startDate);
    const testEnd = new Date(endDate);

    if (testStart.getTime() > testEnd.getTime()) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: [
                "endDate cannot be before StartDate"
            ]
        })
    }

    // Spot exists?
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })
    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // overlap bookings
    const allBookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    for await (data of allBookings) {
        const bookingStart = new Date(data.startDate).getTime();
        const bookingEnd = new Date(data.endDate).getTime();

        if ((testStart.getTime() >= bookingStart && testStart.getTime() <= bookingEnd)
            || (testEnd.getTime() >= bookingStart && testEnd.getTime() <= bookingEnd)
            || (testStart.getTime() <= bookingStart && testEnd.getTime() >= bookingEnd)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: [
                    "Start date conflicts with an existing booking",
                    "End date conflicts with an existing booking"
                ]
            })
        }
    }

    // create the booking
    const newBooking = await Booking.create({
        spotId: spotId,
        userId: user,
        startDate: testStart,
        endDate: testEnd
    })

    res.json(newBooking)
})

/******** Delete Spot **********/
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    console.log(spot)
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    if (spot.ownerId !== req.user.id) {
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
