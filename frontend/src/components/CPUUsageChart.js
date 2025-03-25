import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CPUUsageChart({ historicalData, predictions, threshold }) {
  // Ensure historicalData and predictions are arrays
  const safeHistoricalData = Array.isArray(historicalData) ? historicalData : [];
  const safePredictions = Array.isArray(predictions) ? predictions : [];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const historicalLabels = safeHistoricalData.map((item) =>
    formatTimestamp(item.timestamp)
  );
  const historicalValues = safeHistoricalData.map((item) => item.cpu_percent);

  const predictionLabels = safePredictions.map((item) =>
    formatTimestamp(item.timestamp)
  );
  const predictionValues = safePredictions.map((item) => item.cpu_percent);

  // Create a dataset for the threshold line
  const thresholdData = [...historicalValues, ...predictionValues].map(
    () => threshold
  );

  const data = {
    labels: [...historicalLabels, ...predictionLabels],
    datasets: [
      {
        label: "Historical CPU Usage",
        data: [
          ...historicalValues,
          ...new Array(predictionLabels.length).fill(null),
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Predicted CPU Usage",
        data: [
          ...new Array(historicalLabels.length).fill(null),
          ...predictionValues,
        ],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderDash: [5, 5],
        fill: true,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: `Threshold (${threshold}%)`,
        data: thresholdData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0)",
        borderWidth: 2,
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "CPU Usage Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "CPU Usage (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="chart-container">
      {safeHistoricalData.length > 0 || safePredictions.length > 0 ? (
        <Line data={data} options={options} height={300} />
      ) : (
        <div className="no-data">
          No data available. Start collecting data first.
        </div>
      )}
    </div>
  );
}

export default CPUUsageChart;