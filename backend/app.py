from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import json
from predictor import CPUPredictor
from data_collector import CPUDataCollector
from database import Database

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


db = Database()
collector = CPUDataCollector(db)
predictor = CPUPredictor(db)

@app.route('/api/current-usage', methods=['GET'])
def get_current_usage():
    """Get current CPU usage"""
    usage = collector.get_current_usage()
    return jsonify(usage)

@app.route('/api/historical-data', methods=['GET'])
def get_historical_data():
    """Get historical CPU usage data"""
    hours = request.args.get('hours', default=24, type=int)
    data = db.get_historical_data(hours)
    return jsonify(data)

@app.route('/api/predict', methods=['GET'])
def predict_usage():
    """Predict future CPU usage"""
    hours = request.args.get('hours', default=24, type=int)
    prediction = predictor.predict_future_usage(hours)
    return jsonify(prediction)

@app.route('/api/threshold-prediction', methods=['GET'])
def predict_threshold():
    """Predict when CPU will reach 90% threshold"""
    threshold = request.args.get('threshold', default=90, type=int)
    prediction = predictor.predict_threshold_crossing(threshold)
    return jsonify(prediction)

@app.route('/api/start-collection', methods=['POST'])
def start_collection():
    """Start collecting CPU usage data"""
    interval = request.json.get('interval', 60)  
    collector.start_collection(interval)
    return jsonify({"status": "Collection started"})

@app.route('/api/stop-collection', methods=['POST'])
def stop_collection():
    """Stop collecting CPU usage data"""
    collector.stop_collection()
    return jsonify({"status": "Collection stopped"})

@app.route('/api/train-model', methods=['POST'])
def train_model():
    """Train the prediction model"""
    predictor.train_model()
    return jsonify({"status": "Model trained successfully"})

if __name__ == '__main__':

    db.create_tables()
    app.run(debug=True, port=5000)