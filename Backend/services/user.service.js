const db = require("../config/db");


// =====================
// GET PROFILE
// =====================
exports.getProfile = (req, res) => {
  const userId = req.user.id;

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
     LEFT JOIN user_profiles p ON a.id = p.user_id
     WHERE a.id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(result[0]);
    }
  );
};



// =====================
// UPDATE PROFILE (CREATE + SMART UPDATE)
// =====================
exports.updateProfile = (req, res) => {
  const userId = req.user.id;

  const { first_name, last_name, phone, professional_title, location, bio } = req.body;

  db.query(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      // 🆕 CREATE PROFILE
      if (result.length === 0) {
        db.query(
          `INSERT INTO user_profiles 
          (user_id, first_name, last_name, phone, professional_title, location, bio)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            first_name || null,
            last_name || null,
            phone || null,
            professional_title || null,
            location || null,
            bio || null
          ],
          (err2) => {
            if (err2) return res.status(500).json({ error: "Profile creation failed" });

            return res.json({ message: "Profile created successfully" });
          }
        );
      }

      // 🔄 UPDATE PROFILE (SMART)
      else {
        const fields = [];
        const values = [];

        if (first_name !== undefined && first_name !== "") {
          fields.push("first_name = ?");
          values.push(first_name);
        }

        if (last_name !== undefined && last_name !== "") {
          fields.push("last_name = ?");
          values.push(last_name);
        }

        if (phone !== undefined && phone !== "") {
          fields.push("phone = ?");
          values.push(phone);
        }

        if (professional_title !== undefined && professional_title !== "") {
          fields.push("professional_title = ?");
          values.push(professional_title);
        }

        if (location !== undefined && location !== "") {
          fields.push("location = ?");
          values.push(location);
        }

        if (bio !== undefined && bio !== "") {
          fields.push("bio = ?");
          values.push(bio);
        }

        if (fields.length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const query = `
          UPDATE user_profiles 
          SET ${fields.join(", ")}
          WHERE user_id = ?
        `;

        values.push(userId);

        db.query(query, values, (err3) => {
          if (err3) return res.status(500).json({ error: "Profile update failed" });

          return res.json({ message: "Profile updated successfully" });
        });
      }
    }
  );
};



// =====================
// UPLOAD PROFILE IMAGE
// =====================
exports.uploadProfileImage = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.filename;

  db.query(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      // Create profile if not exists
      if (result.length === 0) {
        db.query(
          "INSERT INTO user_profiles (user_id, profile_image) VALUES (?, ?)",
          [userId, imagePath],
          (err2) => {
            if (err2) return res.status(500).json({ error: "Insert failed" });

            return res.json({ message: "Profile created with image", file: imagePath });
          }
        );
      }

      // Update image
      else {
        db.query(
          "UPDATE user_profiles SET profile_image = ? WHERE user_id = ?",
          [imagePath, userId],
          (err3) => {
            if (err3) return res.status(500).json({ error: "Update failed" });

            return res.json({ message: "Image updated", file: imagePath });
          }
        );
      }
    }
  );
};