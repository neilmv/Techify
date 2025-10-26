import db from "../config/db.js";

export const createBooking = async (req, res) => {
  const { service_id, issue_description, date, time_slot } = req.body;
  try {
    const user_id = req.userId;
    
    const [result] = await db.query(
      `INSERT INTO bookings (user_id, service_id, issue_description, date, time_slot)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, service_id, issue_description, date, time_slot]
    );
    res.status(201).json({ message: "Booking created", bookingId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings (with joined info) - USER SPECIFIC
export const getBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const [rows] = await db.query(
      `
      SELECT b.*, u.name AS customer_name, s.brand, st.name AS service_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error in getBookings:", err);
    res.status(500).json({ error: err.message });
  }
};