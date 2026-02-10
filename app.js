const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`PROJEXON API listening on port ${port}`);
});
