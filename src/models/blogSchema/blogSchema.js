const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogImage: {
        type: String
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

const Blog = mongoose.model("blog", blogSchema)
module.exports = Blog