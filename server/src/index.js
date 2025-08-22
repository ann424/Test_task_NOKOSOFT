import express from "express";
import cors from "cors";
import kpisRouter from "./api/kpis.js";
import chartsRouter from "./api/charts.js";
import pie from "./api/pie.js";
import barchart from "./api/barchart.js";
import mccBreakdown from "./api/mcc.js";
import tableRouter from "./api/table.js";
import map1Router from "./api/map.js";





const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (_req, res) => res.send("ok"));
app.use("/api/kpis", kpisRouter);
app.use("/api/charts", chartsRouter);
app.use("/api/pie", pie);
app.use("/api/barchart", barchart);
app.use("/api/mcc", mccBreakdown);
app.use("/api/tables", tableRouter);
app.use("/api/map", map1Router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API on http://localhost:${PORT}`);
});
