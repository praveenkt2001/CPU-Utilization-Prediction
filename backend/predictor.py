import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import joblib
import os

class CPUPredictor:
    def __init__(self, db):
        self.db = db
        self.model = None
        self.scaler = StandardScaler()
        self.model_file = 'cpu_prediction_model.joblib'
        self.scaler_file = 'cpu_scaler.joblib'
        self.load_model()

    def load_model(self):
        """Load the prediction model if it exists"""
        try:
            if os.path.exists(self.model_file) and os.path.exists(self.scaler_file):
                self.model = joblib.load(self.model_file)
                self.scaler = joblib.load(self.scaler_file)
                return True
        except Exception as e:
            print(f"Error loading model: {e}")
        return False

    def save_model(self):
        """Save the prediction model"""
        if self.model:
            joblib.dump(self.model, self.model_file)
            joblib.dump(self.scaler, self.scaler_file)
            return True
        return False

    def prepare_features(self, data):
        """Prepare features for the model"""
        df = pd.DataFrame(data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Extract time features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
        
        # Create lagged features
        for lag in [1, 3, 6, 12, 24]:
            df[f'lag_{lag}'] = df['cpu_percent'].shift(lag)
        
        # Create rolling averages
        for window in [3, 6, 12, 24]:
            df[f'rolling_{window}'] = df['cpu_percent'].rolling(window=window).mean()
        
        # Drop NaN values
        df = df.dropna()
        
        # Select features and target
        features = ['hour', 'day_of_week', 'is_weekend'] + \
                   [f'lag_{lag}' for lag in [1, 3, 6, 12, 24]] + \
                   [f'rolling_{window}' for window in [3, 6, 12, 24]]
        
        X = df[features]
        y = df['cpu_percent']
        
        return X, y, df

    def train_model(self):
        """Train the prediction model"""
        # Get historical data
        data = self.db.get_historical_data(hours=168)  # Get up to 7 days of data
        
        if len(data) < 48:  # Need at least 48 data points
            return False
        
        X, y, _ = self.prepare_features(data)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
        
        # Save model
        self.save_model()
        return True

    def predict_future_usage(self, hours=24):
        """Predict future CPU usage"""
        if not self.model:
            return {"error": "Model not trained"}
        
        # Get recent data
        recent_data = self.db.get_historical_data(hours=48)
        
        if len(recent_data) < 24:
            return {"error": "Not enough historical data"}
        
        # Prepare the base dataframe
        df = pd.DataFrame(recent_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Generate future timestamps
        last_timestamp = df['timestamp'].max()
        future_timestamps = [last_timestamp + timedelta(hours=i+1) for i in range(hours)]
        
        # Make predictions one by one
        predictions = []
        
        for future_ts in future_timestamps:
            # Create a copy of the dataframe
            temp_df = df.copy()
            
            # Prepare features
            X, _, _ = self.prepare_features(temp_df.to_dict('records'))
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            pred = self.model.predict(X_scaled[-1].reshape(1, -1))[0]
            
            # Add prediction to dataframe
            new_row = pd.DataFrame({
                'timestamp': [future_ts],
                'cpu_percent': [pred]
            })
            df = pd.concat([df, new_row], ignore_index=True)
            
            predictions.append({
                'timestamp': future_ts.isoformat(),
                'cpu_percent': float(pred)
            })
        
        return predictions

    def predict_threshold_crossing(self, threshold=90):
        """Predict when CPU usage will reach the threshold"""
        predictions = self.predict_future_usage(hours=168)  # Predict up to 7 days ahead
        
        if isinstance(predictions, dict) and 'error' in predictions:
            return predictions
        
        # Check if any prediction crosses the threshold
        for i, pred in enumerate(predictions):
            if pred['cpu_percent'] >= threshold:
                return {
                    'will_reach_threshold': True,
                    'timestamp': pred['timestamp'],
                    'hours_from_now': i + 1,
                    'cpu_percent': pred['cpu_percent']
                }
        
        return {
            'will_reach_threshold': False,
            'max_predicted_value': max([p['cpu_percent'] for p in predictions]),
            'max_predicted_timestamp': predictions[np.argmax([p['cpu_percent'] for p in predictions])]['timestamp']
        }