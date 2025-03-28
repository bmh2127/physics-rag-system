# rag/abacus_client.py
from abacusai import ApiClient
import os
from typing import List, Dict, Any, Optional

class AbacusRagClient:
    """Client for interacting with Abacus.AI RAG capabilities."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Abacus.AI client.
        
        Args:
            api_key: Abacus.AI API key. If not provided, reads from ABACUS_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("ABACUS_API_KEY")
        if not self.api_key:
            raise ValueError("Abacus API key is required")
        
        self.client = ApiClient(self.api_key)
        self.project_id = None
        self.feature_group_id = None
        self.document_retrievers = {}
        
    def initialize_project(self, name: str = "PhysicsRAG"):
        """Initialize a project for the RAG system."""
        try:
            # Check for existing project
            projects = self.client.list_projects()
            for project in projects.get('result', []):
                if project.get('name') == name:
                    self.project_id = project.get('projectId')
                    print(f"Using existing project: {name} (ID: {self.project_id})")
                    return self.project_id
            
            # Create new project with NLP_SEARCH use case
            response = self.client.create_project(
                name=name,
                use_case="NLP_SEARCH"
            )
            self.project_id = response.get('result', {}).get('projectId')
            print(f"Created new project: {name} (ID: {self.project_id})")
            return self.project_id
        except Exception as e:
            print(f"Error initializing project: {e}")
            return None
            
    def create_feature_group(self, name: str = "PhysicsDocuments"):
        """Create a feature group for storing document data."""
        try:
            # Check for existing feature group
            if self.project_id:
                fg_list = self.client.list_project_feature_groups(project_id=self.project_id)
                for fg in fg_list.get('result', []):
                    if fg.get('name') == name:
                        self.feature_group_id = fg.get('featureGroupId')
                        print(f"Using existing feature group: {name} (ID: {self.feature_group_id})")
                        return self.feature_group_id
            
            # Create new feature group
            response = self.client.create_feature_group(
                name=name,
                description="Feature group for physics documents"
            )
            self.feature_group_id = response.get('result', {}).get('featureGroupId')
            print(f"Created new feature group: {name} (ID: {self.feature_group_id})")
            
            # Add feature group to project
            if self.project_id and self.feature_group_id:
                self.client.add_feature_group_to_project(
                    project_id=self.project_id,
                    feature_group_id=self.feature_group_id
                )
                print(f"Added feature group to project")
            
            return self.feature_group_id
        except Exception as e:
            print(f"Error creating feature group: {e}")
            return None
    
    def create_document_retriever(self, name: str, description: str):
        """Create a document retriever for the RAG system."""
        if not self.feature_group_id:
            print("Feature group ID not set. Call create_feature_group first.")
            return None
            
        try:
            response = self.client.create_document_retriever(
                name=name,
                description=description,
                feature_group_id=self.feature_group_id,
                text_field="content",
                metadata_fields=["source", "topic", "section"]
            )
            retriever_id = response.get('result', {}).get('documentRetrieverId')
            return retriever_id
        except Exception as e:
            print(f"Error creating document retriever: {e}")
            return None
    
    def query_document_retriever(self, document_retriever_id: str, query: str, max_results: int = 5):
        """Query a document retriever with a search query."""
        try:
            response = self.client.get_matching_documents(
                document_retriever_id=document_retriever_id,
                query=query,
                max_results=max_results
            )
            
            return response.get('result', {}).get('documents', [])
        except Exception as e:
            print(f"Error querying document retriever: {e}")
            return []
    
    def get_document_snippet(self, document_id: str, start_pos: int = 0, length: int = 1000):
        """Get a specific snippet from a document."""
        try:
            response = self.client.get_document_snippet(
                document_id=document_id,
                start_pos=start_pos,
                length=length
            )
            
            return response.get('result', {}).get('snippet', '')
        except Exception as e:
            print(f"Error getting document snippet: {e}")
            return ""
            
    def chat_completion(self, messages, model="gpt-4"):
        """Generate a chat completion using Abacus AI."""
        try:
            # For ChatLLM integration
            response = self.client.chat_completion(
                messages=messages,
                model=model
            )
            return response.get('result', {}).get('content', "")
        except Exception as e:
            print(f"Error generating chat completion: {e}")
            return "I couldn't generate a response. Please try again."