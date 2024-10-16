const mysql = require("mysql2/promise");

const dbConfig = {
  host: "52.72.71.52",
  user: "revive_user",
  password: "Revive@2024",
  database: "revive",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
