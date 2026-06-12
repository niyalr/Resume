import re
from app.utils.test_cleaner import clean_text


STOP_WORDS = {
    "the", "is", "a", "an",
    "for", "to", "with",
    "in", "of", "and",
    "on", "at"
}

def extract_keywords(text):

    text = clean_text(text)

    words = re.findall(r'\w+', text)

    words = [word for word in words
             if word not in STOP_WORDS]

    return set(words)


def keyword_score(resume_text, jd_text):

    resume_words = extract_keywords(resume_text)

    jd_words = extract_keywords(jd_text)

    matched = resume_words.intersection(jd_words)

    missing = jd_words - resume_words

    score = (len(matched) / len(jd_words)) * 100

    return {
        "score": round(score, 2),
        "matched": list(matched),
        "missing": list(missing)
    }