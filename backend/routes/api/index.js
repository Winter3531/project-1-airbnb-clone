
// backend/routes/api/index.js
const router = require('express').Router();
// GET /api/restore-user
const {restoreUser} = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

// // test route
// router.get('/restore-user', (req, res) => {
//   return res.json(req.user);
// });

// // test route
// const { requireAuth } = require('../../utils/auth.js');
// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

// //test route
// const { setTokenCookie} = require('../../utils/auth.js');
// const {User} = require('../../db/models');

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({user: user})
// });

module.exports = router;
