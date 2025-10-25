const express = require("express");
const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

const customers = [
  {
    id: 1,
    username: "Jack",
    email: "Jack@gmail.com",
    password: "jack123",
  },
  {
    id: 2,
    username: "Bill",
    email: "Billy@gmail.com",
    password: "billy123",
  },
  {
    id: 3,
    username: "Jill",
    email: "Jill@gmail.com",
    password: "jill123",
  },
];

const payments = [
  {
    id: 1,
    user_id: 1,
    company: "Discover",
    type: "credit",
  },
  {
    id: 2,
    user_id: 2,
    company: "TD Bank",
    type: "debit",
  },
  {
    id: 3,
    user_id: 3,
    company: "Master Card",
    type: "credit",
  },
];

const listing = [
  {
    id: 1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean malesuada massa ac odio euismod, vel convallis mauris placerat. Vestibulum ante.",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean malesuada massa ac odio euismod, vel convallis mauris placerat. Vestibulum ante.",
    bedrooms: 2,
    bathrooms: 1.5,
  },
  {
    id: 1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean malesuada massa ac odio euismod, vel convallis mauris placerat. Vestibulum ante.",
    bedrooms: 3,
    bathrooms: 2,
  },
];

app.get("/", (req, res) => {
  res.send("Payment API");
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => console.log("alive on http://localhost:3000/api"));
