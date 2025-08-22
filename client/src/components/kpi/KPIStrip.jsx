import React, { useEffect, useState } from "react";

const money = (v) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(v ?? 0);

const numTR = (v, digits = 2) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number(v ?? 0));

export default function KPIStrip({ refreshMs = null }) {
  const [data, setData] = useState({
    totalSpend: null,
    avgCardsPerUser: null,
    totalUsers: null,
    avgSpentPerUser: null,
    delinquentUsers: null,
    totalRewardPoints: null,
    highUtilCards: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ctrl = new AbortController();
    let timer;

    async function load(signal) {
      try {
        setErr(null);
        setLoading(true);

        const res = await fetch("/api/kpis", { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "KPI error");

        setData({
          totalSpend: Number(json.data.totalSpend ?? 0),
          avgCardsPerUser: Number(json.data.avgCardsPerUser ?? 0),
          totalUsers: Number(json.data.totalUsers ?? 0),
          avgSpentPerUser: Number(json.data.avgSpentPerUser ?? 0),
          delinquentUsers: Number(json.data.delinquentUsers ?? 0),
          totalRewardPoints: Number(json.data.totalRewardPoints ?? 0),
          highUtilCards: Number(json.data.highUtilCards ?? 0),
        });
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load KPIs");
      } finally {
        setLoading(false);
      }
    }

    load(ctrl.signal);

    if (refreshMs) {
      timer = setInterval(() => {
        ctrl.abort();
        ctrl = new AbortController();
        load(ctrl.signal);
      }, refreshMs);
    }

    return () => { if (timer) clearInterval(timer); ctrl.abort(); };
  }, [refreshMs]);

  const items = [
    { icon: "bi-cash-coin",            label: "Total Spent",               value: data.totalSpend == null ? "—" : money(data.totalSpend) },
    { icon: "bi-collection",           label: "Avg Cards per User",        value: data.avgCardsPerUser == null ? "—" : numTR(data.avgCardsPerUser, 2) },
    { icon: "bi-exclamation-triangle", label: "Avg Spent per User (month)",value: data.avgSpentPerUser == null ? "—" : money(data.avgSpentPerUser, 2) },
    { icon: "bi-calendar-x",           label: "Delinquent Users",          value: data.delinquentUsers ?? "—" },
    { icon: "bi-gift",                 label: "Total Reward Points",       value: data.totalRewardPoints ?? "—" },
    { icon: "bi-graph-up-arrow",       label: "Card Utilization %", value: data.highUtilCards ?? "—" },
    { icon: "bi-people",               label: "Total Users",               value: data.totalUsers ?? "—" },
  ];

  return (
    <div className="row g-3 mb-3">
      {items.map((k, i) => (
        <div className="col-sm-6 col-xl-2" key={i}>
          <div className="card p-3">
            <div className="kpi d-flex align-items-center gap-3">
              <i className={`bi ${k.icon}`} />
              <div>
                <div className="text-muted">{k.label}</div>
                <div className="val fw-bold fs-4">
                  {loading ? "Loading…" : err ? "Error" : k.value}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
