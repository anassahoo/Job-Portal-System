const db = require("../config/db");

function isRecruiterRole(roleValue) {
  const normalized = String(roleValue || "").toLowerCase();
  return ["recruiter", "recuteir", "recuiter", "recurieter", "recuriecter"].includes(normalized);
}

exports.applyJob = (req, res) => {
  const userId = req.user.id;
  const { job_id } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: "job_id required" });
  }

  db.query(
    "SELECT id FROM applications WHERE user_id = ? AND job_id = ? LIMIT 1",
    [userId, job_id],
    (existingErr, existingRows) => {
      if (existingErr) return res.status(500).json({ error: "DB error" });

      if (existingRows.length > 0) {
        return res.status(400).json({ error: "You have already applied for this job" });
      }

      db.query(
        "SELECT skill_id FROM user_skills WHERE user_id = ?",
        [userId],
        (err, userSkills) => {
          if (err) return res.status(500).json({ error: "DB error" });

          const userSkillIds = userSkills.map(s => s.skill_id);

          db.query(
            "SELECT skill_id FROM job_skills WHERE job_id = ?",
            [job_id],
            (err2, jobSkills) => {
              if (err2) return res.status(500).json({ error: "DB error" });

              const jobSkillIds = jobSkills.map(s => s.skill_id);
              const matched = jobSkillIds.filter(id => userSkillIds.includes(id));

              const match_percentage =
                jobSkillIds.length === 0
                  ? 0
                  : Math.round((matched.length / jobSkillIds.length) * 100);

              db.query(
                "SELECT resume_score FROM resumes WHERE user_id = ?",
                [userId],
                (err3, resumeResult) => {
                  const resume_score = resumeResult[0]?.resume_score || 0;
                  const project_score = 50;

                  let prediction = "Pending Review";
                  if (match_percentage > 70 && resume_score > 60) {
                    prediction = "Selected";
                  }

                  const status = "Pending";

                  db.query(
                    `INSERT INTO applications
                     (user_id, job_id, match_percentage, resume_score, project_score, prediction, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [userId, job_id, match_percentage, resume_score, project_score, prediction, status],
                    (err4) => {
                      if (err4) {
                        console.log(err4);
                        return res.status(500).json({ error: "Insert failed" });
                      }

                      return res.json({
                        message: "Application submitted",
                        match_percentage,
                        prediction,
                        status,
                      });
                    }
                  );
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
    `SELECT
      a.id,
      a.user_id,
      a.job_id,
      a.match_percentage,
      a.resume_score,
      a.project_score,
      a.prediction,
      a.status,
      j.title AS job_title,
      c.name AS company_name
     FROM applications a
     LEFT JOIN jobs j ON a.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     WHERE a.user_id = ?
     ORDER BY a.id DESC`,
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
  if (!isRecruiterRole(role)) {
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
      COALESCE(u.email, resume.email) AS applicant_email,
      COALESCE(p.first_name, resume.first_name) AS first_name,
      COALESCE(p.last_name, resume.last_name) AS last_name,
      COALESCE(p.phone, resume.phone) AS phone,
      p.professional_title,
      p.location,
      p.bio,
      p.profile_image,
      resume.file_path AS resume_file,
      resume.experience,
      resume.cover_letter,
      GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS skills,
      j.title AS job_title,
      c.name AS company_name
    FROM applications a
    LEFT JOIN auth_users u ON a.user_id = u.id
    LEFT JOIN user_profiles p ON a.user_id = p.user_id
    LEFT JOIN resumes resume ON a.user_id = resume.user_id
    LEFT JOIN user_skills us ON a.user_id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.id
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    JOIN recruiters r ON j.company_id = r.company_id
    WHERE r.user_id = ?
    GROUP BY a.id, a.user_id, a.job_id, a.match_percentage, a.resume_score, a.project_score, a.prediction, a.status,
      u.email, p.first_name, p.last_name, p.phone, p.professional_title, p.location, p.bio, p.profile_image,
      resume.file_path, resume.experience, resume.cover_letter, resume.email, resume.first_name, resume.last_name, resume.phone,
      j.title, c.name
    ORDER BY a.id DESC`,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      return res.json(result);
    }
  );
};

// =====================
// UPDATE APPLICATION STATUS (RECRUITER)
// =====================
exports.updateApplicationStatus = (req, res) => {
  const role = String(req.user.role || "").toLowerCase();
  if (!isRecruiterRole(role)) {
    return res.status(403).json({ error: "Recruiter access required" });
  }

  const applicationId = Number(req.params.id);
  const requestedStatus = String(req.body.status || "").trim();

  const statusAliases = {
    pending: "Pending",
    interview: "Interview",
    interviewed: "Interview",
    rejected: "Rejected",
  };

  const normalizedStatus = statusAliases[requestedStatus.toLowerCase()];

  if (!applicationId || !normalizedStatus) {
    return res.status(400).json({ error: "Valid application id and status are required" });
  }

  db.query(
    `SELECT a.id
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN recruiters r ON j.company_id = r.company_id
     WHERE a.id = ? AND r.user_id = ?
     LIMIT 1`,
    [applicationId, req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (rows.length === 0) {
        return res.status(404).json({ error: "Application not found for this recruiter" });
      }

      db.query(
        "UPDATE applications SET status = ? WHERE id = ?",
        [normalizedStatus, applicationId],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: "Failed to update application status" });

          return res.json({
            message: "Application status updated successfully",
            application_id: applicationId,
            status: normalizedStatus,
          });
        }
      );
    }
  );
};