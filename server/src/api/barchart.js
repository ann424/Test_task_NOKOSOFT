import express from "express";
import db from "../db.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          COALESCE(o.category_l1, r.category_l1, c.description, 'Other') AS category,
          SUM(ABS(t.txn_amount)) AS total_spend
      FROM transactions t
      LEFT JOIN mcc_overrides o ON t.mcc = o.mcc
      LEFT JOIN mcc_category_rules r 
            ON t.mcc BETWEEN r.range_start AND r.range_end
      LEFT JOIN mcc_catalog c ON t.mcc = c.mcc
      GROUP BY category
      ORDER BY total_spend DESC;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching spend by category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
