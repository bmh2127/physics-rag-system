from fastapi.testclient import TestClient
import pytest
import os
from unittest.mock import patch, MagicMock
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Make sure ABACUS_API_KEY is set for tests
if not os.getenv("ABACUS_API_KEY"):
    os.environ["ABACUS_API_KEY"] = "test_api_key"

# Import app after environment is set up
from main import app, get_rag_system

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

@patch('main.AbacusRagClient')
@patch('main.PhysicsRagSystem')
def test_search_endpoint(mock_rag_system_class, mock_client_class):
    # Set up mocks
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_rag_system = MagicMock()
    mock_rag_system.search.return_value = {
        "query": "What is Newton's First Law?",
        "answer": "Newton's First Law states that an object will remain at rest or in uniform motion unless acted upon by a force.",
        "source": "placeholder"
    }
    mock_rag_system_class.return_value = mock_rag_system
    
    query = "What is Newton's First Law?"
    response = client.post("/search", json={"query": query})
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == query
    assert "answer" in data
    assert "source" in data
    
    # Verify our mock was called
    mock_rag_system.search.assert_called_once_with(query)

@patch('main.AbacusRagClient')
@patch('main.PhysicsRagSystem')
def test_practice_endpoint(mock_rag_system_class, mock_client_class):
    # Set up mocks
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_rag_system = MagicMock()
    mock_rag_system.generate_practice_problems.return_value = {
        "topic": "classical_mechanics",
        "difficulty": "medium",
        "problems": [
            {
                "id": "cm-1",
                "problem": "A 2 kg object is pushed with a force of 10 N. What is its acceleration?",
                "answer": "5 m/s²",
                "explanation": "Using Newton's Second Law (F = ma), we can rearrange to find a = F/m = 10N/2kg = 5 m/s²"
            }
        ]
    }
    mock_rag_system_class.return_value = mock_rag_system
    
    response = client.post("/practice", json={"topic": "classical_mechanics", "difficulty": "medium"})
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "classical_mechanics"
    assert data["difficulty"] == "medium"
    assert "problems" in data
    assert len(data["problems"]) > 0
    
    # Verify our mock was called
    mock_rag_system.generate_practice_problems.assert_called_once_with("classical_mechanics", "medium")