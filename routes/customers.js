import express from "express";
import customers from "../data/customers.js";
const router = express.Router();

router.route("/")
  .get((req, res) => {
    res.json(customers);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body.username && req.body.email) {
      if (customers.find((u) => u.username == req.body.username)) {
        res.json({ error: "Username Already Taken" });
        return;
      }
      console.log("Hi");
      const customer = {
        id: customers[customers.length - 1].id + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };
      console.log("hello");
      customers.push(customer);
      console.log("added customer")
      res.json(customers[customers.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });
export default router;
