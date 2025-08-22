
import express from "express";
import { db } from "../db.js";

const router = express.Router();


router.get("/debt-txns-by-period", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        CASE
          WHEN HOUR(txn_datetime) BETWEEN 6 AND 11 THEN 'Morning'
          WHEN HOUR(txn_datetime) BETWEEN 12 AND 17 THEN 'Afternoon'
          WHEN HOUR(txn_datetime) BETWEEN 18 AND 23 THEN 'Night'
          ELSE 'Late Night'
        END AS period,
        COUNT(*) AS total_txns
      FROM transactions
    
      GROUP BY period
      ORDER BY FIELD(period, 'Morning','Afternoon','Night','Late Night');
    `);

    const labels = rows.map(r => r.period);
    const values = rows.map(r => r.total_txns);

    res.json({ ok: true, data: { labels, values } });
  } catch (e) {
    console.error("[/api/pie/debt-txns-by-period] error:", e);
    res.status(500).json({ ok: false, error: "Failed to load debt txn pie" });
  }
});

export default router;
