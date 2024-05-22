const Stripe = require('stripe');
const Users = require('../Model/Users');

const stripe = Stripe('sk_test_51Of0LpKDP52BYTYxk2N2sFT3vU1CxdzUECX1xfW3U4yNeEveCExnMVfe1ixga2nEI4uVpOrGQdzoDNlNghTFROcb00rfPlEUZf');

async function processPayement(req, res) {
    try {
        const { amount, id } = req.body;
        let currency = 'usd';

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method_types: ['card']
        });

        let user = await Users.findByIdAndUpdate(
            id,
            { $inc: { accBalance: amount/100 } },
            { new: true } // Return the updated document
          );

        res.send({
            user: user,
            clientSecret: paymentIntent.client_secret,
            success: true
        });
      } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message });
      }
}

async function deduct(req, res) {
    try{
      const { total, id } = req.body;

      let user = await Users.findByIdAndUpdate(
        id,
        { $inc: { accBalance: -total } },
        { new: true } // Return the updated document
    );

    res.send({
      user: user,
      success: true
    });
    } catch(error) {
      console.log(error)

      return res.json({
        success: false,
        error: error
      })
    }
}

module.exports = { processPayement, deduct };