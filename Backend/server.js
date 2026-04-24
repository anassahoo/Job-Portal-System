const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
require("./config/db");

app.use(cors());
app.use(express.json());

// serve images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/skills", require("./routes/skill.routes"));
app.use("/api/jobs", require("./routes/job.routes"));
app.use("/api/companies", require("./routes/company.routes"));
app.use("/api/resume", require("./routes/resume.routes"));
app.use("/api/applications", require("./routes/application.route"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});