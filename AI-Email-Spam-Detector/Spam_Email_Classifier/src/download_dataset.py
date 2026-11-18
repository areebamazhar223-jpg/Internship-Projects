import csv
import tarfile
import urllib.request
from pathlib import Path
from email import policy
from email.parser import BytesParser

BASE = Path(__file__).resolve().parents[1]
DOWNLOAD_DIR = BASE / "dataset" / "downloads"
OUTPUT_FILE = BASE / "dataset" / "spam.csv"

DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

DATASETS = {
    "ham": "20030228_easy_ham.tar.bz2",
    "spam": "20030228_spam.tar.bz2"
}

BASE_URL = "https://spamassassin.apache.org/old/publiccorpus/"

def get_email_text(raw_email):
    message = BytesParser(policy=policy.default).parsebytes(raw_email)

    subject = str(message.get("subject", ""))
    body_parts = []

    for part in message.walk():
        if part.is_multipart():
            continue

        if part.get_content_disposition() == "attachment":
            continue

        if part.get_content_type() in ("text/plain", "text/html"):
            try:
                content = part.get_content()
                if isinstance(content, str):
                    body_parts.append(content)
            except Exception:
                continue

    return subject + "\n" + "\n".join(body_parts)

rows = []

for label, filename in DATASETS.items():
    archive_path = DOWNLOAD_DIR / filename
    url = BASE_URL + filename

    if not archive_path.exists():
        print("Downloading:", filename)
        urllib.request.urlretrieve(url, archive_path)

    print("Reading:", filename)

    with tarfile.open(archive_path, "r:bz2") as archive:
        for member in archive.getmembers():
            if not member.isfile():
                continue

            file_obj = archive.extractfile(member)
            if file_obj is None:
                continue

            try:
                raw_email = file_obj.read()
                text = get_email_text(raw_email)

                if len(text.strip()) > 20:
                    rows.append({
                        "label": label,
                        "text": text
                    })
            except Exception:
                continue

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["label", "text"])
    writer.writeheader()
    writer.writerows(rows)

print("\nDATASET CREATED SUCCESSFULLY!")
print("Total emails:", len(rows))
print("Legitimate emails:", sum(r["label"] == "ham" for r in rows))
print("Spam emails:", sum(r["label"] == "spam" for r in rows))
print("Saved to:", OUTPUT_FILE)
