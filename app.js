const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const hotelRouter = require('./routers/hotelRouter')
const userRouter = require('./routers/usersRouter')
const app = express()

const connectionString ='mongodb+srv://admin:mz8gMRnRTqAM5D65@cluster0.qit5kfq.mongodb.net/bookmystay?appName=Cluster0'
mongoose.connect(connectionString)
.then((conn) => console.log("Connection to DB successful"))
.catch(err => console.log("Couldn't connect to MongoDB"))
const logger = (req,res,next) => {
    console.log(req.method, req.url)
    next()
}

app.use(express.json())
app.use(express.static('./public'))
app.use(morgan())
app.use(logger)



app.use('/api/hotels', hotelRouter)
app.use('/api/users', userRouter)
app.listen(4200, () => {
    console.log("App is listening on the port 4200")
})