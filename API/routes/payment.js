const router = require('express').Router()
const users = require('../models/userModel')
const { v4: uuid } = require('uuid')

// var Publishable_Key = 'pk_test_51Klo14ECKnOUfeEF1KqdBIQTiwDT9NCtsEXeLGJ8FLxD0ejvlnlG7g0Az7xF0xEM4RzPbQTw79NH8ozeQkuu8hAQ0099tJWTVg'
// var Secret_Key = 'sk_test_51Klo14ECKnOUfeEF7Axwe4V0uR4ffqh9x01v8KuLF3MZwV0csNwMlOKmKDE8ltT4T95Ba6tggcsDHEdbZWQLv9nn009snCMGF3J'

const stripe = require('stripe')("sk_test_51Klo14ECKnOUfeEF7Axwe4V0uR4ffqh9x01v8KuLF3MZwV0csNwMlOKmKDE8ltT4T95Ba6tggcsDHEdbZWQLv9nn009nCMGF3J")

router.post('/Payment', function (req, res) {
    // console.log(req.body);
    const { packages, token } = req.body;
    // console.log("product :", packages[0]);
    // console.log("price :", packages[0].amount);
    const idempotencyKey = uuid()

    stripe.customers.create({
        email: token.email,
        source: token.id,
        name: token.name
        //     name: 'Jenisha Desai',
    }).then((customer) => {
        stripe.charges.create({
            amount: packages[0].amount * 100,
            description: 'Premium Membership',
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
        }, { idempotencyKey });
    }).then(charge => {
        // console.log(charge)
        users.findByIdAndUpdate({ _id: req.body.id }, { userType: 'premiumUser' }).then(result => {
            if (result) {
                return res.send('Payment Successfull')
            }
        })
    })
        .catch((err) => {
            // console.log(err)
            res.send(err)
        });
})

module.exports = router
