
import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import KPIStrip from "../components/kpi/KPIStrip";
import MonthlySpendChart from "../components/charts/MonthlySpendChart";
import MccStackedChart from "../components/charts/MccStackedChart";
import DelinquencyTable from "../components/tables/DelinquencyTable";
import PieChart from "../components/charts/PieChart";
import MccCategory2 from "../components/charts/MccCategory2";
import UsersByCityMap from "../components/charts/UsersByCityMap";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/charts")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setData(json.data); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/barchart")
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
        setCategoryLoading(false);
      })
      .catch((err) => {
        console.error("API error (barchart):", err);
        setCategoryLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid py-4">
     
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <h2 className="mb-2">Banking Statistics</h2>
      </div>

    
      <KPIStrip refreshMs={15000} />

      {/* Row A */}
      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          {loading ? (
            <p>Loading...</p>
          ) : data && data.labels ? (
            <MonthlySpendChart data={data} />
          ) : (
            <p>No data available</p>
          )}
        </div>
        <div className="col-lg-4">
          <PieChart />
        </div>
      </div>

      {/* Row B */}
      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          {categoryLoading ? (
            <p>Loading category data...</p>
          ) : categoryData && categoryData.length > 0 ? (
            <MccStackedChart data={categoryData} />
          ) : (
            <p>No category data available</p>
          )}
        </div>
        <div className="col-lg-5">
          <MccCategory2 />
        </div>
      </div>

      {/* Row C */}
      <DelinquencyTable />

      {/* Row D */}
      <div className="row g-3">
        <div className="col-lg-6">
          <UsersByCityMap />
        </div>
      </div>
    </div>
  );
}
