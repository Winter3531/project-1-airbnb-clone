const express = require('express');

const { User, Review, Spot, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Get Current User Bookings
router.get('/current', requireAuth, async (req, res) => {
    // get req data
    const user = req.user.id;

    // get the bookings
    const userBookings = await Booking.findAll({
        where: {
            userId: user
        },
        include: [
            {
                model: Spot
            }
        ]
    })


    const userBookingsData = []
    userBookings.forEach(data => {
        userBookingsData.push(data.toJSON());
    })



    // userBookingsData.forEach(booking =>
    for await ( booking of userBookingsData){
        delete booking.Spot.description
        delete booking.Spot.createdAt
        delete booking.Spot.updatedAt

        const img = await SpotImage.findOne({
            where: {
                spotId: booking.spotId
            }
        })

        booking.Spot.previewImage = img.url
    }

    res.json({
        Bookings: userBookingsData
    })
})


module.exports = router;
