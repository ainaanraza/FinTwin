from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from dotenv import load_dotenv
import os
from io import BytesIO
from datetime import datetime
from collections import defaultdict

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import LETTER
from reportlab.lib import colors
from reportlab.lib.units import inch

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


def _aggregate_category_totals(transactions):
    category_totals = defaultdict(float)
    for item in transactions:
        category_totals[item.get("category", "Other")] += float(item.get("amount", 0))
    # return top 5
    return sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:5]


def _build_summary_pdf(spending_data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER

    # Header
    c.setFillColor(colors.HexColor('#0f172a'))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(1 * inch, height - 1 * inch, "FinTwin Spending Summary")
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.gray)
    c.drawString(1 * inch, height - 1.25 * inch, f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")

    # Basic stats
    total_amount = sum(item.get("amount", 0) for item in spending_data)
    num_tx = len(spending_data)
    avg_tx = total_amount / num_tx if num_tx else 0

    c.setFillColor(colors.HexColor('#111827'))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1 * inch, height - 1.75 * inch, "At-a-glance")
    c.setFont("Helvetica", 11)
    c.drawString(1 * inch, height - 2.05 * inch, f"Total spend: ${total_amount:,.2f}")
    c.drawString(1 * inch, height - 2.3 * inch, f"Transactions: {num_tx}")
    c.drawString(1 * inch, height - 2.55 * inch, f"Average ticket: ${avg_tx:,.2f}")

    # Category chart (simple bar chart)
    top_cats = _aggregate_category_totals(spending_data)
    if top_cats:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(1 * inch, height - 3.1 * inch, "Top categories")
        chart_x = 1 * inch
        chart_y = height - 6 * inch
        chart_width = 5 * inch
        bar_height = 0.4 * inch
        gap = 0.15 * inch
        max_val = max(val for _, val in top_cats) or 1
        for idx, (cat, val) in enumerate(top_cats):
            y = chart_y - idx * (bar_height + gap)
            bar_len = (val / max_val) * chart_width
            c.setFillColor(colors.HexColor('#0f172a'))
            c.roundRect(chart_x, y, bar_len, bar_height, 4, stroke=0, fill=1)
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(chart_x + 6, y + bar_height / 2 - 3, f"{cat}")
            c.setFillColor(colors.HexColor('#0f172a'))
            c.setFont("Helvetica", 9)
            c.drawRightString(chart_x + chart_width + 0.75 * inch, y + bar_height / 2 - 3, f"${val:,.0f}")

    # Footer note
    c.setStrokeColor(colors.HexColor('#e5e7eb'))
    c.line(1 * inch, 0.9 * inch, width - 1 * inch, 0.9 * inch)
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.gray)
    c.drawString(1 * inch, 0.7 * inch, "FinTwin • AI spending insight snapshot")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

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


@app.get("/api/export-summary")
def export_summary():
    """Generate a simple one-page PDF of spending stats and top categories."""
    raw_data = TransactionService.get_all_transactions()
    cleaned_data = DataPrepService.clean_data(raw_data)
    pdf_buffer = _build_summary_pdf(cleaned_data)
    pdf_bytes = pdf_buffer.getvalue()
    headers = {"Content-Disposition": "attachment; filename=finTwin-summary.pdf"}
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

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
