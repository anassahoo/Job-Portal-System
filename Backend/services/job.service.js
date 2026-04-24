const db = require("../config/db");



// =====================
// CREATE JOB (NO IMAGE)
// =====================
exports.createJob = (req, res) => {
  const body = req.body || {};
  const { title, description, company_id } = body;

  if (!title || !description || !company_id) {
    return res.status(400).json({
      error: "Title, description, and company_id required"
    });
  }

  db.query(
    `INSERT INTO jobs 
     (title, description, company_id) 
     VALUES (?, ?, ?)`,
    [title, description, company_id],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Job creation failed" });
      }

      return res.json({
        message: "Job created successfully",
        job_id: result.insertId
      });
    }
  );
};

// =====================
// ADD SKILL TO JOB
// =====================
exports.addJobSkill = (req, res) => {
  const body = req.body || {};
  const { job_id, skill_id } = body;

  if (!job_id || !skill_id) {
    return res.status(400).json({
      error: "job_id and skill_id required"
    });
  }

  db.query(
    "INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)",
    [job_id, skill_id],
    (err) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Failed to add skill" });
      }

      return res.json({ message: "Skill added to job" });
    }
  );
};


// =====================
// GET ALL JOBS
// =====================
exports.getAllJobs = (req, res) => {
  db.query(
    `SELECT j.*, c.name AS company_name
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id`,
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
// GET JOB DETAILS
// =====================
exports.getJobDetails = (req, res) => {
  const jobId = req.params.id;

  db.query(
    `SELECT j.*, c.name AS company_name, s.skill_name
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN job_skills js ON j.id = js.job_id
     LEFT JOIN skills s ON js.skill_id = s.id
     WHERE j.id = ?`,
    [jobId],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.json(result);
    }
  );
};