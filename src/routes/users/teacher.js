const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()
const TeacherUser = require("../../models/teacherUserSchema")


// post api for parent signup
router.post("/signup", async(req, res) =>{
    try{
        const email = req.body.email;
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            const teacherUser = await TeacherUser.find({email: email})

            if(teacherUser && teacherUser.length > 0){
                res.status(409).json({error: "Email already used"})
            }else{
                const hashedPassword = await bcrypt.hash(req.body.password, 10)

                const fullName = req.body.fullName;
                const phone = req.body.phone || "";
                const studentId = req.body.studentId || ""
                const password = hashedPassword;
                const userType = "Parents"
                const address = req.body.address || ""

                const newUserData = {
                    fullName,
                    phone,
                    studentId,
                    email,
                    userType,
                    address,
                    password,
                }
                const newTeacherUser = new TeacherUser(newUserData)
                newTeacherUser.save()
                .then((result) => {
                    res.status(200).json({message: "Signup Successful"})
                }).catch((err) => {
                    res.status(500).send({
                        error: "This is server side error"
                    })
                });
            }
        }else{
            res.status(400).json({error: "Invalid email!"})
        }

    }catch(error){
        res.status(500).send({
            error: "There was a server side problem!"
        })  
    }
})


router.post("/login", async (req, res) => {
    try{
        const checkTeacherUser = await TeacherUser.find({email: req.body.email})
        if(checkTeacherUser && checkTeacherUser.length > 0){
            const isValidPassword = await bcrypt.compare(req.body.password, checkTeacherUser[0].password);
            if(isValidPassword){
                console.log("dhuka")
                const token = jwt.sign({
                    userId: checkTeacherUser[0]._id,
                    userFullName: checkTeacherUser[0].fullName,
                    email: checkTeacherUser[0].email
                }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                })
                res.status(200).send({
                    token: token,
                    message: "Login Successful"
                })
            }else{
                res.status(401).send({
                    error: "Password not matched"
                }) 
            }
        }else{
            res.status(401).send({
                error: "User not found"
            })  
        }
    }
    catch(err) {
        res.status(500).send({
            error: err.message
        })
    }
})

module.exports = router