const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
require("./config/db");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});