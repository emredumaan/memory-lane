const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth')
const { body } = require('express-validator')

router.get('/verify', authControllers.verify)

router.post('/signup',
    body('name').trim().notEmpty().matches(/^[a-zA-Z\s\u00C0-\u017F]+$/).isLength({ min: 2 }),
    body('email').trim().notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 }),
    body('passwordConfirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
        }),
authControllers.signup)

router.post('/signin',
    body('email').trim().notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty(),
authControllers.signin)

module.exports = router