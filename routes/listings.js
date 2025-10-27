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

router
  .route("/:id")
  .patch((req, res, next) => {
    const listing = listings.find((l) => l.id == req.params.id);
    if (listing) res.json(listing);
    else next({ status: 404, error: "Listing not found" });
  })
  .patch((req, res, next) => {
    const listing = listings.find((l, i) => {
      if (l.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (listing) res.json(listing);
    else next({ status: 404, error: "Listing not found" });
  });
export default router;
