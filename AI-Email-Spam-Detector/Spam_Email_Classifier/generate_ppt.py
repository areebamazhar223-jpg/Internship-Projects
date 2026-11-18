from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

DARK_BLUE = RGBColor(0x1F, 0x3B, 0x5C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
GRAY = RGBColor(0x55, 0x55, 0x55)

blank_layout = prs.slide_layouts[6]

def add_slide(title_text, subtitle_text=None):
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = WHITE
    bg.line.fill.background()
    bar = slide.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1.0))
    bar.fill.solid()
    bar.fill.fore_color.rgb = DARK_BLUE
    bar.line.fill.background()
    tb = slide.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(12.0), Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run = p.add_run()
    run.text = title_text
    run.font.size = Pt(32)
    run.font.bold = True
    run.font.color.rgb = WHITE
    if subtitle_text:
        stb = slide.shapes.add_textbox(Inches(0.5), Inches(1.15), Inches(12.0), Inches(0.5))
        stf = stb.text_frame
        stf.word_wrap = True
        p2 = stf.paragraphs[0]
        run2 = p2.add_run()
        run2.text = subtitle_text
        run2.font.size = Pt(16)
        run2.font.color.rgb = GRAY
    return slide

def add_bullet_content(slide, items, top=1.8, left=0.7, width=11.5, height=5.0, font_size=18):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        run = p.add_run()

# Slide 1: Title
slide = add_slide("AI Email Spam Classifier", "Internship Project — Machine Learning & NLP")
tb = slide.shapes.add_textbox(Inches(0.5), Inches(2.8), Inches(12.0), Inches(3.0))
tf = tb.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
run = p.add_run()
run.text = "Spam or Not Spam Email Classification"
run.font.size = Pt(40)
run.font.bold = True
run.font.color.rgb = DARK_BLUE
p2 = tf.add_paragraph()
p2.alignment = PP_ALIGN.CENTER
run2 = p2.add_run()
run2.text = "An intelligent email classification system using Complement Naive Bayes and TF-IDF"
run2.font.size = Pt(20)
run2.font.color.rgb = GRAY
p3 = tf.add_paragraph()
p3.alignment = PP_ALIGN.CENTER
run3 = p3.add_run()
run3.text = "Presented by: Internship Project"
run3.font.size = Pt(16)
run3.font.color.rgb = GRAY

# Slide 2: Introduction
slide = add_slide("Introduction", "Why email spam classification matters")
add_bullet_content(slide, [
    "Email spam is a persistent problem for individuals and organizations worldwide.",
    "Unwanted messages clutter inboxes, waste time, and can pose security risks.",
    "Phishing links and malware attachments in spam emails threaten user safety.",
    "Manual identification of spam is impractical with high email volumes.",
    "This project builds an intelligent system to automatically classify emails as spam or legitimate.",
], font_size=20)

# Slide 3: Problem Statement
slide = add_slide("Problem Statement", "The challenge we address")
add_bullet_content(slide, [
    "High volume of email communication makes manual spam filtering impractical.",
    "Users spend significant time sorting through unwanted messages.",
    "Important legitimate emails may be overlooked in cluttered inboxes.",
    "Existing spam filters vary in effectiveness and accessibility.",
    "Need for an accessible, accurate, and easy-to-use email spam classification solution.",
], font_size=20)

# Slide 4: Project Objectives
slide = add_slide("Project Objectives", "What we aim to achieve")
add_bullet_content(slide, [
    "Build a machine learning model to classify emails as spam or not spam.",
    "Use Natural Language Processing (NLP) for text preprocessing and cleaning.",
    "Extract text features using TF-IDF vectorization.",
], font_size=18)

# Slide 5: Technologies Used
slide = add_slide("Technologies Used", "Project tech stack")
add_bullet_content(slide, [
    "Python — Main programming language",
    "Pandas — Dataset loading and data processing",
    "Scikit-learn — Machine learning, training, and evaluation",
    "TF-IDF — Text feature extraction from email content",
    "Complement Naive Bayes — Email classification algorithm",
    "Streamlit — Web application development",
    "Joblib — Saving and loading the trained model",
], font_size=18)

# Slide 6: Dataset Description
slide = add_slide("Dataset Description", "Apache SpamAssassin Public Corpus")
add_bullet_content(slide, [
    "Real email messages labeled as spam or ham (legitimate).",
    "Original dataset: 3,002 email records (501 spam, 2,501 ham).",
    "After cleaning: 2,959 usable records.",
    "Split: 80% training (~2,367 emails) and 20% testing (~592 emails).",
    "Cleaned by removing missing values and duplicate records.",
], font_size=18)

# Slide 7: Project Methodology
slide = add_slide("Project Methodology", "End-to-end ML pipeline")
add_bullet_content(slide, [
    "1. Load and clean the spam.csv dataset.",
    "2. Preprocess text: lowercase, HTML removal, URL/email removal, noise filtering.",
    "3. Extract features using TF-IDF vectorization (unigrams + bigrams).",
    "4. Train Complement Naive Bayes classifier on 80% of data.",
    "5. Evaluate model on 20% test set using accuracy, precision, recall, F1-score.",
    "6. Save trained model with Joblib for future predictions.",
    "7. Build Streamlit web app for real-time classification.",
], font_size=16)

# Slide 8: Machine Learning Model
slide = add_slide("Machine Learning Model", "Complement Naive Bayes")
add_bullet_content(slide, [
    "Algorithm: Complement Naive Bayes (ComplementNB)",
    "Effective for imbalanced text classification datasets.",
    "Computes weights from the complement of each class.",
    "Handles the imbalance between spam and ham emails.",
], font_size=16)

# Slide 9: Model Performance
slide = add_slide("Model Performance", "Evaluation results on test set")
add_bullet_content(slide, [
    "Accuracy: 96.11%",
    "Test set: 592 emails (495 ham, 97 spam)",
    "Ham: Precision 0.96, Recall 1.00, F1-Score 0.98",
    "Spam: Precision 1.00, Recall 0.76, F1-Score 0.87",
    "Confusion Matrix: 495 correct ham, 74 correct spam, 23 missed spam",
    "No legitimate emails incorrectly flagged as spam.",
], font_size=18)

# Slide 10: Web Application Demonstration
slide = add_slide("Web Application Demonstration", "Streamlit interface")
add_bullet_content(slide, [
    "Interactive web app built with Streamlit (app.py).",
    "Clean, centered interface with title: 📧 Spam Email Detector.",
    "Text area for pasting or typing email messages.",
    "Check Email button triggers real-time classification.",
    "Color-coded results:",
    "  Red box: ⚠️ This email is SPAM!",
    "  Green box: ✅ This email is NOT SPAM!.",
    "Loads pre-trained model from models/spam_classifier.joblib.",
], font_size=16)

# Slide 11: Future Improvements
slide = add_slide("Future Improvements", "Next steps")
add_bullet_content(slide, [
    "Improve spam detection recall to reduce missed spam emails.",
    "Train with a larger and more diverse dataset.",
    "Add email subject-line analysis as an additional feature.",
    "Improve text preprocessing with lemmatization and stemming.",
    "Compare multiple ML algorithms (SVM, Random Forest, Logistic Regression).",
    "Deploy the application online for broader access.",
    "Add email header analysis (sender, subject, attachments).",
], font_size=16)

# Slide 12: Conclusion
slide = add_slide("Conclusion", "Project summary")
add_bullet_content(slide, [
    "Successfully built an email spam classification system using NLP and ML.",
    "Achieved approximately 96.11% accuracy on the test dataset.",
    "Streamlit web app provides accessible real-time classification.",
    "Model saved for future use without retraining.",
    "Well-organized, documented code for easy maintenance.",
    "Room for improvement in spam recall — focus of future work.",
], font_size=18)

# Save presentation
ppt_path = r'C:\Users\DELL\Desktop\Internship-Projects\AI-Email-Spam-Detector\Spam_Email_Classifier\Spam_Email_Classifier_Presentation.pptx'
prs.save(ppt_path)
print(f'Presentation saved to: {ppt_path}')
