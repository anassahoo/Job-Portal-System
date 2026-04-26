const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("Database Connected Successfully");

    const schemaFixes = [
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) NULL",
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS last_name VARCHAR(255) NULL",
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL",
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone VARCHAR(255) NULL",
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS experience VARCHAR(255) NULL",
      "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS cover_letter TEXT NULL",
    ];

    schemaFixes.forEach(sql => {
      db.query(sql, err2 => {
        if (err2 && err2.code !== 'ER_DUP_FIELDNAME' && err2.code !== 'ER_DUP_KEYNAME') {
          console.log('Schema fix skipped:', err2.message);
        }
      });
    });
  }
});

module.exports = db;