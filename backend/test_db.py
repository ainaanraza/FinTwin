import sys
import os
import time
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from services.db_service import DynamoDBService

def test_dynamodb():
    print("Testing DynamoDB Connection and Table...")
    
    # 1. Init Table
    try:
        DynamoDBService.init_table()
        print("✅ Table Initialization method called successfully.")
    except Exception as e:
        print(f"❌ Initializing table failed: {e}")
        return

    # 2. Add Transaction
    new_tx = {
        "id": int(time.time() * 1000),
        "amount": 105.50,
        "category": "Test-Category",
        "merchant": "Test-Merchant",
        "date": "2026-01-29"
    }
    
    print(f"\nAdding transaction: {new_tx}")
    try:
        result = DynamoDBService.add_transaction(new_tx)
        if result:
            print("✅ Add Transaction successful.")
        else:
            print("❌ Add Transaction returned False.")
    except Exception as e:
        print(f"❌ Add Transaction failed: {e}")

    # 3. Get Transactions
    print("\nFetching all transactions...")
    try:
        items = DynamoDBService.get_all_transactions()
        print(f"Items found: {len(items)}")
        
        found = False
        for item in items:
            print(f"- {item}")
            if item.get('id') == new_tx['id']:
                found = True
        
        if found:
            print("✅ Verification: created transaction found in scan results.")
        else:
            print("❌ Verification: created transaction NOT found in scan results (eventual consistency delay might apply).")
            
    except Exception as e:
        print(f"❌ Get Transactions failed: {e}")

if __name__ == "__main__":
    test_dynamodb()
