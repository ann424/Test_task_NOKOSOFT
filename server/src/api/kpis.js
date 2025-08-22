import express from "express";
import { db } from "../db.js";

const router = express.Router();


async function numQuery(sql, params = []) {
  try {
    const [rows] = await db.query(sql, params);
    const key = Object.keys(rows[0] || { v: 0 })[0];
    return Number(rows[0]?.[key] ?? 0);
  } catch (e) {
    console.error("[/api/kpis] SQL error on:", sql, e.message);
    return 0;
  }
}

router.get("/", async (req, res) => {
  try {
   
    const totalSpend = await numQuery(
      "SELECT COALESCE(SUM(txn_amount),0) AS total_spend FROM transactions"
    );

    
    const totalUsers = await numQuery(`
      SELECT COUNT(*) AS total_users
      FROM users
    `);

    
    const avgCardsPerUser = await numQuery(`
      SELECT ROUND(AVG(COALESCE(cc.card_count, 0)), 2) AS avg_cards_per_user
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS card_count
        FROM cards
        GROUP BY user_id
      ) cc ON cc.user_id = u.id
    `);

    
    const avgSpentPerUser = await numQuery(`
      SELECT 
        ROUND(
            IFNULL(SUM(t.txn_amount) / COUNT(DISTINCT u.id), 0), 
            2
        ) AS avgSpentPerUser_B
      FROM users u
      LEFT JOIN transactions t 
        ON u.id = t.user_id
       AND t.debt_or_credit = 'B'
       AND MONTH(t.txn_datetime) = MONTH(CURDATE())
       AND YEAR(t.txn_datetime) = YEAR(CURDATE());
    `);

    
    const missedUsers = await numQuery(`
      SELECT COUNT(DISTINCT u.id) AS missed_users_count
      FROM cards c
      JOIN users u ON c.user_id = u.id
      WHERE c.remaining_statement_min_amount > 0
        AND CURDATE() > c.statement_due_date
    `);

    
    const totalRewardPoints = await numQuery(`
      SELECT COALESCE(SUM(reward_points),0) AS totalRewardPoints
      FROM transactions
    `);

   
    const highUtilCards = await numQuery(`
   SELECT 
    c.assign_no AS card_no,
    c.credit_limit,
    COALESCE(SUM(t.txn_amount),0) AS total_spent,
    ROUND(COALESCE(SUM(t.txn_amount),0) / NULLIF(c.credit_limit,0) * 100, 2) AS utilization_rate
FROM cards c
LEFT JOIN transactions t
  ON t.assign_no = c.assign_no
GROUP BY c.assign_no, c.credit_limit
ORDER BY utilization_rate DESC;
    `);

    res.json({
      ok: true,
      data: {
        totalSpend,
        totalUsers,
        avgCardsPerUser,
        avgSpentPerUser,
        delinquentUsers: missedUsers,
        totalRewardPoints,
        highUtilCards,
      },
    });
  } catch (e) {
    console.error("[/api/kpis] fatal:", e);
    res.status(500).json({ ok: false, error: "Failed to load KPIs" });
  }
});

export default router;
