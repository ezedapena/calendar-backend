// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { fieldValidator } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');


const { registerUser, loginUser, renewToken } = require('../controllers/authController');

router.post(
    '/register',
    [
        check('name', 'Name is necessary').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'The password must include 6 characters').isLength({ min: 6 }),
        fieldValidator
    ],
    registerUser);

router.post(
    '/',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'The password must include 6 characters').isLength({ min: 6 }),
        fieldValidator
    ],
    loginUser);

router.get('/renew', validateJWT,  renewToken);

module.exports = router;