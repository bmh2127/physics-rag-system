# rag/physics_rag.py
from typing import List, Dict, Any, Optional
from .abacus_client import AbacusRagClient

class PhysicsRagSystem:
    """Physics RAG system for retrieving and generating physics content."""
    
    def __init__(self, abacus_client: AbacusRagClient):
        """Initialize the Physics RAG system.
        
        Args:
            abacus_client: Initialized AbacusRagClient
        """
        self.abacus_client = abacus_client
        
        # Initialize project and feature group
        self.project_id = self.abacus_client.initialize_project(name="PhysicsRAG")
        self.feature_group_id = self.abacus_client.create_feature_group(name="PhysicsDocuments")
        
        # Define physics topics
        self.topics = [
            "classical_mechanics",
            "thermodynamics",
            "electromagnetism",
            "quantum_mechanics",
            "relativity"
        ]
        
        # Map of topic to document retriever ID
        self.document_retrievers = {}
        
    def initialize_document_retrievers(self):
        """Initialize document retrievers for each physics topic."""
        for topic in self.topics:
            # Create a document retriever for this topic if it doesn't exist
            retriever_name = f"physics_{topic}_retriever"
            retriever_id = self.abacus_client.create_document_retriever(
                name=retriever_name,
                description=f"Document retriever for physics {topic}"
            )
            
            if retriever_id:
                self.document_retrievers[topic] = retriever_id
                print(f"Created document retriever for {topic}: {retriever_id}")
    
    def search(self, query: str, topic: Optional[str] = None) -> Dict[str, Any]:
        """Search for physics information based on a query.
        
        Args:
            query: The search query
            topic: Optional specific topic to search within
            
        Returns:
            Dictionary with answer and related information
        """
        # If topic is specified, use that document retriever
        if topic and topic in self.document_retrievers:
            retriever_id = self.document_retrievers[topic]
            documents = self.abacus_client.query_document_retriever(retriever_id, query)
        else:
            # Try all document retrievers and combine results
            documents = []
            for topic_id, retriever_id in self.document_retrievers.items():
                topic_docs = self.abacus_client.query_document_retriever(retriever_id, query)
                documents.extend(topic_docs)
        
        # Extract content from documents
        context = []
        for doc in documents:
            snippet = self.abacus_client.get_document_snippet(doc.get('documentId', ''))
            if snippet:
                context.append(snippet)
        
        if not context:
            # No relevant documents found, use generic response
            return {
                "query": query,
                "answer": f"I don't have specific information about '{query}'. Please try a different physics query.",
                "source": "knowledge base"
            }
        
        # Generate answer using ChatLLM with retrieved context
        messages = [
            {"role": "system", "content": "You are a knowledgeable physics instructor. Answer the question based on the following context information. If you don't know the answer based on the context, say so."},
            {"role": "user", "content": f"Context information:\n\n{' '.join(context)}\n\nQuestion: {query}"}
        ]
        
        answer = self.abacus_client.chat_completion(messages)
        
        return {
            "query": query,
            "answer": answer,
            "source": "physics knowledge"
        }
    
    def generate_practice_problems(self, topic: str, difficulty: str = "medium") -> Dict[str, Any]:
        """Generate practice problems for a physics topic.
        
        Args:
            topic: The physics topic
            difficulty: Problem difficulty level ("easy", "medium", "hard")
            
        Returns:
            Dictionary with practice problems
        """
        # Generate practice problems using Abacus AI
        messages = [
            {"role": "system", "content": f"You are an expert physics professor. Generate 3 physics practice problems on the topic of {topic} at {difficulty} difficulty level. For each problem: provide a clear problem statement, include all necessary information to solve the problem, include the correct answer, and provide a detailed explanation of the solution."},
            {"role": "user", "content": f"Create {difficulty} level practice problems for {topic}."}
        ]
        
        response = self.abacus_client.chat_completion(messages)
        
        # Parse response into structured problems
        # In a real implementation, you would parse the response from the LLM
        # For now, return sample problems
        problems = [
            {
                "id": f"{topic}-1",
                "problem": "Sample problem for " + topic,
                "answer": "Sample answer",
                "explanation": "Sample explanation"
            },
            {
                "id": f"{topic}-2",
                "problem": "Another sample problem for " + topic,
                "answer": "Another sample answer",
                "explanation": "Another sample explanation"
            }
        ]
        
        return {
            "topic": topic,
            "difficulty": difficulty,
            "problems": problems
        }
    
    def grade_answer(self, question: str, student_answer: str, 
                     reference_answer: Optional[str] = None) -> Dict[str, Any]:
        """Grade a student's answer to a physics problem.
        
        Args:
            question: The physics problem
            student_answer: The student's answer
            reference_answer: Optional reference answer
            
        Returns:
            Dictionary with grading information
        """
        # Generate grading using Abacus AI
        content = f"Problem: {question}\n\nStudent Answer: {student_answer}"
        if reference_answer:
            content += f"\n\nReference Answer: {reference_answer}"
            
        messages = [
            {"role": "system", "content": "You are an expert physics instructor grading a student's answer. Provide a score from 0-100, indicate if the answer is correct or not, provide detailed feedback, and explain the correct solution."},
            {"role": "user", "content": content}
        ]
        
        response = self.abacus_client.chat_completion(messages)
        
        # In a real implementation, you would parse the LLM response
        # For now, use a simple heuristic
        is_correct = any(keyword in student_answer.lower() for keyword in ["force", "acceleration", "newton", "joule", "energy"])
        
        return {
            "score": 90 if is_correct else 40,
            "correct": is_correct,
            "feedback": response,
            "correct_solution": "The detailed solution would be provided by the LLM."
        }