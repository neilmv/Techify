import db from "../config/db.js";

export const createPayment = async (req, res) => {
  const { booking_id, amount, payment_method, payment_status, transaction_id } = req.body;
  try {
    await db.query(
      `INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_id)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, amount, payment_method, payment_status, transaction_id]
    );
    res.status(201).json({ message: "Payment recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.name AS customer_name, s.brand, st.name AS service_type
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
