const mongoose = require("mongoose")

const teacherUserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    userType: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}) 

const TeacherUser = mongoose.model("teacher-user", teacherUserSchema)
module.exports = TeacherUser;