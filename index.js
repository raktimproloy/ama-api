const express = require("express")
const dotenv = require('dotenv')
dotenv.config()
const cors = require("cors")

const mongoose = require("mongoose")

// import routes 
const parentsHandler = require("./src/routes/users/parents")
const teacherHandler = require("./src/routes/users/teacher")
const studentHandler = require("./src/routes/users/student")
const blogHandler = require("./src/routes/blogs/blog")
const eventHandler = require("./src/routes/events/event")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', true);
mongoose.connect(process.env.BASE_URL)
    .then(() => console.log("Database Connected successful"))
    .catch(err => console.log(err.message))

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

// Routes Api
app.use("/user/parents", parentsHandler)
app.use("/user/teacher", teacherHandler)
app.use("/user/student", studentHandler)
app.use("/blog", blogHandler)
app.use("/event", eventHandler)


// default error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broken!')
  })

// 404 error handler
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })

// port variable
const port = process.env.PORT || 4000

// server listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})