# AI Email Spam Classifier

## 1. Project Overview

The **AI Email Spam Classifier** is a machine learning project that automatically classifies email messages into two categories:

- **Spam:** Unwanted, suspicious, or promotional email messages.
- **Not Spam (Ham):** Legitimate and useful email messages.

This project uses Natural Language Processing (NLP) and machine learning techniques to analyze email content and predict whether an email is spam or legitimate.

The main objective of this project is to build an intelligent email classification system that helps users identify unwanted emails.

## 2. Project Features

- Automatically detects spam and legitimate emails.
- Uses Natural Language Processing (NLP) for text preprocessing.
- Extracts text features using TF-IDF.
- Uses the Complement Naive Bayes classification algorithm.
- Provides an interactive web interface using Streamlit.
- Displays clear prediction results.
- Allows users to enter or paste email messages.
- Saves the trained machine learning model for future predictions.

## 3. Technologies Used

The following technologies and libraries are used:

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| Pandas | Dataset loading and data processing |
| Scikit-learn | Machine learning and model evaluation |
| TF-IDF | Text feature extraction |
| Complement Naive Bayes | Email classification |
| Streamlit | Web application development |
| Joblib | Saving and loading the trained model |

## 4. Project Structure

```text
Spam_Email_Classifier/
│
├── dataset/
│   └── spam.csv
│
├── models/
│   ├── spam_classifier.joblib
│   └── .gitkeep
│
├── src/
│   ├── preprocess.py
│   ├── predict.py
│   └── download_dataset.py
│
├── app.py
├── train.py
├── requirements.txt
└── README.md
```

## 5. Dataset Information

This project uses the **Apache SpamAssassin Public Corpus**.

The dataset contains email messages belonging to two categories:

- Ham (Not Spam)
- Spam

### Dataset Statistics

| Description | Count |
|---|---:|
| Original email records | 3,002 |
| Spam emails (original) | 501 |
| Ham emails (original) | 2,501 |
| Usable records after cleaning | 2,959 |

The dataset was cleaned by handling missing values and removing duplicate records.

## 6. Machine Learning Model

The project uses the **Complement Naive Bayes** algorithm for email classification.

### Text Preprocessing

The email messages are cleaned before feature extraction.

### Feature Extraction

TF-IDF (Term Frequency–Inverse Document Frequency) converts email text into numerical features that the machine learning model can understand.

The model uses:

- English stop-word removal
- Unigrams and bigrams
- Maximum 50,000 features

### Model Training

The dataset is divided into:

- 80% Training Data
- 20% Testing Data

The trained model is evaluated using accuracy, precision, recall, F1-score, and a confusion matrix.

## 7. Model Performance

The trained Complement Naive Bayes model achieved the following results on the test dataset:

**Accuracy: 96.11%**

### Classification Results

| Class | Precision | Recall | F1-Score |
|---|---:|---:|---:|
| Ham | 0.96 | 1.00 | 0.98 |
| Spam | 1.00 | 0.76 | 0.87 |

The model correctly classified most emails. However, some spam emails were still classified as legitimate, so the model can be improved further.

## 8. Installation Instructions

### Step 1: Clone or Download the Project

Download or clone this repository to your computer.

### Step 2: Open the Project Folder

Open the project folder in Visual Studio Code.

### Step 3: Create a Virtual Environment

```bash
python -m venv .venv
```

### Step 4: Activate the Virtual Environment

For Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 5: Install Required Libraries

```bash
pip install -r requirements.txt
```

## 9. How to Run the Application

Run the following command in the project directory:

```bash
python -m streamlit run app.py
```

After running the command, Streamlit will provide a local URL.

Open that URL in your web browser to access the application.

## 10. How to Use the Application

1. Open the Spam Email Classifier web application.
2. Enter or paste an email message into the text area.
3. Click the **Check Email** button.
4. The application analyzes the email using the trained machine learning model.
5. View the prediction result.

The application displays:

- **SPAM** when the email is classified as spam.
- **NOT SPAM** when the email is classified as legitimate.

## 11. Future Improvements

Possible future improvements include:

- Improving spam detection recall.
- Training with a larger and more diverse dataset.
- Adding email subject-line analysis.
- Improving text preprocessing.
- Adding more machine learning algorithms for comparison.
- Deploying the application online.

## 12. Conclusion

The AI Email Spam Classifier demonstrates how Natural Language Processing and machine learning can be used to classify email messages automatically.

The project combines Python, TF-IDF, Complement Naive Bayes, and Streamlit to create a working email classification web application.

It achieved approximately 96.11% test accuracy and provides an interactive interface for testing email messages.

---

**Project Name:** AI Email Spam Classifier

**Project Type:** Machine Learning / Natural Language Processing

**Purpose:** Internship Project