const express = require('express')
const morgan = require('morgan')
const hotelRouter = require('./routers/hotelRouter')
const userRouter = require('./routers/usersRouter')
const app = express()
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