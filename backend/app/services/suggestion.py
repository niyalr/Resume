def generate_suggestions(ats_result: dict, scorer_result: dict, keyword_result: dict = None) -> list:
    """
    Generates structured, actionable improvements for the candidate's resume
    based on ATS metrics, skill matching, and content relevance.
    """
    suggestions = []
    
    # 1. Contact Information Checks
    if not ats_result.get("has_email"):
        suggestions.append({
            "category": "Contact Info",
            "message": "Add an email address to your resume so recruiters can contact you.",
            "severity": "high"
        })
    if not ats_result.get("has_phone"):
        suggestions.append({
            "category": "Contact Info",
            "message": "Add a phone number to your resume for easier recruiter outreach.",
            "severity": "high"
        })
    if not ats_result.get("has_linkedin"):
        suggestions.append({
            "category": "Contact Info",
            "message": "Include your LinkedIn profile link to showcase your professional network and presence.",
            "severity": "medium"
        })
    if not ats_result.get("has_github"):
        suggestions.append({
            "category": "Contact Info",
            "message": "Consider adding your GitHub portfolio link to showcase your source code and practical work.",
            "severity": "low"
        })
        
    # 2. Section Checks
    for missing_section in ats_result.get("missing_sections", []):
        suggestions.append({
            "category": "Formatting",
            "message": f"Add an explicit '{missing_section.capitalize()}' section header to help ATS parsers categorize your details.",
            "severity": "high"
        })
        
    # 3. Word Count Checks
    word_count = ats_result.get("word_count", 0)
    if word_count < 200:
        suggestions.append({
            "category": "Length",
            "message": f"Your resume is extremely short ({word_count} words). Try expanding on your experience, projects, or education to reach at least 300-400 words.",
            "severity": "high"
        })
    elif word_count > 1200:
        suggestions.append({
            "category": "Length",
            "message": f"Your resume is very long ({word_count} words). Aim for a concise 1-2 page format (typically 400-800 words) by highlighting only the most relevant achievements.",
            "severity": "medium"
        })
        
    # 4. Skill Gap Analysis
    missing_skills = scorer_result.get("missing_skills", [])
    if missing_skills:
        limit = min(5, len(missing_skills))
        skills_str = ", ".join(f"'{s}'" for s in missing_skills[:limit])
        more_count = len(missing_skills) - limit
        more_str = f" and {more_count} more" if more_count > 0 else ""
        suggestions.append({
            "category": "Skills Match",
            "message": f"Incorporate missing key skills required by the job: {skills_str}{more_str}.",
            "severity": "high"
        })
        
    # 5. Semantic Match and Content Relevance
    semantic_score = scorer_result.get("semantic_score", 0)
    if semantic_score < 40:
        suggestions.append({
            "category": "Content Relevance",
            "message": "Low job description alignment. Tailor your professional summaries and bullet points to reflect the language, keywords, and focus of the target job.",
            "severity": "high"
        })
    elif semantic_score < 65:
        suggestions.append({
            "category": "Content Relevance",
            "message": "Moderate job description alignment. Customize your project section or experience descriptions to explicitly target responsibilities mentioned in the job description.",
            "severity": "medium"
        })
        
    return suggestions
