import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function MonthlySpendChart({ data }) {
  if (!data || !data.labels) {
    return <p>No data available</p>;
  }

  
  const chartData = data.labels.map((label, i) => ({
    month: label,
    credit: data.series.B[i], 
    debit: data.series.A[i]   
  }));

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <h5 style={{ marginBottom: "20px" }}>Monthly Spent</h5>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
         
          <XAxis dataKey="month" />

         
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(val) => `₺${val.toLocaleString("tr-TR")}`}
          />

         
          <Tooltip
            formatter={(value) => `₺${value.toLocaleString("tr-TR")}`}
            labelFormatter={(label, items) => {
              const credit = items.find((i) => i.dataKey === "credit")?.value || 0;
              const debit = items.find((i) => i.dataKey === "debit")?.value || 0;
              const toplam = credit + debit;
              return `${label} 2025: Credit ₺${credit.toLocaleString(
                "tr-TR"
              )} • Debit ₺${debit.toLocaleString("tr-TR")} • Total ₺${toplam.toLocaleString("tr-TR")}`;
            }}
          />

         
          <Legend
            payload={[
              { value: "Credit Card (B)", type: "line", color: "blue" },
              { value: "Debit Card (A)", type: "line", color: "red" }
            ]}
          />

         
          <Line type="monotone" dataKey="credit" stroke="blue" dot />
          <Line type="monotone" dataKey="debit" stroke="red" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
