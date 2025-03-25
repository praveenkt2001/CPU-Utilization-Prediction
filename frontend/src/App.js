import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import {
  getCurrentUsage,
  startCollection,
  stopCollection,
  trainModel,
} from "./services/api";
import "./styles/App.css";

function App() {
  const [currentUsage, setCurrentUsage] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);

  useEffect(() => {
    fetchCurrentUsage();

    const interval = setInterval(() => {
      fetchCurrentUsage();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchCurrentUsage = async () => {
    try {
      const data = await getCurrentUsage();
      setCurrentUsage(data);
    } catch (error) {
      console.error("Error fetching current usage:", error);
      toast.error("Failed to fetch current CPU usage");
    }
  };

  const handleStartCollection = async (interval) => {
    setIsLoading(true);
    try {
      await startCollection(interval);
      setIsCollecting(true);
      toast.success("CPU data collection started");
    } catch (error) {
      console.error("Error starting collection:", error);
      toast.error("Failed to start CPU data collection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopCollection = async () => {
    setIsLoading(true);
    try {
      await stopCollection();
      setIsCollecting(false);
      toast.success("CPU data collection stopped");
    } catch (error) {
      console.error("Error stopping collection:", error);
      toast.error("Failed to stop CPU data collection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setIsLoading(true);
    try {
      await trainModel();
      toast.success("Model trained successfully");
    } catch (error) {
      console.error("Error training model:", error);
      toast.error("Failed to train the prediction model");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshIntervalChange = (interval) => {
    setRefreshInterval(interval);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CPU Usage Prediction System</h1>
        {currentUsage && (
          <div className="current-usage">
            <span>Current CPU Usage: </span>
            <span
              className={`usage-value ${
                currentUsage.cpu_percent > 80
                  ? "high"
                  : currentUsage.cpu_percent > 50
                  ? "medium"
                  : "low"
              }`}
            >
              {currentUsage.cpu_percent.toFixed(1)}%
            </span>
          </div>
        )}
      </header>

      <main className="app-content">
        <Dashboard currentUsage={currentUsage} />

        <Settings
          isCollecting={isCollecting}
          isLoading={isLoading}
          onStartCollection={handleStartCollection}
          onStopCollection={handleStopCollection}
          onTrainModel={handleTrainModel}
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={handleRefreshIntervalChange}
        />
      </main>

      <footer className="app-footer">
        <p>CPU Usage Prediction System &copy; 2025</p>
      </footer>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
