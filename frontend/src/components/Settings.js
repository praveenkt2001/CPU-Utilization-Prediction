import React, { useState } from "react";

function Settings({
  isCollecting,
  isLoading,
  onStartCollection,
  onStopCollection,
  onTrainModel,
  refreshInterval,
  onRefreshIntervalChange,
}) {
  const [collectionInterval, setCollectionInterval] = useState(60);

  const handleStartCollection = () => {
    onStartCollection(collectionInterval);
  };

  const handleCollectionIntervalChange = (e) => {
    setCollectionInterval(Number(e.target.value));
  };

  const handleRefreshIntervalChange = (e) => {
    onRefreshIntervalChange(Number(e.target.value));
  };

  return (
    <div className="settings">
      <h2>System Settings</h2>

      <div className="settings-section">
        <h3>Data Collection</h3>

        <div className="settings-controls">
          <div className="setting-item">
            <label htmlFor="collectionInterval">
              Collection Interval (seconds):
            </label>
            <input
              type="number"
              id="collectionInterval"
              min="10"
              max="3600"
              value={collectionInterval}
              onChange={handleCollectionIntervalChange}
              disabled={isCollecting || isLoading}
            />
          </div>

          <div className="setting-item">
            <button
              className={`collection-button ${isCollecting ? "stop" : "start"}`}
              onClick={isCollecting ? onStopCollection : handleStartCollection}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isCollecting
                ? "Stop Collection"
                : "Start Collection"}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Prediction Model</h3>

        <div className="settings-controls">
          <button
            className="train-button"
            onClick={onTrainModel}
            disabled={isLoading}
          >
            {isLoading ? "Training..." : "Train Model"}
          </button>
          <p className="settings-note">
            Note: Training requires at least 48 data points.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Display Settings</h3>

        <div className="settings-controls">
          <div className="setting-item">
            <label htmlFor="refreshInterval">
              Dashboard Refresh Interval (seconds):
            </label>
            <select
              id="refreshInterval"
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
