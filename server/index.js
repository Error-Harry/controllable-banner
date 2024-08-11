import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "banner",
});

app.get("/", (req, res) => {
  const query = "SELECT * FROM banner_data WHERE id = 1";

  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.post("/internal-dashboard", (req, res) => {
  const { description, timer, link } = req.body;

  const query = `
    UPDATE banner_data 
    SET 
      is_visible = 1, 
      description = ?, 
      timer = ?, 
      link = ?, 
      admin_visibility = 1
    WHERE id = 1`;

  const values = [description, timer, link];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Banner updated successfully!" });
  });
});

app.post("/update-visibility", (req, res) => {
  const { is_visible } = req.body;

  if (is_visible !== 0 && is_visible !== 1) {
    return res
      .status(400)
      .json({ message: "Invalid visibility value. Use 0 or 1." });
  }

  const query = `
    UPDATE banner_data 
    SET 
      is_visible = ?, 
      admin_visibility = 1
    WHERE id = 1`;

  db.query(query, [is_visible], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Banner visibility updated successfully!" });
  });
});

console.log(process.env.PORT || 8800);
app.listen(process.env.PORT || 8800, () => {
  console.log("Connected to backend");
});
