
import os
import sys
import joblib

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Locate the main project directory
PROJECT_DIR = Path(__file__).resolve().parent.parent

# Add the original project directory to sys.path BEFORE loading the model,
# so joblib can resolve `src.preprocess.clean_text` (stored inside the
# trained pipeline) when unpickling spam_classifier.joblib.
ORIGINAL_PROJECT_DIR = PROJECT_DIR / "Spam_Email_Classifier"

if str(ORIGINAL_PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(ORIGINAL_PROJECT_DIR))

# Locate the trained machine learning model
MODEL_PATH = (
    PROJECT_DIR
    / "Spam_Email_Classifier"
    / "models"
    / "spam_classifier.joblib"
)

# Load the trained model
model = joblib.load(MODEL_PATH)

# Create FastAPI application
app = FastAPI(
    title="AI Email Spam Detector API",
    description="An API that classifies emails as Spam or Not Spam.",
    version="1.0.0"
)

# Allow React frontend (Vite dev server) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the email request format
class EmailRequest(BaseModel):
    email: str


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "AI Email Spam Detector API is running!"
    }


# Email prediction endpoint
@app.post("/predict")
def predict_email(request: EmailRequest):

    if not request.email.strip():
        return {
            "error": "Please enter an email message."
        }

    prediction = model.predict([request.email])[0]

    if prediction == "spam":
        result = "SPAM"
    else:
        result = "NOT SPAM"

    return {
        "email": request.email,
        "prediction": result
    }
