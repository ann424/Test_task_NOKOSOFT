
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function MccBreakdownChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/mcc")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  const labels = data.map((item) => item.category_name || item.mcc);
  const values = data.map((item) => item.total_spend);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Spend (₺)",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₺${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => `₺${value.toLocaleString()}`,
        },
      },
      y: {
        ticks: {
          autoSkip: false, 
        },
        barPercentage: 0.6, 
        categoryPercentage: 0.7, 
      },
    },
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white text-dark fw-bold border-bottom">
        MCC-Level Spend Breakdown
      </div>
      
      <div className="card-body bg-white" style={{ height: "450px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
