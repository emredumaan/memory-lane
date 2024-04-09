
const Lane = require('../models/Lane')
const User = require('../models/User')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { server } = require('../config.json')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

module.exports.saveLane = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong!' })
    }

    const { title, content, isPublic } = req.body
    try {
        const lane = await req.user.createLane({ title, content, isPublic })
        res.status(200).json({ message: 'Your Lane has been created successfully!', lane: lane.id })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!' })
    }
}

module.exports.getMyLanes = async (req, res) => {
    try {
        const whereObject = {
            userId: req.user.id
        }

        const options = {
            limit: parseInt(req.query.limit),
            order: [['id', 'DESC']],
            attributes: ['id', 'title', 'createdAt', 'isPublic'],
            where: whereObject
        }

        if (req.query.filter === 'public') whereObject.isPublic = true
        if (req.query.filter === 'private') whereObject.isPublic = false
        if (req.query.search) whereObject.title = { [Op.like]: `%${decodeURI(req.query.search)}%` }

        const lanes = await Lane.findAll(options)
        const totalCount = await Lane.count({ where: whereObject })
        res.status(200).json({ lanes, totalCount })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong.' })
    }
}

module.exports.deleteLane = async (req, res) => {

    try {
        const lanes = await req.user.getLanes({
            where: {
                id: req.body.id
            }
        })

        if (lanes.length === 0) throw Error('Unauthorized user')
        await lanes[0].destroy()

        res.status(200).json({
            message: 'Lane deleted successfully.'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Soemthing went wrong. Please try again.'
        })
    }

}

module.exports.getLane =async  (req, res) => {
    const { id } = req.query
    if(isNaN(id)) return res.status(200).json({notFound: true})

    const token = req.cookies.jwtToken
    let user = null
    if (token) {
        jwt.verify(token, server.jwtSecret, async (err, decoded) => {
            if (!err) {
                user = decoded.userId
            }
        })
    }
    
    try {
        const lane = await Lane.findByPk(id)
        if (!lane) return res.status(200).json({notFound: true})
        const author = await User.findAll({attributes: ['id','name'], where: {id: lane.userId}}) 
        if(lane.isPublic) return res.status(200).json({lane,author: author[0]})
        if(lane.userId === user) return res.status(200).json({lane,author: author[0]})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong while getting the lane.'})
    } 
}

module.exports.getPublicLanes = async (req,res) => {
    try {
        const lanes = await Lane.findAll({where: {isPublic: true}, order: [['id', 'DESC']], limit: 20 })
        res.status(200).json({lanes})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong while getting the lanes.'})
    }
}

module.exports.changeName = async (req,res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong!' })
    }
    
    try {
        await req.user.update({name:req.body.newName})
        res.status(200).json({message: 'Name has been changed successfully!'})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong.'})
    }
}

module.exports.changePassword = async (req,res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong!' })
    }

    try {
        const match = await bcrypt.compare(req.body.currentPassword,req.user.password)
        if(!match) return res.status(400).json({ message: 'Current password is not correct.' })

        const newPassHashed = await bcrypt.hash(req.body.newPassword,10)
        await req.user.update({password: newPassHashed})

        res.status(200).json({message: 'Password has been changed successfully!'})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong.'})
    }
}

module.exports.deleteUser = async (req,res) => {
    try {
        await req.user.destroy()
        res.status(200).json({message: 'Your account has been deleted.'})
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong.'})
    }
}