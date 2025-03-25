import React from "react";

function PredictionResults({ thresholdPrediction, threshold }) {
  // Check if thresholdPrediction exists
  if (!thresholdPrediction) {
    return (
      <div className="prediction-results">No prediction data available.</div>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      console.error("Invalid timestamp:", timestamp);
      return "N/A";
    }
  };

  // Safely access properties with fallbacks
  const willReachThreshold = thresholdPrediction.will_reach_threshold || false;
  const timestamp = thresholdPrediction.timestamp;
  const hoursFromNow = thresholdPrediction.hours_from_now || "N/A";
  const cpuPercent = thresholdPrediction.cpu_percent;
  const maxPredictedValue = thresholdPrediction.max_predicted_value;
  const maxPredictedTimestamp = thresholdPrediction.max_predicted_timestamp;

  return (
    <div className="prediction-results">
      <h2>Threshold Prediction Results</h2>

      {willReachThreshold ? (
        <div className="alert alert-warning">
          <h3>Warning: CPU Usage Will Reach {threshold}% Threshold</h3>
          <p>
            <strong>Estimated Time:</strong> {formatTimestamp(timestamp)}
          </p>
          <p>
            <strong>Hours From Now:</strong> {hoursFromNow}{" "}
            {hoursFromNow !== "N/A" ? "hours" : ""}
          </p>
          <p>
            <strong>Predicted CPU Usage:</strong>{" "}
            {cpuPercent !== undefined && cpuPercent !== null
              ? cpuPercent.toFixed(1) + "%"
              : "N/A"}
          </p>
        </div>
      ) : (
        <div className="alert alert-success">
          <h3>
            CPU Usage Won't Reach {threshold}% Threshold (within the prediction
            window)
          </h3>
          <p>
            <strong>Max Predicted Value:</strong>{" "}
            {maxPredictedValue !== undefined && maxPredictedValue !== null
              ? maxPredictedValue.toFixed(1) + "%"
              : "N/A"}
          </p>
          <p>
            <strong>Max Predicted Time:</strong>{" "}
            {formatTimestamp(maxPredictedTimestamp)}
          </p>
        </div>
      )}
    </div>
  );
}

export default PredictionResults;