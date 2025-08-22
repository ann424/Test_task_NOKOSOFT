
import express from "express";
import { db } from "../db.js";

const router = express.Router();


router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT 
    o.category_l2 AS category_name,
    t.mcc,
    COUNT(*) AS transaction_count,
    SUM(t.txn_amount) AS total_spend
FROM transactions t
JOIN mcc_overrides o ON t.mcc = o.mcc
GROUP BY t.mcc, o.category_l2
ORDER BY total_spend DESC
LIMIT 15;


    `);

    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error("[/api/mcc-breakdown] error:", e);
    res.status(500).json({ ok: false, error: "Failed to load MCC breakdown" });
  }
});

export default router;
