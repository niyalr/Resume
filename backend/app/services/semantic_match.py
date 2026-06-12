from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def semantic_score(resume_text, job_description):

    # temporary limit
    resume_text = resume_text[:1000]
    job_description = job_description[:500]

    resume_embedding = model.encode(
        [resume_text]
    )

    jd_embedding = model.encode(
        [job_description]
    )

    similarity = cosine_similarity(
        resume_embedding,
        jd_embedding
    )[0][0]

    return float(round(
        similarity * 100,
        2
    ))