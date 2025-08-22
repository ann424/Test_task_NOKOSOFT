import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";

export default function DebtTxnPie() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/pie/debt-txns-by-period")
      .then(res => res.json())
      .then(json => {
        if (json.ok) {
          setChartData({
            labels: json.data.labels,
            datasets: [
              {
                data: json.data.values,
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#8E44AD"]
              }
            ]
          });
        }
      })
      .catch(err => console.error("API error:", err));
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="card p-3">
      <h5 className="mb-3">Transactions by Time of Day</h5>
      <div style={{ height: "350px" }}> 
        <Pie
          data={chartData}
          plugins={[ChartDataLabels]}
          options={{
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                position: "top",
                labels: {
                  boxWidth: 15,
                  padding: 15
                }
              },
              datalabels: {
                color: "#000",
                formatter: (value, ctx) => {
                  let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  let percentage = ((value * 100) / sum).toFixed(1) + "%";
                  return percentage;
                },
                anchor: "end",   
                align: "end",   
                offset: 10
              }
            },
            layout: {
              padding: 20 
            }
          }}
        />
      </div>
    </div>
  );
}
