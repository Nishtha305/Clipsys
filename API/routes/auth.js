const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const users = require('../models/userModel')
// const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
// const checkAuth = require('../middleware/check.auth')
const { upload } = require('../middleware/multer')
const validationCheck = [
    check("email", "Invalid Email Address").isEmail(),
    check("firstname", "Name Must be Two or more Characters").isLength({ min: 2 }),
    check("password", "password be must Six Characters").isLength({ min: 6 }),
    check("contactNumber").isLength({ min: 10 })//isMobilePhone()
]

router.post('/signup', validationCheck, async (req, res) => {
    const { email, firstname, contactNumber, password, cpassword } = req.body;
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(password, 10)
    const token = await JWT.sign({
        firstname,
    }, process.env.SECRET_KEY) /*HERE WE CAN PASS EXPIRE TIME OF TOKEN*/

    //VALIDATEd THE INPUT VALUES
    if (!errors.isEmpty()) {
        return res.send({ errors: errors })
    }

    //CHECK THE USER ALREADY EXISTS OR NOT
    users.findOne({ email: email }).then((data) => {
        if (data) {
            return res.status(400).json({
                "errors": [
                    {
                        "msg": "This Email is Alredy Exists",
                    }
                ]
            })
        } else {
            if (password === cpassword) {
                const user = new users({
                    // _id: mongoose.,
                    firstname: firstname,
                    email: email,
                    password: hashedPassword,
                    contactNumber: contactNumber,
                    createdAt: Date.now()
                })
                try {
                    user.save()

                    return res.status(200).send({ msg: "Registration Successfull", token: token })
                } catch (error) {
                    return res.status(400).send({ msg: "Registration Failed" })
                }
            } else {
                return res.status(400).send({ msg: "Password dosn't Matched" })
            }
        }
    }).catch(() => {
        return res.status(500).json({ msg: "Server Internal Error " })
    })


    // console.log(req.body);
    // res.send('Validation Passed')
})

router.post('/login', [validationCheck[0], validationCheck[2]], async (req, res) => {
    const { email, password } = req.body;
    let firstname;
    const errors = validationResult(req);

    // const hashedPassword = await bcrypt.hash(password, 10)

    //VALIDATEd THE INPUT VALUES
    if (!errors.isEmpty()) {
        return res.send({ errors: errors })
    }

    users.findOne({ email: email }).populate("channelName", "channelName description").then((doc) => {
        if (doc) {
            // console.log(doc);
            firstname = doc.firstname;
            bcrypt.compare(password, doc.password).then(result => {
                // console.log(result);
                if (result) {

                    const token = JWT.sign({
                        firstname,
                    }, process.env.SECRET_KEY)
                    return res.status(200).send({ user: { "token": token, "email": email, "firstname": doc.firstname, "_id": doc._id, "userType": doc.userType, "channelName": doc.channelName[0] } })

                } else {
                    return res.send({ msg: "Invalid Credentail" })
                }
            })
        } else {
            return res.send({ msg: "Email Doesn't Exist" })
        }
    }).catch(() => {
        return res.json({ msg: "Server Internal Error " })
    })

})

router.post('/user/updateProfile', upload.single("image"), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const newImageName = req.file ? req.file.filename : false;
    const { firstname,
        lastname,
        dob,
        email,
        password,
        changepassword,
        contactNumber,
        cpassword, } = req.body;

    const errors = validationResult(req);
    // console.log(req.file)
    const changepasswordHased = await bcrypt.hash(changepassword, 10)
    // console.log(changepasswordHased);

    //VALIDATEd THE INPUT VALUES
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors })
    }

    users.findOne({ email: email }).then((doc) => {
        if (doc) {
            const oldImageName = doc.imageName
            // console.log("doc founded")
            bcrypt.compare(password, doc.password).then((val) => {
                // console.log(val)
                if (!val) {
                    return res.status(400).send({ msg: "Invalid Credentail" })
                } else {
                    if (cpassword === changepassword) {
                        users.updateOne({
                            email: email
                        }, {
                            $set: {
                                firstname: firstname,
                                lastname: lastname ? lastname : '',
                                dob: dob,
                                email: email,
                                changePassword: changepasswordHased,
                                contactNumber: contactNumber,
                                imageName: `${oldImageName.length > 5 && newImageName ? "images/" + req.file.filename :
                                    `${oldImageName.length > 5 ? oldImageName : "images/" + req.file.filename}`}`,
                                updatedAt: Date.now()
                            }
                        }).then((user) => {
                            // console.log(user);
                            if (user) {
                                return res.send({ message: `Profile Updated`, user: user })
                            }

                        }).catch((err) => {
                            // console.log(err);
                            return res.send({ "160 message": `Invalid Credentials` })
                        })
                    } else {
                        return res.send({ message: `Invalid Credentials` })
                    }
                }
            })
        }
    }).catch(() => {
        return res.status(400).json({ "msg": "Invalid Credentils " })
    })


})

router.get('/:id', (req, res) => {
    users.findById({ _id: req.params.id }).populate('channelName', 'channelName channelDescription').then(result => {
        return res.status(200).json(result)
    }).catch(err => {
        return res.json(err)
    })
})

module.exports = router
// if(oldImageName && newImageName){
//     newImageName
// }else{
//     oldImageName
// }