
import streamlit as st

from src.predict import predict_email

# Page configuration
st.set_page_config(
    page_title="Spam Email Detector",
    page_icon="📧",
    layout="centered"
)

# Website title
st.title("📧 Spam Email Detector")

st.write(
    "Welcome! Enter an email below "
    "to check whether it is Spam or Not Spam."
)

st.divider()

# Email input area
email = st.text_area(
    "Enter your email message:",
    placeholder="Paste your email here...",
    height=200
)

# Check email button
if st.button("Check Email", type="primary"):

    if not email.strip():
        st.warning("Please enter an email first!")

    else:
        result = predict_email(email)

        if result == "SPAM":
            st.error("⚠️ This email is SPAM!")

        elif result == "NOT SPAM":
            st.success("✅ This email is NOT SPAM!")

        else:
            st.warning(result)

# Footer
st.divider()

st.caption("AI Email Spam Classifier | Machine Learning Project")
