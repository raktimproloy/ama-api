const mongoose = require("mongoose")

const parentsUserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: Number
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
        minLenght: 8,
        required: true
    }
}, {
    timestamps: true
}) 

const ParentsUser = mongoose.model("parents-user", parentsUserSchema)
module.exports = ParentsUser;