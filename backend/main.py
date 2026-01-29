from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
from pydantic import BaseModel
from typing import List, Optional
from services.rag_service import RAGService
from services.data_prep_service import DataPrepService
from services.agents.orchestrator import AgentOrchestrator
from services.smartspend_service import SmartSpendEngine
from services.db_service import DynamoDBService

app = FastAPI()

# Initialize DB on startup
# In a real prod app, use lifespan context manager
try:
    DynamoDBService.init_table()
except Exception as e:
    print(f"Warning: DB Init failed: {e}")

# CORS Setup
origins = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    context: List[str]

class SpendingItem(BaseModel):
    id: int
    category: str
    amount: float
    date: str
    merchant: str

class SmartSpendRequest(BaseModel):
    amount: float
    category: str

# Mock Raw Data
RAW_SPENDING = [
    {"id": 1, "category": "Uncategorized", "amount": 25.50, "date": "2023-10-25", "merchant": "Burger King #123"},
    {"id": 2, "category": "Transport", "amount": 12.00, "date": "2023-10-26", "merchant": "UBER *TRIP"},
    {"id": 3, "category": "Retail", "amount": 150.00, "date": "2023-10-27", "merchant": "AMZN Mktp US"},
    {"id": 4, "category": "Uncategorized", "amount": 80.00, "date": "2023-10-01", "merchant": "City Electric Co"},
    {"id": 5, "category": "Groceries", "amount": 45.00, "date": "2023-10-28", "merchant": "Whole Foods Market"},
]

# Endpoints

from services.transaction_service import TransactionService

@app.get("/")
def read_root():
    return {"message": "Financial Digital Twin API (Powered by IBM Watsonx & AWS)"}

@app.get("/api/spending", response_model=List[SpendingItem])
def get_spending():
    # Fetch from Service (cleaned in real-time or stored cleaned)
    # Ideally DataPrepService would wrap this, but for now direct is fine as data is clean-ish
    raw_data = TransactionService.get_all_transactions()
    cleaned_data = DataPrepService.clean_data(raw_data)
    return cleaned_data

@app.post("/api/chat", response_model=ChatResponse)
def chat_genai(request: ChatRequest):
    # 0. Transaction Extraction Layer
    new_tx = TransactionService.extract_from_message(request.message)
    
    if new_tx:
        response_text = f"✅ Recorded transaction: ${new_tx['amount']} for {new_tx['category']} at {new_tx['merchant']}."
        context = [] # Clean response, no JSON dumping
        return {"response": response_text, "context": context}

    # 1. RAG Retrieval Layer

    context = RAGService.retrieve_context(request.message)
    
    # 2. Agentic Module Execution
    response_text = AgentOrchestrator.process_request(request.message, context)
    
    return {"response": response_text, "context": context}

@app.post("/api/smartspend")
def check_smartspend(request: SmartSpendRequest):
    # SmartSpend Real-Time Engine
    return SmartSpendEngine.check_spending(request.amount, request.category)

@app.get("/api/profile")
def get_profile():
    return {
        "name": "Jane Doe",
        "income": 5000,
        "savings": 12000,
        "debt": 500,
        "goals": ["Buy a Car", "Europe Trip"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
