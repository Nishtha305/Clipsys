const router = require('express').Router()
// const { check, validationResult } = require('express-validator')
const users = require('../models/userModel')
const packages = require('../models/packageModel')

router.post('/setPrice', (req, res) => {
    users.find({ email: req.body.email }).then(result => {
        // console.log(result);
        if (result[0].userType === 'admin') {
            const packag = new packages({
                userId: result._id,
                amount: req.body.amount,
                validity: req.body.validity
            })
            try {
                packag.save().then(result => {
                    return res.json(result)
                })

            } catch (error) {
                return res.json({ 'catch': error })
            }
        } else {
            return res.json({ 'msg': 'Admin Access Only' })
        }
    })
})
router.put('/updatePrice', (req, res) => {
    // console.log(req.body)
    // return res.json("hii")
    const newAmount = parseInt(req.body.rate)
    // const oldamount = parseInt(req.body.oldRate)
    packages.updateOne({ amount: req.body.oldRate }, { $set: { amount: newAmount } }).then(result => {
        if (result) {
            return res.json({ result })
        }
    }).catch((err) => {
        return res.json({ msg: err })
    })
})
router.get('/', (req, res) => {
    packages.find({}).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})
module.exports = router