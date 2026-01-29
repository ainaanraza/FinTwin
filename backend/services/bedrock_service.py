import boto3
import json
import os
import logging

logger = logging.getLogger(__name__)

class BedrockService:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._client = boto3.client(
                'bedrock-runtime',
                region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            
            # Check if credentials are loaded
            if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
                logger.error("AWS Credentials not found in environment variables.")
                raise ValueError("AWS Credentials not found. Please ensure you have a .env file locally with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")
                
        return cls._client

    @staticmethod
    def generate_response(prompt: str) -> str:
        """
        Generates a response from AWS Bedrock using Amazon Titan or Nova models.
        """
        client = BedrockService.get_client()
        model_id = os.getenv('BEDROCK_MODEL_ID', 'amazon.nova-pro-v1:0')
        
        # Construct the payload based on the model family
        # Valid models: amazon.nova-pro-v1:0, amazon.titan-tg1-large, etc.
        
        try:
            if "nova" in model_id:
                # Amazon Nova format
                # https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-nova.html
                body = {
                    "inferenceConfig": {
                        "max_new_tokens": 1000
                    },
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"text": prompt + "\n\nProvide the response in plain text without any markdown formatting, asterisks, or hashes."}
                            ]
                        }
                    ]
                }
                
                response = client.invoke_model(
                    body=json.dumps(body),
                    modelId=model_id,
                    accept="application/json",
                    contentType="application/json"
                )
                
                response_body = json.loads(response.get("body").read())
                output_text = response_body.get("output", {}).get("message", {}).get("content", [])[0].get("text")
                # Strip markdown
                output_text = output_text.replace("*", "").replace("#", "").replace("`", "")
                return output_text
                
            else:
                # Amazon Titan Text format 
                # https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-titan-text.html
                body = {
                    "inputText": prompt,
                    "textGenerationConfig": {
                        "maxTokenCount": 512,
                        "temperature": 0.7,
                        "topP": 0.9
                    }
                }
                
                response = client.invoke_model(
                    body=json.dumps(body),
                    modelId=model_id,
                    accept="application/json",
                    contentType="application/json"
                )
                
                response_body = json.loads(response.get("body").read())
                return response_body.get("results")[0].get("outputText")
                
        except Exception as e:
            logger.error(f"Error invoking Bedrock: {e}")
            return f"Error connecting to AWS Bedrock: {str(e)}"

    @staticmethod
    def analyze_spending_risk(spending_data: list) -> dict:
        """
        Analyzes spending risk using LLM instead of simple rules.
        """
        prompt = f"""
        You are a financial risk analyst. Analyze the following recent spending data and assess the risk level (High, Medium, Low).
        Provide a short reasoning.
        
        Spending Data: {json.dumps(spending_data)}
        
        Output format: JSON with keys "risk_level" and "reasoning". Do not output markdown.
        """
        
        response_text = BedrockService.generate_response(prompt)
        
        # Basic parsing or fallback
        try:
            # Clean up potential markdown code blocks
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except:
            return {"risk_level": "Unknown", "reasoning": "Could not parse AI response", "raw": response_text}
