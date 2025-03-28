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
        self.document_retrievers = {}
    
    def list_document_retrievers(self) -> Dict[str, Any]:
        """List all document retrievers."""
        try:
            return self.client.list_document_retrievers()
        except Exception as e:
            print(f"Error listing document retrievers: {e}")
            return {"result": []}
    
    def create_document_retriever(self, name: str, description: str, 
                                  feature_group_id: str, text_field: str,
                                  metadata_fields: List[str]) -> Dict[str, Any]:
        """Create a new document retriever."""
        try:
            response = self.client.create_document_retriever(
                name=name,
                description=description,
                feature_group_id=feature_group_id,
                text_field=text_field,
                metadata_fields=metadata_fields
            )
            return response
        except Exception as e:
            print(f"Error creating document retriever: {e}")
            return {"result": {}}
    
    def query_document_retriever(self, document_retriever_id: str, 
                                query: str, max_results: int = 3) -> List[Dict[str, Any]]:
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
    
    def get_document_snippet(self, document_id: str, 
                            start_pos: int = 0, length: int = 1000) -> str:
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