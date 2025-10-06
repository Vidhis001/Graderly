from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal

try:
    from sentence_transformers import SentenceTransformer, util
    _model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception:
    _model = None
    util = None

app = FastAPI(title="Student Answer Grading Service", version="0.1.0")


class GradeRequest(BaseModel):
    question: str
    reference_answer: str
    student_answer: str


class GradeResponse(BaseModel):
    score: float
    category: Literal["Correct", "Partially Correct", "Incorrect"]
    similarity: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/grade", response_model=GradeResponse)
def grade(req: GradeRequest):
    if not _model or not util:
        # Fallback deterministic stub for environments without model
        sim = 0.0
    else:
        texts = [req.reference_answer, req.student_answer]
        emb = _model.encode(texts, convert_to_tensor=True, normalize_embeddings=True)
        sim = float(util.cos_sim(emb[0], emb[1]).item())

    # Map similarity -> score and category (simple heuristic)
    score = max(0.0, min(1.0, sim))
    if score >= 0.75:
        category = "Correct"
    elif score >= 0.45:
        category = "Partially Correct"
    else:
        category = "Incorrect"

    return {"score": score, "category": category, "similarity": sim}


