import sqlite3
from datetime import datetime, timedelta

class Database:
    def __init__(self, db_name='cpu_usage.db'):
        self.db_name = db_name

    def get_historical_data(self, hours=24):
        """Get historical CPU usage data for the specified number of hours"""
        cutoff_time = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        # Use context manager to ensure the connection is properly closed
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT timestamp, cpu_percent FROM cpu_usage WHERE timestamp >= ? ORDER BY timestamp',
                (cutoff_time,)
            )
            rows = cursor.fetchall()
            result = []
            for row in rows:
                result.append({
                    'timestamp': row[0],
                    'cpu_percent': row[1]
                })
        return result

    def insert_cpu_data(self, timestamp, cpu_percent):
        """Insert CPU usage data into the database"""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO cpu_usage (timestamp, cpu_percent) VALUES (?, ?)',
                (timestamp, cpu_percent)
            )
            conn.commit()

    def create_tables(self):
        """Create necessary tables if they don't exist"""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cpu_usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    cpu_percent REAL NOT NULL
                )
            ''')
            conn.commit()

    def close(self):
        """Close the database connection (not necessary with context manager, but can be used if manual closing is required)"""
        pass
