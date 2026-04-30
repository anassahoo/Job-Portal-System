const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
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

    connection.release();
  }
});

module.exports = db;