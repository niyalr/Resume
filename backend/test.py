from app.services.semantic_match import semantic_score


resume = """
Built scalable REST APIs
using Flask and FastAPI
"""

jd = """
Looking for backend API
development experience
"""

print(
    semantic_score(
        resume,
        jd
    )
)