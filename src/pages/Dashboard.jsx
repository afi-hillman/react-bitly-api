import React, { useContext, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import useGetAllLinks from "../utils/hooks/UseGetAllLinks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const Dashboard = () => {
  const { fetchDataState, data } = useGetAllLinks();
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Visit Counts per Link",
      },
    },
  };

  const labels = data.map((element) => element.slug);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Visit Counts",
        data: data.map((element) => element.visit_counts),
        borderColor: "orange",
        backgroundColor: "orange",
      },
    ],
  };
  return (
    <DashboardLayout>
      <div className="overflow-y-auto bg-gray-100 h-screen">
        <Bar options={options} data={chartData} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
