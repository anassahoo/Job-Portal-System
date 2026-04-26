const db = require("../config/db");



// =====================
// CREATE JOB (NO IMAGE)
// =====================
exports.createJob = (req, res) => {
  const userId = req.user.id;
  const body = req.body || {};
  const { title, description, company_id } = body;

  if (!title || !description || !company_id) {
    return res.status(400).json({
      error: "Title, description, and company_id required"
    });
  }

  db.query(
    "SELECT id FROM recruiters WHERE user_id = ? AND company_id = ? LIMIT 1",
    [userId, company_id],
    (linkErr, linkRows) => {
      if (linkErr) {
        console.log("DB ERROR:", linkErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (linkRows.length === 0) {
        return res.status(403).json({ error: "You can only post jobs for your own company" });
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
    }
  );
};

// =====================
// ADD SKILL TO JOB
// =====================
exports.addJobSkill = (req, res) => {
  const userId = req.user.id;
  const body = req.body || {};
  const { job_id, skill_id } = body;

  if (!job_id || !skill_id) {
    return res.status(400).json({
      error: "job_id and skill_id required"
    });
  }

  db.query(
    `SELECT j.id
     FROM jobs j
     JOIN recruiters r ON j.company_id = r.company_id
     WHERE j.id = ? AND r.user_id = ?
     LIMIT 1`,
    [job_id, userId],
    (accessErr, accessRows) => {
      if (accessErr) {
        console.log("DB ERROR:", accessErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (accessRows.length === 0) {
        return res.status(403).json({ error: "You can only add skills to your own jobs" });
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
    }
  );
};


// =====================
// GET ALL JOBS
// =====================
exports.getAllJobs = (req, res) => {
  db.query(
    `SELECT j.*, c.name AS company_name, c.logo AS company_logo, jsum.required_skills
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN (
       SELECT js.job_id, GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS required_skills
       FROM job_skills js
       JOIN skills s ON js.skill_id = s.id
       GROUP BY js.job_id
     ) jsum ON j.id = jsum.job_id`,
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
    `SELECT j.*, c.name AS company_name, c.logo AS company_logo, jsum.required_skills
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN (
       SELECT js.job_id, GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS required_skills
       FROM job_skills js
       JOIN skills s ON js.skill_id = s.id
       GROUP BY js.job_id
     ) jsum ON j.id = jsum.job_id
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

// =====================
// GET MY JOBS (RECRUITER)
// =====================
exports.getMyJobs = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT j.*, c.name AS company_name, jsum.required_skills,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicants_count
     FROM jobs j
     JOIN recruiters r ON j.company_id = r.company_id
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN (
       SELECT js.job_id, GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS required_skills
       FROM job_skills js
       JOIN skills s ON js.skill_id = s.id
       GROUP BY js.job_id
     ) jsum ON j.id = jsum.job_id
     WHERE r.user_id = ?
     ORDER BY j.id DESC`,
    [userId],
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
// UPDATE JOB (RECRUITER)
// =====================
exports.updateJob = (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.id;
  const { title, description, skill_ids } = req.body || {};

  const fields = [];
  const values = [];
  const hasSkillUpdate = skill_ids !== undefined;

  const normalizeSkillIds = () => {
    const rawSkillIds = Array.isArray(skill_ids)
      ? skill_ids
      : typeof skill_ids === "string"
        ? skill_ids.split(",")
        : [];

    return Array.from(
      new Set(
        rawSkillIds
          .map(id => Number(id))
          .filter(id => Number.isInteger(id) && id > 0)
      )
    );
  };

  if (typeof title === "string" && title.trim()) {
    fields.push("title = ?");
    values.push(title.trim());
  }

  if (typeof description === "string" && description.trim()) {
    fields.push("description = ?");
    values.push(description.trim());
  }

  if (fields.length === 0 && !hasSkillUpdate) {
    return res.status(400).json({ error: "No job fields provided to update" });
  }

  db.query(
    `SELECT j.id
     FROM jobs j
     JOIN recruiters r ON j.company_id = r.company_id
     WHERE j.id = ? AND r.user_id = ?
     LIMIT 1`,
    [jobId, userId],
    (accessErr, accessRows) => {
      if (accessErr) {
        console.log("DB ERROR:", accessErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (accessRows.length === 0) {
        return res.status(403).json({ error: "You can only edit your own jobs" });
      }

      const finishUpdate = () => {
        if (!hasSkillUpdate) {
          return res.json({ message: "Job updated successfully" });
        }

        const nextSkillIds = normalizeSkillIds();

        db.query(
          "DELETE FROM job_skills WHERE job_id = ?",
          [jobId],
          (deleteErr) => {
            if (deleteErr) {
              console.log("DB ERROR:", deleteErr);
              return res.status(500).json({ error: "Failed to update job skills" });
            }

            if (nextSkillIds.length === 0) {
              return res.json({ message: "Job updated successfully" });
            }

            let index = 0;

            const insertNextSkill = () => {
              if (index >= nextSkillIds.length) {
                return res.json({ message: "Job updated successfully" });
              }

              db.query(
                "INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)",
                [jobId, nextSkillIds[index]],
                (insertErr) => {
                  if (insertErr) {
                    console.log("DB ERROR:", insertErr);
                    return res.status(500).json({ error: "Failed to update job skills" });
                  }

                  index += 1;
                  insertNextSkill();
                }
              );
            };

            insertNextSkill();
          }
        );
      };

      if (fields.length === 0) {
        return finishUpdate();
      }

      values.push(jobId);

      db.query(
        `UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`,
        values,
        (updateErr) => {
          if (updateErr) {
            console.log("DB ERROR:", updateErr);
            return res.status(500).json({ error: "Job update failed" });
          }

          return finishUpdate();
        }
      );
    }
  );
};