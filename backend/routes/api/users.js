const express = require('express');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

const validateSignUp = [
    check('email')
        .exists({checkFalsy: true})
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({checkFalsy: true})
        .isLength({min: 4})
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({checkFalsy: true})
        .isLength({min: 6})
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({checkFalsy: true})
        .withMessage('Please provide a first name.'),
    check('lastName')
        .exists({checkFalsy: true})
        .withMessage('Please provide a last name.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignUp, async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body;
    const user = await User.signup({firstName, lastName, email, username, password});

    await setTokenCookie(res, user);

    return res.json({
        user: user
    });
});

module.exports = router;


// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": `GVpYpXDB-ses29bdB4HhNeHyDwQ9hcBU_6VI`
//     },
//     body: JSON.stringify({
//       firstName: 'FirstX',
//       lastName: 'LastX',
//       email: 'firestar@spider.man',
//       username: 'Firestar',
//       password: 'password'
//     })
//   }).then(res => res.json()).then(data => console.log(data));
