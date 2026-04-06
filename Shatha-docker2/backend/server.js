const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// الاتصال بقاعدة البيانات (Docker)
const pool = new Pool({
  user: "postgres",
  host: "db",   // مهم
  database: "testdb",
  password: "password",
  port: 5432,
});

// إنشاء الجدول
pool.query(`
  CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,
    name TEXT
  )
`);

// إضافة اسم
app.post("/add-name", async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO names(name) VALUES($1)", [name]);
  res.send("done");
});

// جلب الأسماء
app.get("/names", async (req, res) => {
  const result = await pool.query("SELECT * FROM names");
  res.json(result.rows);
});

app.listen(3000, () => console.log("Server running"));
