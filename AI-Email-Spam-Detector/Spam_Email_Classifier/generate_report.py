from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

def add_heading(text, level=1):
    heading = doc.add_heading(text, level=level)
    for run in heading.runs:
        run.font.color.rgb = RGBColor(0x1F, 0x3B, 0x5C)
    return heading

def add_body(text, bold=False, italic=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    return p

title = doc.add_heading('AI Email Spam Classifier', level=0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
sub_run = sub.add_run('Internship Project Report — Step 10: Final Project Review and Submission Preparation')
sub_run.italic = True
sub_run.font.size = Pt(14)

doc.add_paragraph()

info_table = doc.add_table(rows=4, cols=2)
info_table.style = 'Light Grid Accent 1'
info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
info_data = [
    ("Project Name", "AI Email Spam Classifier"),
    ("Project Type", "Machine Learning / Natural Language Processing"),
    ("Purpose", "Internship Project"),
    ("Primary Algorithm", "Complement Naive Bayes with TF-IDF"),
]
for i, (k, v) in enumerate(info_data):
    info_table.rows[i].cells[0].text = k
    info_table.rows[i].cells[1].text = v

doc.add_page_break()

# ================= 1. INTRODUCTION =================
add_heading('1. Introduction', 1)
add_body('Email spam is a persistent problem for individuals and organizations worldwide. Unsolicited, unwanted, '
         'and potentially malicious email messages clutter inboxes, waste time, and can pose security risks through '
         'phishing links and malware attachments. The AI Email Spam Classifier is a machine learning project designed '
         'to automatically detect and classify email messages as either spam or legitimate (not spam), helping users '
         'maintain cleaner and safer inboxes.')

add_body('This project combines Natural Language Processing (NLP) techniques with a supervised machine learning '
         'algorithm to build an intelligent email classification system. The system provides an interactive web '
         'interface built with Streamlit, allowing users to paste email messages and receive instant classification '
         'results.')

# ================= 2. PROBLEM STATEMENT =================
add_heading('2. Problem Statement', 1)
add_body('With the increasing volume of email communication, manual identification of spam emails is impractical. '
         'Users spend significant time sorting through unwanted messages, and important legitimate emails may be '
         'overlooked. Existing spam filters vary in effectiveness, and many users lack access to advanced filtering '
         'tools. There is a need for an accessible, accurate, and easy-to-use email spam classification solution '
         'that can be deployed locally or integrated into email workflows.')

# ================= 3. PROJECT OBJECTIVES =================
add_heading('3. Project Objectives', 1)
objectives = [
    'Build a machine learning model to classify emails as spam or not spam.',
    'Use Natural Language Processing (NLP) for text preprocessing and cleaning.',
    'Extract meaningful text features using TF-IDF vectorization.',
    'Train and evaluate a Complement Naive Bayes classifier.',
    'Develop an interactive Streamlit web application for real-time email classification.',
    'Achieve high classification accuracy on the test dataset.',
    'Provide clear documentation and a professional project submission package.',
]
for i, obj in enumerate(objectives, 1):
    p = doc.add_paragraph(style='List Number')
    p.add_run(obj)

# ================= 4. TECHNOLOGIES USED =================
add_heading('4. Technologies Used', 1)
add_body('The following technologies and libraries were used in this project:')
tech_table = doc.add_table(rows=1, cols=2)
tech_table.style = 'Light Grid Accent 1'
tech_table.rows[0].cells[0].text = 'Technology'
tech_table.rows[0].cells[1].text = 'Purpose'
tech_data = [
    ('Python', 'Main programming language'),
    ('Pandas', 'Dataset loading and data processing'),
    ('Scikit-learn', 'Machine learning, model training, and evaluation'),
    ('TF-IDF', 'Text feature extraction from email content'),
    ('Complement Naive Bayes', 'Email classification algorithm'),
    ('Streamlit', 'Web application development'),
    ('Joblib', 'Saving and loading the trained model'),
]
for tech, purpose in tech_data:
    row = tech_table.add_row()
    row.cells[0].text = tech
    row.cells[1].text = purpose

# ================= 5. DATASET DESCRIPTION =================
add_heading('5. Dataset Description', 1)
add_body('The project uses the Apache SpamAssassin Public Corpus, a publicly available dataset of email messages '
         'labeled as either spam or ham (legitimate). The dataset contains real email messages collected for spam '
         'research purposes.')

add_body('Dataset Statistics:')
dataset_table = doc.add_table(rows=1, cols=2)
dataset_table.style = 'Light Grid Accent 1'
dataset_table.rows[0].cells[0].text = 'Description'
dataset_table.rows[0].cells[1].text = 'Count'
dataset_stats = [
    ('Original email records', '3,002'),
    ('Spam emails (original)', '501'),
    ('Ham emails (original)', '2,501'),
    ('Usable records after cleaning', '2,959'),
    ('Training set (80%)', '~2,367 emails'),
    ('Testing set (20%)', '~592 emails'),
]
for desc, count in dataset_stats:
    row = dataset_table.add_row()
    row.cells[0].text = desc
    row.cells[1].text = count

add_body('The dataset was cleaned by handling missing values and removing duplicate records before training.')

# ================= 6. DATA PREPROCESSING =================
add_heading('6. Data Preprocessing', 1)
add_body('Before feature extraction, email text messages undergo the following preprocessing steps using the '
         'clean_text function in src/preprocess.py:')
preprocess_steps = [
    'Convert all text to lowercase for case-insensitive processing.',
    'Decode HTML character entities (e.g., &amp; to &).',
    'Remove HTML tags from email content.',
    'Remove URLs and web links.',
    'Remove email addresses.',
    'Keep only letters and spaces (remove numbers and special characters).',
    'Remove extra whitespace and trim leading/trailing spaces.',
]
for i, step in enumerate(preprocess_steps, 1):
    p = doc.add_paragraph(style='List Number')
    p.add_run(step)

# ================= 7. FEATURE EXTRACTION USING TF-IDF =================
add_heading('7. Feature Extraction Using TF-IDF', 1)
add_body('TF-IDF (Term Frequency–Inverse Document Frequency) converts preprocessed email text into numerical '
         'feature vectors that the machine learning model can process. The TF-IDF vectorizer is configured with:')
tfidf_config = [
    'English stop-word removal (removes common words like "the", "is", "at").',
    'Unigrams and bigrams (ngram_range=(1, 2)) to capture word pairs.',
    'Minimum document frequency of 2 (min_df=2) to ignore rare terms.',
    'Maximum of 50,000 features (max_features=50000) to control dimensionality.',
]
for item in tfidf_config:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(item)

# ================= 8. MACHINE LEARNING ALGORITHM =================
add_heading('8. Machine Learning Algorithm: Complement Naive Bayes', 1)
add_body('The project uses the Complement Naive Bayes (ComplementNB) algorithm for email classification. '
         'Complement Naive Bayes is a variant of the standard Naive Bayes algorithm that is particularly effective '
         'for imbalanced text classification datasets. It works by computing weights from the complement of each '
         'class (i.e., all documents not in the class), which helps address the imbalance between spam and ham '
         'emails in the dataset.')

add_body('The algorithm is implemented using scikit-learn\'s ComplementNB class within a scikit-learn Pipeline, '
         'which combines TF-IDF vectorization and classification into a single model object.')

# ================= 9. MODEL TRAINING PROCESS =================
add_heading('9. Model Training Process', 1)
add_body('The model training process follows these steps:')
training_steps = [
    'Load the spam.csv dataset using Pandas.',
    'Clean the dataset by removing missing values and duplicate records.',
    'Separate email text (features) and labels (spam/ham).',
    'Split the data into 80% training and 20% testing sets with stratified sampling.',
    'Create a scikit-learn Pipeline with TF-IDF vectorizer and ComplementNB classifier.',
    'Train the model on the training dataset.',
    'Evaluate the model on the held-out test dataset.',
    'Save the trained model using Joblib to models/spam_classifier.joblib.',
]
for i, step in enumerate(training_steps, 1):
    p = doc.add_paragraph(style='List Number')
    p.add_run(step)

# ================= 10. MODEL EVALUATION AND RESULTS =================
add_heading('10. Model Evaluation and Results', 1)
add_body('The trained model was evaluated on a test set of 592 emails (495 ham, 97 spam). The results are:')

eval_table = doc.add_table(rows=1, cols=2)
eval_table.style = 'Light Grid Accent 1'
eval_table.rows[0].cells[0].text = 'Metric'
eval_table.rows[0].cells[1].text = 'Value'
eval_metrics = [
    ('Accuracy', '96.11%'),
    ('Test set size', '592 emails'),
]
for metric, value in eval_metrics:
    row = eval_table.add_row()
    row.cells[0].text = metric
    row.cells[1].text = value

doc.add_paragraph()

add_body('Classification Report:')
class_table = doc.add_table(rows=1, cols=5)
class_table.style = 'Light Grid Accent 1'
hdr = class_table.rows[0].cells
hdr[0].text = 'Class'
hdr[1].text = 'Precision'
hdr[2].text = 'Recall'
hdr[3].text = 'F1-Score'
hdr[4].text = 'Support'
class_data = [
    ('Ham (Not Spam)', '0.96', '1.00', '0.98', '495'),
    ('Spam', '1.00', '0.76', '0.87', '97'),
]
for row_data in class_data:
    row = class_table.add_row()
    for j, val in enumerate(row_data):
        row.cells[j].text = val

doc.add_paragraph()

add_body('Confusion Matrix:')
conf_table = doc.add_table(rows=1, cols=3)
conf_table.style = 'Light Grid Accent 1'
chdr = conf_table.rows[0].cells
chdr[0].text = ''
chdr[1].text = 'Predicted Ham'
chdr[2].text = 'Predicted Spam'

# ================= 11. STREAMLIT APPLICATION =================
add_heading('11. Streamlit Application Description', 1)
add_body('The project includes an interactive web application built with Streamlit (app.py). The application:')
app_features = [
    'Displays a clean, centered interface with the title "📧 Spam Email Detector".',
    'Provides a text area where users can paste or type email messages.',
    'Includes a "Check Email" button to trigger classification.',
    'Validates input and warns users if no email is entered.',
    'Displays the prediction result with color-coded messages:',
    '  - Red error box for SPAM detection (⚠️ This email is SPAM!).',
    '  - Green success box for legitimate emails (✅ This email is NOT SPAM!).',
    'Loads the pre-trained model from models/spam_classifier.joblib.',
    'Uses the src.predict module to generate predictions.',
]
for f in app_features:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(f)

# ================= 12. ADVANTAGES AND LIMITATIONS =================
add_heading('12. Advantages and Limitations', 1)

add_body('Advantages:', bold=True)
advantages = [
    'Simple and intuitive web interface — no technical knowledge required.',
    'Fast real-time predictions once the model is loaded.',
    'High accuracy (96.11%) for reliable spam detection.',
    'No legitimate emails are incorrectly marked as spam (100% ham recall).',
    'Lightweight — runs locally with minimal dependencies.',
    'Model is saved and can be reused without retraining.',
]
for a in advantages:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(a)

add_body('Limitations:', bold=True)
limitations2 = [
    'Some spam emails (24% of test spam) may be missed (76% spam recall).',
    'Trained on a specific dataset; may not generalize to all spam types.',
    'Analyzes email body text only; does not examine subject lines, sender reputation, or attachments.',
    'Runs locally — not deployed as a web service.',
]
for l in limitations2:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(l)

# ================= 13. FUTURE IMPROVEMENTS =================
add_heading('13. Future Improvements', 1)
improvements = [
    'Improve spam detection recall to reduce missed spam emails.',
    'Train with a larger and more diverse dataset.',
    'Add email subject-line analysis as an additional feature.',
    'Improve text preprocessing with lemmatization and stemming.',
    'Compare multiple machine learning algorithms (e.g., SVM, Random Forest, Logistic Regression).',
    'Deploy the application online for broader access.',
    'Add email header analysis (sender, subject, attachments).',
    'Implement user feedback mechanism for continuous learning.',
]
for i, imp in enumerate(improvements, 1):
    p = doc.add_paragraph(style='List Number')
    p.add_run(imp)

# ================= 14. CONCLUSION =================
add_heading('14. Conclusion', 1)
add_body('The AI Email Spam Classifier demonstrates how Natural Language Processing and machine learning can be '
         'applied to solve a practical, real-world problem. The project successfully builds an email spam '
         'classification system using TF-IDF feature extraction and the Complement Naive Bayes algorithm, achieving '
         'approximately 96.11% accuracy on the test dataset.')

add_body('The Streamlit web application provides an accessible interface for users to test email messages and '
         'receive instant spam/not-spam predictions. The model is saved for future use, and the code is well-organized '
         'and documented for easy maintenance and extension.')

add_body('While the model performs well overall, there is room for improvement in spam recall. Future work could '
         'focus on reducing missed spam detections and deploying the application as an online service.')

doc.add_paragraph()
doc.add_paragraph('---')
doc.add_paragraph('Project Name: AI Email Spam Classifier')
doc.add_paragraph('Project Type: Machine Learning / Natural Language Processing')
doc.add_paragraph('Purpose: Internship Project')

report_path = r'C:\Users\DELL\Desktop\Internship-Projects\AI-Email-Spam-Detector\Spam_Email_Classifier\Spam_Email_Classifier_Report.docx'
doc.save(report_path)
print(f'Report saved to: {report_path}')
conf_data = [
    ('Actual Ham', '495', '0'),
    ('Actual Spam', '23', '74'),
]
for row_data in conf_data:
    row = conf_table.add_row()
    for j, val in enumerate(row_data):
        row.cells[j].text = val

doc.add_paragraph()

add_body('Strengths:', bold=True)
strengths = [
    'High accuracy of 96.11% on the test dataset.',
    'Perfect precision for spam detection (1.00) — when the model predicts spam, it is always correct.',
    'Perfect recall for ham detection (1.00) — no legitimate emails are incorrectly flagged as spam.',
    'Strong F1-scores for both classes (0.98 for ham, 0.87 for spam).',
]
for s in strengths:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(s)

add_body('Limitations:', bold=True)
limitations = [
    'Spam recall is 0.76, meaning 23 out of 97 spam emails in the test set were misclassified as legitimate.',
    'The model may struggle with new or evolving spam patterns not present in the training data.',
    'Performance depends on the quality and diversity of the training dataset.',
]
for l in limitations:
    p = doc.add_paragraph(style='List Bullet')
    p.add_run(l)