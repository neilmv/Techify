import db from "../config/db.js";

export const getRepairHistory = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM repair_history ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
