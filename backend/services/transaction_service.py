from typing import List, Optional, Dict
import re
from datetime import datetime
from services.db_service import DynamoDBService

class TransactionService:
    # In-memory store REMOVED in favor of DynamoDB
    
    @classmethod
    def get_all_transactions(cls) -> List[Dict]:
        return DynamoDBService.get_all_transactions()

    @classmethod
    def add_transaction(cls, amount: float, category: str, merchant: str, date: str = None) -> Dict:
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        # ID generation strategy: Simple timestamp or UUID is better for distributed systems
        # For hackathon/demo, we can use a timestamp int
        import time
        new_id = int(time.time() * 1000) 

        new_tx = {
            "id": new_id,
            "category": category,
            "amount": amount,
            "date": date,
            "merchant": merchant
        }
        
        success = DynamoDBService.add_transaction(new_tx)
        if success:
            return new_tx
        return None

    @classmethod
    def extract_from_message(cls, message: str) -> Optional[Dict]:
        """
        Attempts to extract transaction details from a natural language message.
        Patterns supported:
        - "Spent $50 on Food at Walmart"
        - "Paid $20 for Taxi via Uber"
        """
        # Pattern 1: Spent $X on Category at Merchant
        # Regex explanation:
        # spent\s+          : Matches "spent "
        # \$?               : Optional dollar sign
        # (?P<amount>\d+(?:\.\d{2})?) : Captures amount (e.g., 50 or 50.25)
        # \s+on\s+          : Matches " on "
        # (?P<category>\w+) : Captures category (single word)
        # \s+(?:at|via)\s+  : Matches " at " or " via "
        # (?P<merchant>.+)  : Captures merchant (rest of string or until punctuation)
        
        pattern = r"(?:spent|paid)\s+\$?(?P<amount>\d+(?:\.\d{2})?)\s+(?:on|for)\s+(?P<category>[\w\s]+?)\s+(?:at|via|to)\s+(?P<merchant>.+)"
        
        match = re.search(pattern, message, re.IGNORECASE)
        
        if match:
            data = match.groupdict()
            try:
                amount = float(data['amount'])
                category = data['category'].strip().title()
                merchant = data['merchant'].strip().title()
                return cls.add_transaction(amount, category, merchant)
            except ValueError:
                return None
        return None
