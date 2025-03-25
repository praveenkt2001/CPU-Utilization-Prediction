import psutil
import time
import threading
import pandas as pd
from datetime import datetime

class CPUDataCollector:
    def __init__(self, db):
        self.db = db
        self.collection_active = False
        self.collection_thread = None
        self.collection_interval = 60  # Default collection interval in seconds

    def get_current_usage(self):
        """Get current CPU usage percentage"""
        cpu_percent = psutil.cpu_percent(interval=1)
        timestamp = datetime.now().isoformat()
        
        # Save to database
        self.db.insert_cpu_data(timestamp, cpu_percent)
        
        return {
            "timestamp": timestamp,
            "cpu_percent": cpu_percent
        }

    def collect_data(self):
        """Continuously collect CPU usage data at specified intervals"""
        while self.collection_active:
            self.get_current_usage()
            time.sleep(self.collection_interval)

    def start_collection(self, interval=60):
        """Start collecting CPU usage data"""
        if self.collection_thread and self.collection_thread.is_alive():
            return False
        
        self.collection_interval = interval
        self.collection_active = True
        self.collection_thread = threading.Thread(target=self.collect_data)
        self.collection_thread.daemon = True
        self.collection_thread.start()
        return True

    def stop_collection(self):
        """Stop collecting CPU usage data"""
        self.collection_active = False
        if self.collection_thread:
            self.collection_thread.join(timeout=1)
        return True