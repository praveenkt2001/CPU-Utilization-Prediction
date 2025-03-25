import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Configure axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCurrentUsage = async () => {
  try {
    const response = await apiClient.get("/current-usage");
    return response.data;
  } catch (error) {
    console.error("Error getting current usage:", error);
    throw error;
  }
};

export const getHistoricalData = async (hours = 24) => {
  try {
    const response = await apiClient.get("/historical-data", {
      params: { hours },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting historical data:", error);
    throw error;
  }
};

export const getPrediction = async (hours = 24) => {
  try {
    const response = await apiClient.get("/predict", {
      params: { hours },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting prediction:", error);
    throw error;
  }
};

export const getThresholdPrediction = async (threshold = 90) => {
  try {
    const response = await apiClient.get("/threshold-prediction", {
      params: { threshold },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting threshold prediction:", error);
    throw error;
  }
};

export const startCollection = async (interval = 60) => {
  try {
    const response = await apiClient.post("/start-collection", { interval });
    return response.data;
  } catch (error) {
    console.error("Error starting collection:", error);
    throw error;
  }
};

export const stopCollection = async () => {
  try {
    const response = await apiClient.post("/stop-collection");
    return response.data;
  } catch (error) {
    console.error("Error stopping collection:", error);
    throw error;
  }
};

export const trainModel = async () => {
  try {
    const response = await apiClient.post("/train-model");
    return response.data;
  } catch (error) {
    console.error("Error training model:", error);
    throw error;
  }
};
