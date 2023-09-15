const mongoose = require("mongoose")

const postBlogSchema = mongoose.Schema({
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

const PostBlog = mongoose.model("blog", postBlogSchema)
module.exports = PostBlog