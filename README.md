Folder Structure
Frontend — React App
Backend — FastAPI Backend

Backend Setup
cd backend
python -m venv venv
source venv/bin/activate or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
Runs on: http://localhost:8000

Frontend Setup
cd frontend
npm install
npm start
Runs on: http://localhost:3000
