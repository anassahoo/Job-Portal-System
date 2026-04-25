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