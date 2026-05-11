import { Request, Response } from "express";
import { pool } from "../db";

export const getAuditLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id AS log_id,
        created_at,
        admin_name,
        admin_role,
        action,
        module,
        target_entity,
        target_type,
        description,
        status,
        reason,
        ip_address,
        device,
        old_value,
        new_value
      FROM audit_logs
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      logs: result.rows,
    });

  } catch (error) {
    console.error("GET AUDIT LOGS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};