class RAGService:
    @staticmethod
    def retrieve_context(query: str) -> list:
        """
        Simulates retrieval from AWS OpenSearch/S3.
        Returns a list of relevant 'documents'.
        """
        # Mock knowledge base
        knowledge_base = [
            "Tax Rule 2024: Capital gains tax is 15% for long-term investments.",
            "Economic Indicator: Inflation is currently at 3.2%.",
            "Interest Rates: Average savings account APY is 4.5%.",
            "Housing Market: Prices are trending up in your region."
        ]
        
        # Simple keyword matching mock
        results = [doc for doc in knowledge_base if any(word in doc.lower() for word in query.lower().split())]
        
        if not results:
            return ["General Financial Principles: Spend less than you earn."]
            
        return results
