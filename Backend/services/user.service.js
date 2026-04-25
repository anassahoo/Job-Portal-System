const db = require("../config/db");
const bcrypt = require("bcrypt");


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

  // 🔍 Check if profile exists
  db.query(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      // =========================
      // 🆕 FIRST TIME → ALL FIELDS REQUIRED
      // =========================
      if (result.length === 0) {

        if (!first_name || !last_name || !phone || !professional_title || !location || !bio) {
          return res.status(400).json({
            error: "All profile fields are required for first-time setup"
          });
        }

        db.query(
          `INSERT INTO user_profiles 
          (user_id, first_name, last_name, phone, professional_title, location, bio)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, first_name, last_name, phone, professional_title, location, bio],
          (err2) => {
            if (err2) return res.status(500).json({ error: "Profile creation failed" });

            return res.json({ message: "Profile created successfully" });
          }
        );
      }

      // =========================
      // 🔄 UPDATE (PARTIAL ALLOWED)
      // =========================
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

// =====================
// UPDATE ACCOUNT (EMAIL/PASSWORD)
// =====================
exports.updateAccount = (req, res) => {
  const userId = req.user.id;
  const { email, current_password, new_password } = req.body;

  const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const wantsEmailUpdate = typeof email === "string" && trimmedEmail.length > 0;
  const wantsPasswordUpdate = typeof new_password === "string" && new_password.length > 0;

  if (!wantsEmailUpdate && !wantsPasswordUpdate) {
    return res.status(400).json({ error: "Provide email and/or new password to update" });
  }

  if (wantsEmailUpdate && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (wantsPasswordUpdate) {
    if (!current_password) {
      return res.status(400).json({ error: "Current password is required to set a new password" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
  }

  db.query(
    "SELECT id, email, password, role FROM auth_users WHERE id = ?",
    [userId],
    async (err, users) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (users.length === 0) return res.status(404).json({ error: "User not found" });

      const user = users[0];
      const fields = [];
      const values = [];

      const continueWithUpdate = async () => {
        if (wantsPasswordUpdate) {
          const isMatch = await bcrypt.compare(current_password, user.password);
          if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
          }

          const hashedPassword = await bcrypt.hash(new_password, 10);
          fields.push("password = ?");
          values.push(hashedPassword);
        }

        if (fields.length === 0) {
          return res.status(400).json({ error: "No changes detected" });
        }

        values.push(userId);

        db.query(
          `UPDATE auth_users SET ${fields.join(", ")} WHERE id = ?`,
          values,
          (updateErr) => {
            if (updateErr) return res.status(500).json({ error: "Account update failed" });

            return res.json({
              message: "Account updated successfully",
              user: {
                id: userId,
                email: wantsEmailUpdate ? trimmedEmail : user.email,
                role: user.role,
              },
            });
          }
        );
      };

      if (wantsEmailUpdate && trimmedEmail !== user.email) {
        db.query("SELECT id FROM auth_users WHERE email = ? AND id <> ?", [trimmedEmail, userId], (emailErr, rows) => {
          if (emailErr) return res.status(500).json({ error: "Database error" });
          if (rows.length > 0) return res.status(400).json({ error: "Email already exists" });

          fields.push("email = ?");
          values.push(trimmedEmail);
          continueWithUpdate();
        });
      } else {
        continueWithUpdate();
      }
    }
  );
};