# Backend Setup Guide

## ⚠️ Important: Credentials
This project uses **AWS Bedrock** and **AWS DynamoDB**. To run it locally, you need AWS credentials.
For security reasons, the `.env` file containing these keys is **NOT** included in the repository.

## 🚀 Setup Instructions for New Developers

1.  **Clone the repository**.
2.  Navigate to the `backend` folder.
3.  **Create your Environment File**:
    - Copy `.env.example` to a new file named `.env`.
    - **Windows Command**: `copy .env.example .env`
    - **Mac/Linux Command**: `cp .env.example .env`
4.  **Edit `.env`**:
    - Open `.env` in your text editor.
    - Paste the **AWS Access Key** and **Secret Key** provided by the team lead/hackathon organizer.
    
    ```ini
    AWS_ACCESS_KEY_ID=YOUR_KEY_HERE
    AWS_SECRET_ACCESS_KEY=YOUR_SECRET_HERE
    AWS_DEFAULT_REGION=us-east-1
    BEDROCK_MODEL_ID=amazon.nova-pro-v1:0
    ```

5.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

6.  **Run Server**:
    ```bash
    uvicorn main:app --reload
    ```
