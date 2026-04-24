const db = require("../config/db");

exports.addSkill = (req, res) => {
  const userId = req.user.id;
  const { skill_id } = req.body;

  if (!skill_id) {
    return res.status(400).json({ error: "skill_id required" });
  }

  db.query(
    "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
    [userId, skill_id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to add skill" });

      return res.json({ message: "Skill added" });
    }
  );
};

exports.getMySkills = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT s.id, s.skill_name
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      return res.json(result);
    }
  );
};

exports.removeSkill = (req, res) => {
  const userId = req.user.id;
  const { skill_id } = req.body;

  db.query(
    "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?",
    [userId, skill_id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to remove skill" });

      return res.json({ message: "Skill removed" });
    }
  );
};


//create new skill
exports.createSkill = (req, res) => {
  const { skill_name } = req.body;

  if (!skill_name) {
    return res.status(400).json({ error: "Skill name required" });
  }

  db.query(
    "INSERT INTO skills (skill_name) VALUES (?)",
    [skill_name],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Skill creation failed" });

      return res.json({
        message: "Skill created",
        skill_id: result.insertId
      });
    }
  );
};