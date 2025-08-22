import React, { useEffect, useState } from "react";

export default function DelinquencyTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const money = (v) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(v ?? 0);

  useEffect(() => {
    let ctrl = new AbortController();
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const r = await fetch(`${BASE}/api/tables/delinquency`, {
          signal: ctrl.signal,
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || "Table error");
        setRows(j.data || []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  return (
    <div className="card p-3 mb-3">
      <div className="d-flex justify-content-between">
        <h6>Delinquency Detection</h6>
        <div className="text-muted">
          {loading ? "Loading…" : err ? "Error" : null}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Due Date</th>
              <th>Statement Date</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Overdue (days)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const badge =
                r.status === "Missed"
                  ? "danger"
                  : r.status === "Partial"
                  ? "warning"
                  : r.status === "Paid"
                  ? "success"
                  : "secondary";

              return (
                <tr key={i}>
                  <td>{r.user}</td>
                  <td>{r.due}</td>
                  <td>{r.statement_date}</td>
                  <td>{money(r.remaining)}</td>
                  <td>
                    <span className={`badge bg-${badge} badge-status`}>
                      {r.status}
                    </span>
                  </td>
                  <td>{r.overdue}</td>
                </tr>
              );
            })}
            {!loading && !err && rows.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No delinquent accounts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
