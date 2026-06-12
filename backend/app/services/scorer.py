from app.services.skill_extractor import extract_skills
from app.services.semantic_match import semantic_score


def calculate_score(
    resume_text,
    job_description
):

    # skill extraction
    resume_skills = extract_skills(
        resume_text
    )

    jd_skills = extract_skills(
        job_description
    )

    matched = resume_skills.intersection(
        jd_skills
    )

    missing = jd_skills - resume_skills


    # exact skill score
    skill_score = (
        len(matched) / len(jd_skills)
    ) * 100 if jd_skills else 0


    # semantic score
    semantic = semantic_score(
        resume_text,
        job_description
    )


    # weighted score
    final_score = (
        skill_score * 0.6 +
        semantic * 0.4
    )


    return {

        "final_score":
            round(final_score, 2),

        "skill_score":
            round(skill_score, 2),

        "semantic_score":
            semantic,

        "matched_skills":
            list(matched),

        "missing_skills":
            list(missing)
    }