import express, { json } from "express";
import customers from "../data/customers.js";
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(customers);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body.username && req.body.email && req.body.password) {
      if (customers.find((u) => u.username == req.body.username)) {
        res.status(409).json({ error: "Username Already Taken" });
        return;
      }
      const customer = {
        id: customers[customers.length - 1].id + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };
      customers.push(customer);
      res.status(201).json(customers[customers.length - 1]);
    } else res.status(400).json({ error: "Insufficient Data" });
  });
export default router;
