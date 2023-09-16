const mongoose = require("mongoose")

const EventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher-user"
    },
    postedTime: {
        type: String,
    },
})

const Event = mongoose.model("event", EventSchema)
module.exports = Event