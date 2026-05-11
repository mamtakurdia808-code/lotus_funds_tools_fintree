import { pool } from "../db";

interface AuditLogParams {
  adminName?: string;
  adminId?: string;
  adminRole?: string;

  action: string;

  module?: string;

  targetEntity?: string;
  targetType?: string;

  description?: string;

  status?: string;

  reason?: string;

  ipAddress?: string;

  device?: string;

  oldValue?: any;

  newValue?: any;
}

export const createAuditLog = async ({
  adminName,
  adminId,
  adminRole,

  action,

  module,

  targetEntity,
  targetType,

  description,

  status = "SUCCESS",

  reason,

  ipAddress,

  device,

  oldValue,

  newValue,
}: AuditLogParams) => {
  try {
    await pool.query(
      `
      INSERT INTO audit_logs (
        admin_name,
        admin_id,
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
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
      `,
      [
        adminName || null,
        adminId || null,
        adminRole || null,

        action,

        module || null,

        targetEntity || null,
        targetType || null,

        description || null,

        status,

        reason || null,

        ipAddress || null,

        device || null,

        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
      ]
    );
  } catch (error: any) {
  console.error("AUDIT LOG ERROR FULL:", error);
  console.error("AUDIT LOG ERROR MESSAGE:", error?.message);
  console.error("AUDIT LOG ERROR DETAIL:", error?.detail);
}
};