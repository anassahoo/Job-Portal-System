const db = require("../config/db");


// =====================
// UPLOAD RESUME
// =====================
exports.uploadResume = (req, res) => {
  const userId = req.user.id;
  const {
    first_name = null,
    last_name = null,
    email = null,
    phone = null,
    experience = null,
    cover_letter = null,
  } = req.body || {};

  if (!req.file) {
    return res.status(400).json({ error: "Resume file required" });
  }

  const filePath = req.file.filename;

  // check if already exists
  db.query(
    "SELECT * FROM resumes WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      // CREATE
      if (result.length === 0) {
        db.query(
          `INSERT INTO resumes 
            (user_id, file_path, resume_score, first_name, last_name, email, phone, experience, cover_letter)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, filePath, 0, first_name, last_name, email, phone, experience, cover_letter],
          (err2) => {
            if (err2) return res.status(500).json({ error: "Insert failed" });

            return res.json({ message: "Resume uploaded", file: filePath });
          }
        );
      }

      // UPDATE
      else {
        db.query(
          `UPDATE resumes
           SET file_path = ?, first_name = ?, last_name = ?, email = ?, phone = ?, experience = ?, cover_letter = ?
           WHERE user_id = ?`,
          [filePath, first_name, last_name, email, phone, experience, cover_letter, userId],
          (err3) => {
            if (err3) return res.status(500).json({ error: "Update failed" });

            return res.json({ message: "Resume updated", file: filePath });
          }
        );
      }
    }
  );
};



// =====================
// GET RESUME
// =====================
exports.getResume = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM resumes WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length === 0) {
        return res.status(404).json({ error: "No resume found" });
      }

      return res.json(result[0]);
    }
  );
};