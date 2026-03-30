import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendOtpMail } from "../config/mailer";

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    let user;
    let source = "users";

    // ✅ FIX 1: CHECK RA USERS FIRST
    let result = await pool.query(
      `SELECT id, username, password_hash, role, status
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rows.length > 0) {
      user = result.rows[0];
      source = "users";
    } else {
      // THEN CHECK ADMIN
      result = await pool.query(
        `SELECT id, username, password_hash, role, status
         FROM company_users
         WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      user = result.rows[0];
      source = "company_users";
    }

    // ✅ FIX 2: STATUS CHECK
    if (user.status?.toLowerCase() !== "active") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        source
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ME ================= */

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    id: req.user.id,
    role: req.user.role
  });
};

/* ================= SEND OTP ================= */

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const userRes = await pool.query(
      `SELECT * FROM users 
       WHERE reset_token=$1 AND token_expiry > NOW()`,
      [token]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    const user = userRes.rows[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users 
       SET otp=$1, otp_expiry=$2, password_hash=$3 
       WHERE id=$4`,
      [otp, expiry, hashedPassword, user.id]
    );

    await sendOtpMail(user.email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { token, otp } = req.body;

    const userRes = await pool.query(
      `SELECT * FROM users 
       WHERE reset_token=$1 AND otp=$2 AND otp_expiry > NOW()`,
      [token, otp]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = userRes.rows[0];

    // ✅ FIX 3: USE status='active' (NOT is_active)
    await pool.query(
      `UPDATE users 
       SET status='active',
           reset_token=NULL,
           token_expiry=NULL,
           otp=NULL,
           otp_expiry=NULL
       WHERE id=$1`,
      [user.id]
    );

    res.json({ message: "Password set successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};