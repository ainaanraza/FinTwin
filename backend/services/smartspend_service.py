class SmartSpendEngine:
    @staticmethod
    def check_spending(amount: float, category: str):
        """
        Real-time engine to check if a purchase violates budget rules.
        """
        # Mock thresholds
        thresholds = {
            "Food": 500,
            "Shopping": 300,
            "Transport": 200
        }
        
        limit = thresholds.get(category, 1000)
        
        if amount > limit:
            return {
                "allowed": False, 
                "alert": f"Alert: This purchase exceeds your {category} limit of ${limit}.",
                "suggestion": "Consider deferring this purchase or finding a cheaper alternative."
            }
        
        return {"allowed": True, "alert": None}
