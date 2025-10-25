import express, { json } from "express";
import payments from "../data/payments.js";
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(payments);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body.type && req.body.company && req.body.user_id) {
      if (payments.find((u) => u.user_id == req.body.user_id)) {
        res.status(409).json({ error: "Payment method already defined" });
        return;
      }
      const payment = {
        id: payments[payments.length - 1].id + 1,
        user_id: req.body.user_id,
        company: req.body.company,
        type: req.body.type,
      };
      payments.push(payment);
      res.status(201).json(payments[payments.length - 1]);
    } else res.status(400).json({ error: "Insufficient Data" });
  });
export default router;
