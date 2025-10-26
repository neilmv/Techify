import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalRevenue,
      pendingBookings,
      servicesStats,
      recentBookings,
    ] = await Promise.all([
      // Total users count (only regular users, not admins)
      db.query("SELECT COUNT(*) as count FROM users WHERE role = 0"),

      // Total bookings count
      db.query("SELECT COUNT(*) as count FROM bookings"),

      // Total revenue - handle empty payments table
      db.query(
        "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'Paid'"
      ),

      // Pending bookings count
      db.query(
        "SELECT COUNT(*) as count FROM bookings WHERE status = 'Pending'"
      ),

      // Services statistics - FIXED: Use actual bookings count
      db.query(`
        SELECT st.name as service_type, COUNT(b.id) as booking_count 
        FROM service_types st 
        LEFT JOIN services s ON st.id = s.service_type_id 
        LEFT JOIN bookings b ON s.id = b.service_id 
        WHERE b.id IS NOT NULL
        GROUP BY st.id, st.name
      `),

      // Recent bookings with user info
      db.query(`
        SELECT b.*, u.name as customer_name, u.email, s.brand, st.name as service_type
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        JOIN service_types st ON s.service_type_id = st.id
        ORDER BY b.created_at DESC
        LIMIT 10
      `),
    ]);

    // Calculate estimated revenue based on ALL bookings since payments table is empty
    const [estimatedRevenue] = await db.query(`
      SELECT COALESCE(SUM(s.base_price), 0) as estimated_total 
      FROM bookings b
      JOIN services s ON b.service_id = s.id
    `);

    res.json({
      stats: {
        totalUsers: totalUsers[0][0].count,
        totalBookings: totalBookings[0][0].count,
        totalRevenue:
          totalRevenue[0][0].total || estimatedRevenue[0][0].estimated_total,
        pendingBookings: pendingBookings[0][0].count,
      },
      servicesStats: servicesStats[0],
      recentBookings: recentBookings[0],
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all users with pagination
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.address, 
        u.role, 
        u.profile_picture, 
        u.created_at,
        COUNT(b.id) as bookings_count,
        MAX(b.created_at) as last_booking_date
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.role = 0
    `;

    let countQuery = `SELECT COUNT(*) as total FROM users WHERE role = 0`;
    const params = [];
    const countParams = [];

    if (search) {
      const searchParam = `%${search}%`;
      query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [users] = await db.query(query, params);
    const [totalResult] = await db.query(countQuery, countParams);

    console.log('Users with bookings count:', users);

    res.json({
      users: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResult[0].total / limit),
        totalUsers: totalResult[0].total,
        hasNext: page < Math.ceil(totalResult[0].total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Attempting to delete user ID:', id);
    const [userCheck] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [id]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userCheck[0].role === 1) {
      return res.status(403).json({ 
        message: "Cannot delete administrator accounts" 
      });
    }
    const [bookings] = await db.query(
      "SELECT id FROM bookings WHERE user_id = ?",
      [id]
    );

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete user with existing bookings. Please delete their bookings first.",
        bookingsCount: bookings.length
      });
    }
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ? AND role = 0",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "User not found or cannot delete admin user" 
      });
    }

    console.log('User deleted successfully:', id);
    res.json({ 
      message: "User deleted successfully",
      deletedUserId: parseInt(id)
    });
    
  } catch (err) {
    console.error("Error deleting user:", err);
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message: "Cannot delete user due to existing references in other tables"
      });
    }
    
    res.status(500).json({ 
      message: "Database error", 
      error: err.message 
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status, adminNotes } = req.body;

  const validStatuses = [
    "Pending",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [result] = await db.query(
      "UPDATE bookings SET status = ?, admin_notes = COALESCE(?, admin_notes) WHERE id = ?",
      [status, adminNotes, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Get updated booking with user info
    const [bookings] = await db.query(
      `
      SELECT b.*, u.name as customer_name, u.email, s.brand, st.name as service_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
      WHERE b.id = ?
    `,
      [bookingId]
    );

    res.json({
      message: "Booking status updated successfully",
      booking: bookings[0],
    });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all bookings with filters
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
      service_type = "",
      date_from = "",
      date_to = "",
      search = "",
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, u.name as customer_name, u.email, u.phone, u.profile_picture,
             s.brand, s.base_price, st.name as service_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
    `;

    const whereConditions = [];
    const params = [];

    if (status) {
      whereConditions.push("b.status = ?");
      params.push(status);
    }

    if (service_type) {
      whereConditions.push("st.name = ?");
      params.push(service_type);
    }

    if (date_from) {
      whereConditions.push("b.date >= ?");
      params.push(date_from);
    }

    if (date_to) {
      whereConditions.push("b.date <= ?");
      params.push(date_to);
    }

    if (search) {
      const searchParam = `%${search}%`;
      whereConditions.push(`
        (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR s.brand LIKE ?)
      `);
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (whereConditions.length > 0) {
      const whereClause = " WHERE " + whereConditions.join(" AND ");
      query += whereClause;
      countQuery += whereClause;
    }

    query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [bookings] = await db.query(query, params);

    const countParams = params.slice(0, -2);
    const [totalResult] = await db.query(countQuery, countParams);

    res.json({
      bookings: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResult[0].total / limit),
        totalBookings: totalResult[0].total,
        hasNext: page < Math.ceil(totalResult[0].total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    let dateFormat, groupBy;
    switch (period) {
      case "weekly":
        dateFormat = "%Y-%u";
        groupBy = "WEEK";
        break;
      case "yearly":
        dateFormat = "%Y";
        groupBy = "YEAR";
        break;
      default:
        dateFormat = "%Y-%m";
        groupBy = "MONTH";
    }

    const [revenueData] = await db.query(
      `
      SELECT 
        DATE_FORMAT(p.created_at, ?) as period,
        COUNT(p.id) as transaction_count,
        SUM(p.amount) as total_revenue,
        AVG(p.amount) as average_revenue
      FROM payments p
      WHERE p.payment_status = 'Paid'
      GROUP BY period
      ORDER BY period DESC
      LIMIT 12
    `,
      [dateFormat]
    );

    // Service type revenue
    const [serviceRevenue] = await db.query(`
      SELECT 
        st.name as service_type,
        COUNT(p.id) as booking_count,
        SUM(p.amount) as total_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      JOIN service_types st ON s.service_type_id = st.id
      WHERE p.payment_status = 'Paid'
      GROUP BY st.id, st.name
      ORDER BY total_revenue DESC
    `);

    res.json({
      revenueTrend: revenueData,
      serviceRevenue: serviceRevenue,
      period: groupBy.toLowerCase(),
    });
  } catch (err) {
    console.error("Error fetching revenue analytics:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all services for admin
export const getServices = async (req, res) => {
  try {
    const [services] = await db.query(`
      SELECT s.*, st.name as service_type 
      FROM services s 
      JOIN service_types st ON s.service_type_id = st.id 
      ORDER BY s.id DESC  -- Changed from s.created_at to s.id
    `);

    res.json({
      services: services,
    });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Create new service
export const createService = async (req, res) => {
  const { service_type_id, brand, description, base_price, image } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO services (service_type_id, brand, description, base_price, image) VALUES (?, ?, ?, ?, ?)",
      [service_type_id, brand, description, base_price, image || null]
    );

    const [newService] = await db.query(
      `
      SELECT s.*, st.name as service_type 
      FROM services s 
      JOIN service_types st ON s.service_type_id = st.id 
      WHERE s.id = ?
    `,
      [result.insertId]
    );

    res.status(201).json({
      message: "Service created successfully",
      service: newService[0],
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Update service
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { service_type_id, brand, description, base_price, image } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE services SET service_type_id = ?, brand = ?, description = ?, base_price = ?, image = ? WHERE id = ?",
      [service_type_id, brand, description, base_price, image || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service updated successfully" });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if service has bookings
    const [bookings] = await db.query(
      "SELECT id FROM bookings WHERE service_id = ?",
      [id]
    );

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete service with existing bookings",
      });
    }

    const [result] = await db.query("DELETE FROM services WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all service types
export const getServiceTypes = async (req, res) => {
  try {
    const [serviceTypes] = await db.query(`
      SELECT * FROM service_types 
      ORDER BY name ASC
    `);

    res.json(serviceTypes);
  } catch (err) {
    console.error("Error fetching service types:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Create new service type
export const createServiceType = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Service type name is required" });
  }

  try {
    // Check if service type already exists
    const [existing] = await db.query(
      "SELECT id FROM service_types WHERE name = ?",
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Service type already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO service_types (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    const [newServiceType] = await db.query(
      "SELECT * FROM service_types WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Service type created successfully",
      serviceType: newServiceType[0],
    });
  } catch (err) {
    console.error("Error creating service type:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Update service type
export const updateServiceType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Service type name is required" });
  }

  try {
    // Check if service type exists
    const [existing] = await db.query(
      "SELECT id FROM service_types WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Service type not found" });
    }

    // Check if name already exists (excluding current service type)
    const [nameExists] = await db.query(
      "SELECT id FROM service_types WHERE name = ? AND id != ?",
      [name, id]
    );

    if (nameExists.length > 0) {
      return res.status(400).json({ message: "Service type name already exists" });
    }

    const [result] = await db.query(
      "UPDATE service_types SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service type not found" });
    }

    const [updatedServiceType] = await db.query(
      "SELECT * FROM service_types WHERE id = ?",
      [id]
    );

    res.json({
      message: "Service type updated successfully",
      serviceType: updatedServiceType[0],
    });
  } catch (err) {
    console.error("Error updating service type:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete service type
export const deleteServiceType = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if service type exists
    const [existing] = await db.query(
      "SELECT id FROM service_types WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Service type not found" });
    }

    // Check if service type has associated services
    const [services] = await db.query(
      "SELECT id FROM services WHERE service_type_id = ?",
      [id]
    );

    if (services.length > 0) {
      return res.status(400).json({
        message: "Cannot delete service type with associated services. Please delete or reassign the services first.",
        servicesCount: services.length
      });
    }

    const [result] = await db.query("DELETE FROM service_types WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service type not found" });
    }

    res.json({ 
      message: "Service type deleted successfully",
      deletedServiceTypeId: parseInt(id)
    });
  } catch (err) {
    console.error("Error deleting service type:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};
