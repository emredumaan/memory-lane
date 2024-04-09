const express = require('express')
const cors = require('cors')
const app = express()
const { server } = require('./config.json')
const cookieParser = require('cookie-parser')
const sequelize = require('./db')
const User = require('./models/User')
const Lane = require('./models/Lane')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(authRoutes)
app.use(userRoutes)

Lane.belongsTo(User)
User.hasMany(Lane)
sequelize.sync()

app.listen(server.port, () => {
    console.log('Server strated at port ' + server.port)
})