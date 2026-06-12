TECH_SKILLS = {
    "python",
    "java",
    "c++",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "fastapi",
    "django",
    "flask",
    "react",
    "javascript",
    "typescript",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "nlp",
    "git",
    "github",
    "linux"
}


def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in TECH_SKILLS:

        if skill in text:
            found_skills.append(skill)

    return set(found_skills)