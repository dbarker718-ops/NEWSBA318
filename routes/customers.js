import express from "express";
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(customers);
  })
  .post((req, res) => {
    if (req.body.username && req.body.email) {
      if (customers.find((u) => u.username == req.body.username)) {
        res.json({ error: "Username Already Taken" });
        return;
      }

      const customer = {
        id: customers[customers.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      customers.push(customers);
      res.json(customers[customers.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });
export default router; 