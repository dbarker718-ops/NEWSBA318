const express = require('express');
const app = express();

const stripe = require ('stripe')('prod_TCqoJcOV8TWUzH');


app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);


const customers = {
  
  'stripeCustomerId': {
    apiKey: '123xyz',
    active: false,
    itemId: 'stripeSubscriptionItemId',
  },
};
const apiKeys = {
 
  '123xyz': 'stripeCustomerId',
};


function generateAPIKey() {
  const { randomBytes } = require('crypto');
  const apiKey = randomBytes(16).toString('hex');
  const hashedAPIKey = hashAPIKey(apiKey);

 
  if (apiKeys[hashedAPIKey]) {
    generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
}


function hashAPIKey(apiKey) {
  const { createHash } = require('crypto');

  const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');

  return hashedAPIKey;
}


app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_YOUR-PRODUCT',
      },
    ],
   
    success_url:
      'http://YOUR-WEBSITE/dashboard?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://YOUR-WEBSITE/error',
  });

  res.send(session);
});


app.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  
  const webhookSecret = 'whsec_YOUR-KEY';

  if (webhookSecret) {
    
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
   
    data = event.data;
    eventType = event.type;
  } else {
    
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case 'checkout.session.completed':
      console.log(data);
     
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;

      console.log(
        `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
      );

     
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      
      const { apiKey, hashedAPIKey } = generateAPIKey();
      console.log(`User's API Key: ${apiKey}`);
      console.log(`Hashed API Key: ${hashedAPIKey}`);

      
      customers[customerId] = {
        apikey: hashedAPIKey,
        itemId,
        active: true,
      };
      apiKeys[hashedAPIKey] = customerId;

      break;
    case 'invoice.paid':
     
      break;
    case 'invoice.payment_failed':
      
      break;
    default:
   
  }

  res.sendStatus(200);
});


app.get('/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const account = customers[customerId];
  if (account) {
    res.send(account);
  } else {
    res.sendStatus(404);
  }
});


app.get('/api', async (req, res) => {
  const { apiKey } = req.query;
 

  if (!apiKey) {
    res.sendStatus(400); 
  }

  const hashedAPIKey = hashAPIKey(apiKey);

  const customerId = apiKeys[hashedAPIKey];
  const customer = customers[customerId];

  if (!customer || !customer.active) {
    res.sendStatus(403); 
  } else {

  
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
    );
    res.send({ data: 'Successful', usage: record });
  }
});

app.get('/usage/:customer', async (req, res) => {
  const customerId = req.params.customer;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
  });

  res.send(invoice);
});

app.listen(3000, () => console.log('alive on http://localhost:3000/api'));


