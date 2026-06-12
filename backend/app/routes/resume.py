from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.parser import extract_text
from app.services.scorer import calculate_score
from app.services.ats_checker import check_ats
from app.services.suggestion import generate_suggestions
from app.services.keyword_match import keyword_score

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # 1. Extract text from the uploaded file
        resume_text = extract_text(resume.file, resume.filename)
        
        if not resume_text or not resume_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Could not extract text from the resume. Please verify the file is not empty or corrupted."
            )
            
        # 2. Run skill-matching and semantic-similarity score
        scorer_result = calculate_score(resume_text, job_description)
        
        # 3. Check ATS formatting rules
        ats_result = check_ats(resume_text)
        
        # 4. Generate general keyword analysis
        keyword_result = keyword_score(resume_text, job_description)
        
        # 5. Compile prioritized career improvement tips
        suggestions = generate_suggestions(ats_result, scorer_result, keyword_result)
        
        return {
            "success": True,
            "filename": resume.filename,
            "scores": {
                "final_score": scorer_result.get("final_score", 0),
                "skill_score": scorer_result.get("skill_score", 0),
                "semantic_score": scorer_result.get("semantic_score", 0)
            },
            "skills_analysis": {
                "matched_skills": scorer_result.get("matched_skills", []),
                "missing_skills": scorer_result.get("missing_skills", [])
            },
            "ats_check": ats_result,
            "keyword_match": {
                "score": keyword_result.get("score", 0),
                "matched_count": len(keyword_result.get("matched", [])),
                "missing_count": len(keyword_result.get("missing", []))
            },
            "suggestions": suggestions
        }
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        # Standard logging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")