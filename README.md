# 🧠 CPU Utilization Prediction

A full-stack web application that monitors CPU usage in real-time, predicts future utilization using a **Random Forest** machine learning model, and displays insights through interactive charts and dashboards.

Built with **React** (frontend) and **Flask** (backend), this project showcases system data collection, prediction modeling, and a responsive UI.

---

## 📸 Screenshot

![App Screenshot](./output%20screenshot.png)

---

## 🚀 Features

- 📊 Real-time CPU usage tracking
- 🔮 Future CPU utilization prediction using **Random Forest**
- 🧠 Pretrained ML model saved with `joblib`
- 🖥️ Interactive dashboard built with React
- 💾 Data stored locally using SQLite
- 🔌 REST API to connect frontend and backend

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6)
- CSS Modules
- Axios

### Backend
- Python 3
- Flask
- scikit-learn (Random Forest)
- SQLite
- joblib

---

## 📁 Project Structure

final-project/ ├── backend/ │ ├── app.py # Flask API entry point │ ├── data_collector.py # CPU usage collection │ ├── predictor.py # Random Forest prediction logic │ ├── cpu_usage.db # SQLite database │ ├── *.joblib # Saved model and scaler │ └── requirements.txt ├── frontend/ │ ├── public/ │ └── src/ │ ├── components/ │ └── App.js, index.js, etc. ├── output screenshot.png └── README.md

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 🔧 Backend (Flask API)

1. Navigate to backend:
   ```bash
   cd backend
Create and activate a virtual environment:

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Run the Flask server:

bash
Copy
Edit
python app.py
Server will be live at http://localhost:5000

💻 Frontend (React App)
Navigate to frontend:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Run the React app:

bash
Copy
Edit
npm start
React app will run on http://localhost:3000

📈 Machine Learning Model
Trained offline using Random Forest Regressor

Model and scaler saved as .joblib files

Input: recent CPU usage history

Output: predicted CPU usage

Prediction handled in predictor.py

📮 API Endpoints
Endpoint	Method	Description
/cpu	GET	Fetch real-time CPU usage
/predict	POST	Predict future CPU utilization
/settings	GET/POST	Retrieve or update settings (optional)
📋 To-Do (Future Improvements)
 Add memory & disk usage tracking

 Improve prediction accuracy

 Add Docker support

 Deploy backend (Render) & frontend (Vercel/Netlify)

 CI/CD with GitHub Actions

🧑‍💻 Author
Praveen Kumar Thabjul
GitHub: @praveenkt2001
