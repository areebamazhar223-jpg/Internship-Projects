
import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import ComplementNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from src.preprocess import clean_text

# STEP 1: Load the dataset
print("Loading dataset...")

df = pd.read_csv("dataset/spam.csv")

# STEP 2: Clean the dataset
df = df.dropna(subset=["text", "label"])
df = df.drop_duplicates(subset=["text"])

print("Dataset loaded successfully!")
print("Total emails:", len(df))
print(df["label"].value_counts())

# STEP 3: Separate emails and labels
X = df["text"]
y = df["label"]

# STEP 4: Split data into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining emails:", len(X_train))
print("Testing emails:", len(X_test))

# STEP 5: Create the machine learning pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            preprocessor=clean_text,
            stop_words="english",
            ngram_range=(1, 2),
            min_df=2,
            max_features=50000
        )
    ),
    ("classifier", ComplementNB())
])

# STEP 6: Train the model
print("\nTraining the model...")

model.fit(X_train, y_train)

print("Model training completed!")

# STEP 7: Make predictions
y_pred = model.predict(X_test)

# STEP 8: Evaluate the model
print("\nMODEL EVALUATION")
print("---------------------------")

print("\nModel Accuracy:")
print(accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# STEP 9: Save the trained model
os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/spam_classifier.joblib")

print("\nModel saved successfully!")
