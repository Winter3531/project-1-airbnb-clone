const express = require('express');

const { User, Review, Spot, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

/************* Get Current User Bookings *************/
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

    // edit the booking object for res
    const userBookingsData = []
    userBookings.forEach(data => {
        userBookingsData.push(data.toJSON());
    })

    for await (booking of userBookingsData) {
        delete booking.Spot.description
        delete booking.Spot.createdAt
        delete booking.Spot.updatedAt

        // add preview image
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

/**************** Edit a Booking by Id ****************/
router.put('/:bookingId', requireAuth, async (req, res) => {
    // get req data
    const user = req.user.id;
    const bookingId = Number(req.params.bookingId);
    const { startDate, endDate } = req.body;
    const testStart = new Date(startDate);
    const testEnd = new Date(endDate);

    // booking exists?
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    // console.log(booking.toJSON())
    if (!booking) {
        return res.status(404).json({
            messsage: "Booking couldn't be found",
            statusCode: 404
        })
    }
    if (new Date(startDate).getTime() < new Date().getTime()) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    }
    const bookingStart = new Date(booking.startDate).getTime();
    const bookingEnd = new Date(booking.endDate).getTime();

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

    booking.update({
        startDate,
        endDate
    })

    res.json(booking)
})

/**************** Delete Booking by Id ****************/
router.delete('/:bookingId', requireAuth, async (req, res) => {
    // get req data
    const user = req.user.id;
    const bookingId = Number(req.params.bookingId);

    // booking exists?
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }

    // booking owner or spot owner?
    const spot = await Spot.findOne({
        where: {
            id: booking.spotId
        }
    })

    if ((booking.userId === user) || (spot.ownerId === user)) {
        // did the booking start?
        if (new Date().getTime() > new Date(booking.startDate).getTime()) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted",
                statusCode: 403
            })
        }

        // delete booking
        Booking.destroy({
            where: {
                id: bookingId
            }
        })

        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }

    // unauthorized
    res.status(403).json({
        message: "Forbidden",
        statusCode: 403
    })
})

module.exports = router;
