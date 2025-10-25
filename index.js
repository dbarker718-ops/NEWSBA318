import express from "express";
import customerRouter from "./routes/customers.js";
const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);






app.get("/", (req, res) => {
  res.send("Payment API");
});

app.use("/api/customers", customerRouter)

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => console.log("alive on http://localhost:3000/api"));
