# Financial Digital Twin API

A comprehensive solution for personal financial management, featuring spending analysis, Generative AI chat assistance, and real-time smart spending checks.

## Features

- **Spending Analysis**: Categorize and view spending habits using cleaned and synthesized data.
- **GenAI Financial Assistant**: Chat with an AI agent (RAG-enabled) to get insights into your financial health.
- **SmartSpend Check**: Real-time evaluation of potential purchases against your current financial status.
- **Profile Management**: View financial profiles including income, savings, and goals.

## Technology Stack

- **Backend**: Python, FastAPI
- **Frontend**: React, Vite
- **AI/ML**: RAG Service (Retrieval-Augmented Generation), Agent Orchestrator

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js & npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (recommended):
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   - **Standard Mode**:
     ```bash
     python main.py
     ```
   - **Development Mode (Auto-Reload)**:
     ```bash
     uvicorn main:app --reload
     ```
   The backend API will run on `http://localhost:8000`.

   > **Note**: The AI services (RAG, IBM Granite) are currently running in **Mock Mode** for demonstration purposes. No API keys are required to run the project.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible via the URL provided in the terminal (usually `http://localhost:5173`).

## API Endpoints

- `GET /`: API Root message.
- `GET /api/spending`: Retrieve cleaned spending data.
- `GET /api/profile`: Retrieve user financial profile.
- `POST /api/chat`: Send a message to the GenAI assistant.
- `POST /api/smartspend`: Check a specific spending amount and category.
