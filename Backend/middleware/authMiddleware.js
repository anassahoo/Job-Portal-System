const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }

    next();
  } catch {
    return res.status(400).json({ error: "Invalid token" });
  }
};