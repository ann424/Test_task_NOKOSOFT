
import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/users-by-city", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          CASE 
            WHEN city IN ('Lefkoşa','Nicosia','Lefkosia') THEN 'Lefkoşa'
            WHEN city IN ('Gazimağusa','Magusa','Famagusta') THEN 'Gazimağusa'
            WHEN city IN ('Girne','Kyrenia') THEN 'Girne'
            WHEN city IN ('Güzelyurt','Morphou') THEN 'Güzelyurt'
            WHEN city IN ('İskele','Trikomo') THEN 'İskele'
            WHEN city IN ('Lefke','Lefka') THEN 'Lefke'
            ELSE city
          END AS city,
          COUNT(*) AS user_count
        FROM users
        WHERE city IS NOT NULL AND city <> ''
        GROUP BY city
        ORDER BY user_count DESC
      `);
  
   
      const coords = {
        "Lefkoşa": [35.1856, 33.3823],
        "Gazimağusa": [35.1167, 33.95],
        "Girne": [35.3419, 33.3178],
        "Güzelyurt": [35.2008, 32.9917],
        "İskele": [35.287, 33.891],
        "Lefke": [35.1103, 32.85]
      };
  
      const data = rows
        .filter(r => coords[r.city])
        .map(r => ({
          city: r.city,
          user_count: r.user_count,
          lat: coords[r.city][0],
          lng: coords[r.city][1]
        }));
  
      res.json({ ok: true, data });
    } catch (err) {
      console.error("Users by city API error:", err);
      res.status(500).json({ ok: false, error: "Server error" });
    }
  });

export default router;
