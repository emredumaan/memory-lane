const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const authJwt = require('../middlewares/authJwt')

const { body } = require('express-validator')
const sanitizeHtml = require('sanitize-html')

router.post('/create', authJwt,
    body('title').trim().notEmpty(),
    body('isPublic').isBoolean(),
    body('content').customSanitizer((value) => {
        return sanitizeHtml(value, {
            allowedTags: ['p', 'b', 'i', 's', 'pre', 'strong', 'em', 'br', 'mark', 'code', 'blockquote', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'hr']
        })
    }),
    userControllers.saveLane)

router.post('/change-name', authJwt,
    body('newName').trim().notEmpty().matches(/^[a-zA-Z\s\u00C0-\u017F]+$/).isLength({ min: 2 }),
    userControllers.changeName)

router.post('/change-password', authJwt,
    body('currentPassword').notEmpty(),
    body('newPassword').notEmpty().isLength({ min: 6 }),
    body('newPasswordConfirm')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match')
            }
            return true
        }),
    userControllers.changePassword)

router.get('/my-lanes', authJwt, userControllers.getMyLanes)

router.post('/delete-lane', authJwt, userControllers.deleteLane)

router.get('/get-lane', userControllers.getLane)

router.get('/get-public-lanes', userControllers.getPublicLanes)

router.delete('/delete-user', authJwt, userControllers.deleteUser)

module.exports = router