from pydantic import BaseModel

class AnalyzeTextRequest(BaseModel):
    resume_text: str
    job_description: str
