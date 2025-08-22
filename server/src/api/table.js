
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/delinquency", async (req, res) => {
  try {
    const [rows] = await db.query(`
 SELECT 
    u.name,
    u.surname,
    DATE_FORMAT(c.statement_due_date, '%Y-%m-%d') AS statement_due_date,
    DATE_FORMAT(c.statement_date, '%Y-%m-%d') AS statement_date,
    c.statement_amount,
    c.remaining_statement_amount,
    c.statement_min_amount,
    c.remaining_statement_min_amount,
    CASE 
        WHEN c.remaining_statement_min_amount > 0 
             AND CURDATE() > c.statement_due_date 
        THEN 'Missed'
        ELSE 'Current'
    END AS status,
    CASE 
        WHEN c.remaining_statement_min_amount > 0 
             AND CURDATE() > c.statement_due_date
        THEN DATEDIFF(CURDATE(), c.statement_due_date)
        ELSE 0
    END AS overdue_days
FROM cards c
JOIN users u ON c.user_id = u.id
ORDER BY c.statement_due_date ASC
LIMIT 20;

    `);

    res.json({
        ok: true,
        data: rows.map(r => ({
          user: `${r.name} ${r.surname}`,
          due: r.statement_due_date
            ? new Date(r.statement_due_date).toISOString().split("T")[0]
            : null,
          statement_date: r.statement_date
            ? new Date(r.statement_date).toISOString().split("T")[0]
            : null,
          statement: Number(r.statement_amount),
          remaining: Number(r.remaining_statement_amount),
          status: r.status,
          overdue: r.overdue_days ?? 0
        }))
 });
  } catch (err) {
    console.error("Delinquency API error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
