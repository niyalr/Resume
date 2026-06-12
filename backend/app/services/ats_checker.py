import re

def check_ats(text: str) -> dict:
    """
    Checks the resume text for ATS compliance, including contact info presence,
    standard sections, and word count recommendations.
    """
    # Regex patterns for contact information
    email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
    # Phone pattern covers common formats like +1 234 567 8900, (123) 456-7890, 123-456-7890, etc.
    phone_pattern = r'(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
    linkedin_pattern = r'linkedin\.com/in/[\w\.-]+'
    github_pattern = r'github\.com/[\w\.-]+'
    
    has_email = bool(re.search(email_pattern, text))
    has_phone = bool(re.search(phone_pattern, text))
    has_linkedin = bool(re.search(linkedin_pattern, text, re.IGNORECASE))
    has_github = bool(re.search(github_pattern, text, re.IGNORECASE))
    
    # Section keywords detection
    sections = {
        "education": ["education", "academic", "study", "university", "college", "degree", "schooling"],
        "experience": ["experience", "work history", "employment", "professional experience", "positions", "work"],
        "projects": ["project", "projects", "personal projects", "portfolio", "key projects"],
        "skills": ["skills", "technical skills", "technologies", "expertise", "competencies"]
    }
    
    found_sections = []
    missing_sections = []
    
    text_lower = text.lower()
    for section, keywords in sections.items():
        if any(r"\b" + re.escape(keyword) + r"\b" in text_lower for keyword in keywords) or any(keyword in text_lower for keyword in keywords):
            found_sections.append(section)
        else:
            missing_sections.append(section)
            
    word_count = len(text.split())
    
    return {
        "has_email": has_email,
        "has_phone": has_phone,
        "has_linkedin": has_linkedin,
        "has_github": has_github,
        "found_sections": found_sections,
        "missing_sections": missing_sections,
        "word_count": word_count
    }