import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import db from "../config/db.js";
dotenv.config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/profiles/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Secret key check for admin registration
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin secret key" });
  }

  try {
    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, 1] // role = 1 for admin
    );

    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Include role in the token
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role || 0 // Default to 0 if role doesn't exist
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profile_picture: user.profile_picture,
        role: user.role || 0, // Include role in response
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};



// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, phone, address } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
      [name, phone, address, userId]
    );

    const [users] = await db.query(
      "SELECT id, name, email, phone, address, profile_picture, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: users[0],
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// UPDATE PROFILE PICTURE
export const updateProfilePicture = [
  upload.single("profile_picture"),
  async (req, res) => {
    console.log("Profile picture upload request received");
    console.log("User ID from middleware:", req.userId);
    console.log("File:", req.file);

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const profilePicturePath = "/uploads/profiles/" + req.file.filename;
      console.log("Profile picture path:", profilePicturePath);

      const [result] = await db.query(
        "UPDATE users SET profile_picture = ? WHERE id = ?",
        [profilePicturePath, userId]
      );

      const [users] = await db.query(
        "SELECT id, name, email, phone, address, profile_picture, role, created_at FROM users WHERE id = ?",
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Profile picture updated successfully for user:", userId);
      res.json({
        message: "Profile picture updated successfully",
        user: users[0],
      });
    } catch (err) {
      console.error("Error updating profile picture:", err);
      res.status(500).json({ message: "Database error", error: err });
    }
  },
];

// GET USER PROFILE
export const getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const [users] = await db.query(
      "SELECT id, name, email, phone, address, profile_picture, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};