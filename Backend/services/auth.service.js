const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================
// SIGNUP
// =====================
exports.signup = async (req, res) => {
  const { email, password, role } = req.body;

  const roleAliases = {
    jobseeker: "student",
    student: "student",
    recruiter: "recuteir",
    recuteir: "recuteir",
  };

  const normalizedRole = roleAliases[String(role || "").toLowerCase()];

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (!normalizedRole) {
    return res.status(400).json({ error: "Invalid role. Allowed: student or recuteir" });
  }

  try {
    // Check if email exists
    db.query("SELECT id FROM auth_users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        "INSERT INTO auth_users (email, password, role) VALUES (?, ?, ?)",
        [email, hashedPassword, normalizedRole],
        (err2, result2) => {
          if (err2) return res.status(500).json({ error: "Signup failed" });

          return res.status(201).json({
            message: "Signup successful",
            user_id: result2.insertId
          });
        }
      );
    });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
};



// =====================
// LOGIN (JWT)
// =====================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  db.query(
    "SELECT * FROM auth_users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // 🔐 Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        token
      });
    }
  );
};