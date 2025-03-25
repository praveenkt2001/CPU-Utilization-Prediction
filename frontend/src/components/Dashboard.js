import React, { useState, useEffect } from "react";
import CPUUsageChart from "./CPUUsageChart";
import PredictionResults from "./PredictionResults";
import {
  getHistoricalData,
  getPrediction,
  getThresholdPrediction,
} from "../services/api";

function Dashboard({ currentUsage }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [thresholdPrediction, setThresholdPrediction] = useState(null);
  const [timeRange, setTimeRange] = useState(24);
  const [predictionRange, setPredictionRange] = useState(24);
  const [threshold, setThreshold] = useState(90);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [timeRange, predictionRange, threshold]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [historicalData, predictions, thresholdPrediction] =
        await Promise.all([
          getHistoricalData(timeRange),
          getPrediction(predictionRange),
          getThresholdPrediction(threshold),
        ]);
        

      setHistoricalData(historicalData);
      setPredictions(predictions);
      setThresholdPrediction(thresholdPrediction);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(Number(e.target.value));
  };

  const handlePredictionRangeChange = (e) => {
    setPredictionRange(Number(e.target.value));
  };

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-controls">
        <div className="control-group">
          <label htmlFor="timeRange">Historical Data (hours):</label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
            <option value={72}>72 hours</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="predictionRange">Prediction Range (hours):</label>
          <select
            id="predictionRange"
            value={predictionRange}
            onChange={handlePredictionRangeChange}
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
            <option value={72}>72 hours</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="threshold">Threshold (%):</label>
          <input
            type="number"
            id="threshold"
            min="10"
            max="100"
            value={threshold}
            onChange={handleThresholdChange}
          />
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      <div className="dashboard-charts">
        <CPUUsageChart
          historicalData={historicalData}
          predictions={predictions}
          threshold={threshold}
        />
      </div>

      <PredictionResults
        thresholdPrediction={thresholdPrediction}
        threshold={threshold}
      />
    </div>
  );
}

export default Dashboard;
