const router = require('express').Router()
// const { check, validationResult } = require('express-validator')
const users = require('../models/userModel')
const checkAuth = require('../middleware/check.auth')


router.get('/:id', checkAuth, function (req, res) {
    try {
        users.findById({ _id: req.params.id }).then(data => {
            return res.json(data.imageName)
        }).catch(err => {
            return res.json(err)
        })
    } catch (error) {
        return res.json(error)
    }
})
module.exports = router
