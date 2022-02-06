const express = require("express");
const app = express();
const { resolve } = require("path");
// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")("sk_live_c3NHrSxVh2qXLbLNNou2zljW");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createLocation = async () => {
  const location = await stripe.terminal.locations.create({
    display_name: 'tml_Ee0ClwJtc7rjE6',
    address: {
      line1: '1941 S. Military Trail',
      line2: 'Sunshine Flea Market R18',
      city: 'West Palm Beach',
      state: 'FL',
      country: 'US',
      postal_code: '33415',
    }
  });

  return location;
};

// The ConnectionToken's secret lets you connect to any Stripe Terminal reader
// and take payments with your Stripe account.
// Be sure to authenticate the endpoint for creating connection tokens.
app.post("/connection_token", async(req, res) => {
  let connectionToken = await stripe.terminal.connectionTokens.create();
  res.json({secret: connectionToken.secret});
})

app.post("/create_payment_intent", async(req, res) => {
  // For Terminal payments, the 'payment_method_types' parameter must include
  // 'card_present' and the 'capture_method' must be set to 'manual'
  const intent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    payment_method_types: ['card','card_present'],
    capture_method: 'manual',
  });
  res.json({client_secret: intent.client_secret});
})

app.post("/capture_payment_intent", async(req, res) => {
  const intent = await stripe.paymentIntents.capture(req.body.id);
  res.send(intent);
})

app.listen(4242, () => console.log('Node server listening on port 4242!'));
