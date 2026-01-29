import sys
import os
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from services.bedrock_service import BedrockService

def test_bedrock_connection():
    print("Testing Bedrock Connection...")
    try:
        response = BedrockService.generate_response("Hello, this is a test. Are you working?")
        print("\n✅ Bedrock Response Successfully Received:")
        print("-" * 50)
        print(response)
        print("-" * 50)
    except Exception as e:
        print("\n❌ Bedrock Test Failed:")
        print(e)
        sys.exit(1)

def test_risk_analysis():
    print("\nTesting Risk Analysis...")
    sample_data = [{"amount": 100, "category": "Food"}, {"amount": 2000, "category": "Luxury"}]
    try:
        response = BedrockService.analyze_spending_risk(sample_data)
        print("\n✅ Risk Analysis Response:")
        print(response)
        if "risk_level" in response:
            print("Structure looks valid.")
        else:
            print("⚠️ Response structure might be unexpected.")
    except Exception as e:
        print("\n❌ Risk Analysis Test Failed:")
        print(e)

if __name__ == "__main__":
    test_bedrock_connection()
    test_risk_analysis()
