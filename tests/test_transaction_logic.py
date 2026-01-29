import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from services.transaction_service import TransactionService

def test_extraction():
    print("Testing extraction logic...")
    
    # Test Case 1: Standard
    msg1 = "I spent $50.00 on Food at Walmart"
    res1 = TransactionService.extract_from_message(msg1)
    assert res1 is not None
    assert res1['amount'] == 50.00
    assert res1['category'] == "Food"
    assert res1['merchant'] == "Walmart"
    print(f"PASS: {msg1} -> {res1}")

    # Test Case 2: No decimals, different preposition
    msg2 = "Paid $20 for Taxi via Uber"
    res2 = TransactionService.extract_from_message(msg2)
    assert res2 is not None
    assert res2['amount'] == 20.0
    assert res2['category'] == "Taxi"
    assert res2['merchant'] == "Uber"
    print(f"PASS: {msg2} -> {res2}")

    # Test Case 3: Invalid
    msg3 = "Hello world"
    res3 = TransactionService.extract_from_message(msg3)
    assert res3 is None
    print(f"PASS: {msg3} -> None")

    print("\nAll tests passed!")

if __name__ == "__main__":
    test_extraction()
