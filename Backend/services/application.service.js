const db = require("../config/db");

exports.applyJob = (req, res) => {
  const userId = req.user.id;
  const { job_id } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: "job_id required" });
  }

  // 1. USER SKILLS
  db.query(
    "SELECT skill_id FROM user_skills WHERE user_id = ?",
    [userId],
    (err, userSkills) => {
      if (err) return res.status(500).json({ error: "DB error" });

      const userSkillIds = userSkills.map(s => s.skill_id);

      // 2. JOB SKILLS
      db.query(
        "SELECT skill_id FROM job_skills WHERE job_id = ?",
        [job_id],
        (err2, jobSkills) => {
          if (err2) return res.status(500).json({ error: "DB error" });

          const jobSkillIds = jobSkills.map(s => s.skill_id);

          // 3. MATCH %
          const matched = jobSkillIds.filter(id => userSkillIds.includes(id));

          const match_percentage =
            jobSkillIds.length === 0
              ? 0
              : Math.round((matched.length / jobSkillIds.length) * 100);

          // 4. RESUME SCORE
          db.query(
            "SELECT resume_score FROM resumes WHERE user_id = ?",
            [userId],
            (err3, resumeResult) => {
              const resume_score = resumeResult[0]?.resume_score || 0;

              // 5. PROJECT SCORE (TEMP)
              const project_score = 50;

              // 6. SIMPLE PREDICTION (TEMP LOGIC)
              let prediction = "Rejected";

              if (match_percentage > 70 && resume_score > 60) {
                prediction = "Selected";
              }

              // 7. SAVE
              db.query(
                `INSERT INTO applications 
                (user_id, job_id, match_percentage, resume_score, project_score, prediction, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  userId,
                  job_id,
                  match_percentage,
                  resume_score,
                  project_score,
                  prediction,
                  prediction
                ],
                (err4) => {
                  if (err4) {
                    console.log(err4);
                    return res.status(500).json({ error: "Insert failed" });
                  }

                  return res.json({
                    message: "Application submitted",
                    match_percentage,
                    prediction
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};


// =====================
// GET APPLICATIONS
// =====================
exports.getApplications = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM applications WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      return res.json(result);
    }
  );
};

// =====================
// GET APPLICATIONS FOR RECRUITER
// =====================
exports.getRecruiterApplications = (req, res) => {
  const role = String(req.user.role || "").toLowerCase();
  if (!["recuteir", "recruiter"].includes(role)) {
    return res.status(403).json({ error: "Recruiter access required" });
  }

  db.query(
    `SELECT
      a.id,
      a.user_id,
      a.job_id,
      a.match_percentage,
      a.resume_score,
      a.project_score,
      a.prediction,
      a.status,
      u.email AS applicant_email,
      j.title AS job_title,
      c.name AS company_name
    FROM applications a
    LEFT JOIN auth_users u ON a.user_id = u.id
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    ORDER BY a.id DESC`,
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      return res.json(result);
    }
  );
};