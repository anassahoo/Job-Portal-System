const db = require("../config/db");


// =====================
// CREATE COMPANY
// =====================
exports.createCompany = (req, res) => {
  const userId = req.user.id;
  const role = String(req.user.role || "").toLowerCase();
  const { name, description } = req.body;
  const logo = req.file ? req.file.filename : null;

  if (!["recruiter", "recuteir"].includes(role)) {
    return res.status(403).json({ error: "Only recruiters can create company profiles" });
  }

  if (!name) {
    return res.status(400).json({ error: "Company name required" });
  }

  db.query(
    "INSERT INTO companies (name, description, logo) VALUES (?, ?, ?)",
    [name, description || null, logo],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Company creation failed" });
      }

      const companyId = result.insertId;

      db.query(
        "SELECT id FROM recruiters WHERE user_id = ? LIMIT 1",
        [userId],
        (linkErr, linkRows) => {
          if (linkErr) {
            console.log("DB ERROR:", linkErr);
            return res.status(500).json({ error: "Recruiter link failed" });
          }

          if (linkRows.length > 0) {
            db.query(
              "UPDATE recruiters SET company_id = ? WHERE user_id = ?",
              [companyId, userId],
              (updateErr) => {
                if (updateErr) {
                  console.log("DB ERROR:", updateErr);
                  return res.status(500).json({ error: "Recruiter link failed" });
                }

                return res.json({
                  message: "Company created",
                  company_id: companyId,
                  logo
                });
              }
            );
          } else {
            db.query(
              "INSERT INTO recruiters (user_id, company_id) VALUES (?, ?)",
              [userId, companyId],
              (insertLinkErr) => {
                if (insertLinkErr) {
                  console.log("DB ERROR:", insertLinkErr);
                  return res.status(500).json({ error: "Recruiter link failed" });
                }

                return res.json({
                  message: "Company created",
                  company_id: companyId,
                  logo
                });
              }
            );
          }
        }
      );
    }
  );
};


// =====================
// GET ALL COMPANIES
// =====================
exports.getCompanies = (req, res) => {
  db.query("SELECT * FROM companies", (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.json(result);
  });
};

// =====================
// GET RECRUITERS DIRECTORY
// =====================
exports.getRecruiters = (req, res) => {
  db.query(
    `SELECT
      r.user_id,
      c.id AS company_id,
      c.name AS company_name,
      c.logo,
      c.description,
      (SELECT COUNT(*) FROM jobs j WHERE j.company_id = c.id) AS jobs_posted
     FROM recruiters r
     JOIN companies c ON r.company_id = c.id
     ORDER BY c.id DESC`,
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.json(result);
    }
  );
};


// =====================
// GET COMPANY BY ID
// =====================
exports.getCompanyById = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM companies WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      return res.json(result[0]);
    }
  );
};

// =====================
// GET RECRUITER COMPANY
// =====================
exports.getMyCompany = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT c.*
     FROM recruiters r
     JOIN companies c ON r.company_id = c.id
     WHERE r.user_id = ?
     LIMIT 1`,
    [userId],
    (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "No company linked to this recruiter" });
      }

      return res.json(rows[0]);
    }
  );
};

// =====================
// UPDATE RECRUITER COMPANY
// =====================
exports.updateMyCompany = (req, res) => {
  const userId = req.user.id;
  const role = String(req.user.role || "").toLowerCase();
  const { name, description } = req.body || {};
  const logo = req.file ? req.file.filename : null;

  if (!["recruiter", "recuteir"].includes(role)) {
    return res.status(403).json({ error: "Only recruiters can update company profiles" });
  }

  db.query(
    "SELECT company_id FROM recruiters WHERE user_id = ? LIMIT 1",
    [userId],
    (linkErr, linkRows) => {
      if (linkErr) {
        console.log("DB ERROR:", linkErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (linkRows.length === 0 || !linkRows[0].company_id) {
        return res.status(404).json({ error: "No company linked to this recruiter" });
      }

      const companyId = linkRows[0].company_id;
      const fields = [];
      const values = [];

      if (typeof name === "string" && name.trim()) {
        fields.push("name = ?");
        values.push(name.trim());
      }

      if (description !== undefined) {
        fields.push("description = ?");
        values.push(description ? String(description).trim() : null);
      }

      if (logo) {
        fields.push("logo = ?");
        values.push(logo);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: "No company fields provided to update" });
      }

      values.push(companyId);

      db.query(
        `UPDATE companies SET ${fields.join(", ")} WHERE id = ?`,
        values,
        (updateErr) => {
          if (updateErr) {
            console.log("DB ERROR:", updateErr);
            return res.status(500).json({ error: "Company update failed" });
          }

          db.query(
            "SELECT * FROM companies WHERE id = ? LIMIT 1",
            [companyId],
            (getErr, rows) => {
              if (getErr) {
                console.log("DB ERROR:", getErr);
                return res.status(500).json({ error: "Database error" });
              }

              return res.json({
                message: "Company updated",
                company: rows[0] || null,
              });
            }
          );
        }
      );
    }
  );
};