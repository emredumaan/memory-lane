const jwt = require('jsonwebtoken')
const { server } = require('../config.json')
const User = require('../models/User')

module.exports = (req, res, next) => {
    const token = req.cookies.jwtToken

    if (token) {
        jwt.verify(token, server.jwtSecret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' })
            } else {
                const user = await User.findByPk(decoded.userId)
                req.user = user
                next()
            }
        })
    } else {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}