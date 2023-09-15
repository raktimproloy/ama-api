const express = require("express")
// const multer = require("multer")
const Blog = require("../../models/blogSchema/blogSchema")
const TeacherUser = require("../../models/userSchema/teacherUserSchema")
// const path = require("path")
// const {v4: uuidv4} = require("uuid")
const router = express.Router();
// const {CloudinaryStorage} = require("multer-storage-cloudinary")
// const cloudinary = require("cloudinary").v2


// cloudinary.config({
//     cloud_name: process.env.CLOUDNAME,
//     api_key: process.env.CLOUDAPIKEY,
//     api_secret: process.env.CLOUDINARYSECRET,
//     secure: true
//   })

//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
// })

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]
//     if(allowedFileTypes.includes(file.mimetype)){
//         cb(null, true)
//     }else{
//         cb(null, false)
//     }
// }

// const upload = multer({storage, fileFilter, key: function(req, file, cb) {
//     cb(null, file.originalname)
// }})


// Post Blog
// , upload.fields({name: "BlogImage", maxCount: 1})
router.post("/post", async (req, res) => {
    try{
        // const BlogImageCloudinary = await cloudinary.uploader.upload(req.files.BlogImage[0].path, {"folder": "blog-desk/blogs"});

        const postBlog = new Blog({
            title: req.body.title,
            // BlogImage:  BlogImageCloudinary.secure_url,
            description: req.body.description,
            author: req.body.userId,
            postedTime: req.body.postedTime
        })
        const blog = await postBlog.save()
        
        await TeacherUser.updateOne({
            _id: req.body.userId
        }, {
            $push: {
                blogs: blog._id
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
        const blog = await Blog.findById({_id: req.params.id})
        if(blog.author){
            await Blog.deleteOne({_id: req.params.id})
            await TeacherUser.updateOne({
                _id: blog.author
            }, {
                $pull: {
                    blogs: req.params.id
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
    const blog = await Blog.find({_id: req.params.id})
    res.status(200).json(blog)
})

// Get All Blogs
router.get("/view/all",  async(req, res) => {
    try{
        const blogs = Blog.find()
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