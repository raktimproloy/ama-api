const mongoose = require("mongoose")

const studentUserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    stydentId: {
        type: String,
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

const StudentUser = mongoose.model("student-user", studentUserSchema)
module.exports = StudentUser;