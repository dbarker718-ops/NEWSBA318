import express, { json } from "express";
import listings from "../data/listings.js";
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(listings);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body.description && req.body.bedrooms && req.body.bathrooms) {
      
      const listing = {
        id: listings[listings.length - 1].id + 1,
        description: req.body.description,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
      };
      listings.push(listing);
      res.status(201).json(listings[listings.length - 1]);
    } else res.status(400).json({ error: "Insufficient Data" });
  });
export default router;
