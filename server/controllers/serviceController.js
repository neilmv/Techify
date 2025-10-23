import db from "../config/db.js";

// Get all services with their type
export const getServices = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, st.name AS service_type, s.brand, s.description, s.base_price, s.image
      FROM services s
      JOIN service_types st ON s.service_type_id = st.id
      ORDER BY st.name, s.brand
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all service types
export const getServiceTypes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM service_types ORDER BY name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
