const express = require("express")
const Event = require("../../models/eventSchema/eventSchema")
const TeacherUser = require("../../models/userSchema/teacherUserSchema")
const router = express.Router();

// Post Blog
router.post("/post", async (req, res) => {
    try{
        const postEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            author: req.body.userId,
            postedTime: req.body.postedTime
        })
        const event = await postEvent.save()
        
        await TeacherUser.updateOne({
            _id: req.body.userId
        }, {
            $push: {
                events: event._id
            }
        })
        .then(response => {
            res.status(200).send({
                message: "Successful"
            })
        })
        .catch(err => {
            res.status(500).send({
                error: "This is server side error",
                message: err.message
            })
        })
    }
    catch(err){
        res.status(500).send({
            error: "This is server side error"
        })
    }
})



router.delete("/delete/:id", async (req, res) => {
    try{
        const event = await Event.findById({_id: req.params.id})
        if(event.author){
            await Event.deleteOne({_id: req.params.id})
            await TeacherUser.updateOne({
                _id: event.author
            }, {
                $pull: {
                    events: req.params.id
                }
            })
            .then(response => {
                res.status(200).send({
                    message: "Deleted"
                })
            })
            .catch(err => {
                res.status(500).send({
                    error: "can't delete"
                })
            })
        }
    }
    catch(err){
        res.status(500).send({
            error: "There was a server side problem!"
        })
    }
})

// router.get("/author/:id", async (req, res) => {
//     try{
//         const user = await User.find({_id: req.params.id}).select({
//             __v: 0,
//             password: 0
//         })
//         res.status(200).json(user)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// })

// Get Blog By id

router.get("/:id", async (req, res) => {
    const event = await Event.find({_id: req.params.id})
    res.status(200).json(event)
})

// Get All Blogs
router.get("/view/all",  async(req, res) => {
    try{
        const events = Event.find()
            .then((data) => {
                res.status(500).json({
                    resutl: data
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: "Request error"
                })
            })
    }
    catch(err){
        res.status(500).send("Internal server error")
    }
    
})

// router.put("/update/:id", async (req, res) => {
//     try{
//         const updatedBlogData = req.body
//         const result = Blog.findByIdAndUpdate({_id: req.params.id}, {
//             $set: updatedBlogData
//         }, {
//             new: true
//         }, (err, doc) => {
//             if(err){
//                 console.log("Not Updated");
//             }else{
//                 console.log("Updated");
//             }
//         })
//     }
//     catch(err){
//         res.status(500).send({
//             error: "This is server side error"
//         })
//     }
// })

module.exports = router;