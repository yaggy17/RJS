const express = require("express");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`PROJEXON API listening on port ${port}`);
});
