
import os
import sys
import joblib

# Find the main project folder
PROJECT_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

# Add the project folder to Python's search path
sys.path.insert(0, PROJECT_DIR)

# Load the saved model
MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "models",
    "spam_classifier.joblib"
)

model = joblib.load(MODEL_PATH)


# Create prediction function
def predict_email(email):

    if not email or not email.strip():
        return "Please enter an email!"

    prediction = model.predict([email])[0]

    if prediction == "spam":
        return "SPAM"
    else:
        return "NOT SPAM"


# Test both spam and legitimate emails
if __name__ == "__main__":

    test_emails = [
        "Congratulations! You won a free prize. Click here!",
        "Hello, our meeting is scheduled for tomorrow at 10 AM. Please bring your project report."
    ]

    for email in test_emails:

        result = predict_email(email)

        print("-----------------------------------")
        print("Email:", email)
        print("Prediction:", result)

    print("-----------------------------------")
    print("Both email tests completed!")
