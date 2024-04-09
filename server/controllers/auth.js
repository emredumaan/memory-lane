const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { server } = require('../config.json')


module.exports.signup = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong!' })
    }

    const { name, email, password } = req.body

    try {
        const users = await User.findAll({ where: { email: email } })
        if (users.length > 0) return res.status(403).json({ message: 'This email address is already in use.' })

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        })

        return res.status(200).json({ message: 'Account has been created successfully!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Something went wrong, please try again later.' })
    }
}

module.exports.signin = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong!' })
    }

    const { email, password } = req.body

    try {
        const userData = await User.findAll({ where: { email } })
        if (userData.length === 0) return res.status(403).json({ message: 'Email or password is incorrect' })

        const isPasswordMatched = await bcrypt.compare(password, userData[0].password)
        if (!isPasswordMatched) return res.status(403).json({ message: 'Email or password is incorrect' })

        const jwtToken = jwt.sign({ userId: userData[0].id }, server.jwtSecret, { expiresIn: '24h' })
        return res.status(201).json({ message: 'You are successfully signed in.', token: jwtToken, user: {id: userData[0].id,name: userData[0].name}})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Something went wrong, please try again later.' })
    }
}

module.exports.verify = (req, res) => {
    const { token } = req.query

    if (token) {
        jwt.verify(token, server.jwtSecret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({token, isValid: false})
            } else {
                const user = await User.findByPk(decoded.userId,{attributes: ['id','name','email']})
                req.user = user
                res.status(201).json({token, user, isValid: true})
            }
        })
    } else {
        return res.status(401).json({token, isValid: false})
    }
}