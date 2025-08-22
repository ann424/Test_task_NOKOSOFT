
import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      WITH months AS (
        SELECT 1 AS m, 'Oca' AS month_name UNION ALL
        SELECT 2, 'Şub' UNION ALL
        SELECT 3, 'Mar' UNION ALL
        SELECT 4, 'Nis' UNION ALL
        SELECT 5, 'May' UNION ALL
        SELECT 6, 'Haz' UNION ALL
        SELECT 7, 'Tem' UNION ALL
        SELECT 8, 'Ağu' UNION ALL
        SELECT 9, 'Eyl' UNION ALL
        SELECT 10, 'Eki' UNION ALL
        SELECT 11, 'Kas' UNION ALL
        SELECT 12, 'Ara'
      )
      SELECT 
          m.month_name,
          m.m,
          IFNULL(SUM(CASE WHEN t.debt_or_credit = 'B' THEN t.txn_amount END), 0) AS borc_total,
          IFNULL(SUM(CASE WHEN t.debt_or_credit = 'A' THEN t.txn_amount END), 0) AS alacak_total
      FROM months m
      LEFT JOIN transactions t 
          ON MONTH(t.txn_datetime) = m.m 
         AND YEAR(t.txn_datetime) = 2025
      GROUP BY m.month_name, m.m
      ORDER BY m.m;
    `);

   
    const labels = rows.map(r => r.month_name);
    const B = rows.map(r => Number(r.borc_total));
    const A = rows.map(r => Number(r.alacak_total));

    
    let lastIdx = rows.findLastIndex(r => r.borc_total !== 0 || r.alacak_total !== 0);
    if (lastIdx === -1) lastIdx = rows.length - 1; 

    const lastMonthLabel = `${rows[lastIdx].month_name} 2025`;
    const lastMonthTotals = {
      B: Number(rows[lastIdx].borc_total),
      A: Number(rows[lastIdx].alacak_total),
      total: Number(rows[lastIdx].borc_total) + Number(rows[lastIdx].alacak_total)
    };

    res.json({
      ok: true,
      data: { labels, series: { B, A }, lastMonthLabel, lastMonthTotals }
    });
  } catch (e) {
    console.error("[/api/charts] error:", e);
    res.status(500).json({ ok: false, error: "Failed to load monthly spend" });
  }
});

export default router;
