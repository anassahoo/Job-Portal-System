const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../middleware/upload");

const router = express.Router();


// =====================
// Upload Profile Image
// =====================
router.post("/upload-profile", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const userId = req.body.user_id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Valid user_id required" });
    }

    const imagePath = req.file.filename;

    db.query(
      "UPDATE user_profiles SET profile_image = ? WHERE user_id = ?",
      [imagePath, userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Profile not found" });
        }

        return res.json({
          message: "Profile image updated",
          file: imagePath
        });
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =====================
// Update Profile
// =====================
router.put("/update-profile", async (req, res) => {
  try {
    const { user_id, first_name, last_name, phone, professional_title, location, bio } = req.body;

    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({ error: "Valid user_id required" });
    }

    if (!first_name || !last_name) {
      return res.status(400).json({ error: "First and last name required" });
    }

    db.query(
      `UPDATE user_profiles 
       SET first_name = ?, last_name = ?, phone = ?, professional_title = ?, location = ?, bio = ?
       WHERE user_id = ?`,
      [first_name, last_name, phone || null, professional_title || null, location || null, bio || null, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Profile not found" });
        }

        return res.json({ message: "Profile updated" });
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =====================
// Get User Profile
// =====================
router.get("/profile/:id", (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    db.query(
      `SELECT 
        a.id,
        a.email,
        a.role,
        p.first_name,
        p.last_name,
        p.phone,
        p.professional_title,
        p.location,
        p.bio,
        p.profile_image
       FROM auth_users a
       JOIN user_profiles p ON a.id = p.user_id
       WHERE a.id = ?`,
      [userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.json(result[0]);
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =====================
// Add Skill
// =====================
router.post("/add-skill", (req, res) => {
  try {
    const { user_id, skill_id } = req.body;

    if (!user_id || !skill_id) {
      return res.status(400).json({ error: "user_id and skill_id required" });
    }

    db.query(
      "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
      [user_id, skill_id],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }

        return res.json({ message: "Skill added" });
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =====================
// Get User Skills
// =====================
router.get("/user-skills/:id", (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    db.query(
      `SELECT s.id, s.skill_name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Database error" });
        }

        return res.json(result);
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// =====================
// Change Password (optional but important)
// =====================
router.put("/change-password", async (req, res) => {
  try {
    const { user_id, old_password, new_password } = req.body;

    if (!user_id || !old_password || !new_password) {
      return res.status(400).json({ error: "All fields required" });
    }

    db.query(
      "SELECT password FROM auth_users WHERE id = ?",
      [user_id],
      async (err, result) => {
        if (err || result.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(old_password, result[0].password);

        if (!isMatch) {
          return res.status(401).json({ error: "Incorrect old password" });
        }

        const hashed = await bcrypt.hash(new_password, 10);

        db.query(
          "UPDATE auth_users SET password = ? WHERE id = ?",
          [hashed, user_id],
          (err2) => {
            if (err2) return res.status(500).json({ error: "Update failed" });

            return res.json({ message: "Password updated" });
          }
        );
      }
    );

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;