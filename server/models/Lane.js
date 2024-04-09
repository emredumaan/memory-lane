const sequelize = require('../db.js')
const { DataTypes } = require('sequelize')

const Lane = sequelize.define('lanes',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = Lane