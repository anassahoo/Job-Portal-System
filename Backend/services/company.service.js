const db = require("../config/db");


// =====================
// CREATE COMPANY
// =====================
exports.createCompany = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Company name required" });
  }

  db.query(
    "INSERT INTO companies (name, description) VALUES (?, ?)",
    [name, description || null],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Company creation failed" });
      }

      return res.json({
        message: "Company created",
        company_id: result.insertId
      });
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