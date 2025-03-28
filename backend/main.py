import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

from rag.abacus_client import AbacusRagClient
from rag.physics_rag import PhysicsRagSystem

# Load environment variables
load_dotenv()

# Check for required environment variables
ABACUS_API_KEY = os.getenv("ABACUS_API_KEY")
if not ABACUS_API_KEY:
    raise ValueError("Please set the ABACUS_API_KEY environment variable")

# Initialize FastAPI app
app = FastAPI(title="Physics RAG Learning System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models
class SearchQuery(BaseModel):
    query: str

class PracticeRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "medium"  # easy, medium, hard
    
class GradeRequest(BaseModel):
    question: str
    student_answer: str
    reference_answer: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    version: str

# Dependencies
def get_rag_system():
    abacus_client = AbacusRagClient(ABACUS_API_KEY)
    rag_system = PhysicsRagSystem(abacus_client)
    # Initialize only if we have document retrievers (in production)
    # rag_system.initialize_document_retrievers()
    return rag_system

# Health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    return {
        "status": "healthy",
        "version": "0.1.0"
    }

# Search endpoint
@app.post("/search")
async def search(search_query: SearchQuery, rag_system: PhysicsRagSystem = Depends(get_rag_system)):
    try:
        result = rag_system.search(search_query.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Topic-specific search endpoint
@app.post("/learn/{topic}")
async def learn_topic(topic: str, search_query: SearchQuery, rag_system: PhysicsRagSystem = Depends(get_rag_system)):
    try:
        if topic not in rag_system.topics:
            return {"error": f"Topic {topic} not found. Available topics: {rag_system.topics}"}
        
        result = rag_system.search(search_query.query, topic)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Practice problems endpoint
@app.post("/practice")
async def generate_problems(practice_req: PracticeRequest, rag_system: PhysicsRagSystem = Depends(get_rag_system)):
    try:
        return rag_system.generate_practice_problems(practice_req.topic, practice_req.difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Grading endpoint
@app.post("/grade")
async def grade_answer(grade_req: GradeRequest, rag_system: PhysicsRagSystem = Depends(get_rag_system)):
    try:
        return rag_system.grade_answer(
            grade_req.question,
            grade_req.student_answer,
            grade_req.reference_answer
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)