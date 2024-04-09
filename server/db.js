const config = require('./config.json')
const mysql = require('mysql2/promise')
const { Sequelize } = require('sequelize')

const { name, host, port, user, password } = config.database

const sequelize = new Sequelize(name, user, password, {
    dialect: "mysql",
    host: host,
    port: port,
})

async function connect() {
    try {
        const connection = await mysql.createConnection({ host, port, user, password })
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`)

        await sequelize.authenticate()
        console.log("mysql server bağlantısı yapıldı")
    }
    catch (err) {
        console.log("bağlantı hatası ", err)
    }
}

connect()

module.exports = sequelize