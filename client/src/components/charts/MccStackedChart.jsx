
import { Bar } from "react-chartjs-2";

const MccStackedChart = ({ data = [] }) => {
  const labels = data.map(item => item.category);
  const values = data.map(item => item.total_spend);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Toplam Harcama",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderRadius: 6, 
      },
    ],
  };

  const options = {
    indexAxis: "y", 
    responsive: true,
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
          callback: (value) => `${value.toLocaleString()} ₺`,
        },
        grid: {
          drawBorder: false,
          color: "rgba(0,0,0,0.05)", 
        },
      },
      y: {
        grid: {
          display: false, 
        },
      },
    },
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-header bg-white text-dark fw-bold border-bottom">
        Category-level Spend Breakdown
      </div>
      <div className="card-body bg-white">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MccStackedChart;
