from services.bedrock_service import BedrockService
from services.rag_service import RAGService

class AgentOrchestrator:
    """
    Coordinates the multiple intelligent agents (Scenario, Simulation, Risk, Advisor)
    as defined in the Agentic AI Architecture.
    """
    
    @staticmethod
    def process_request(user_input: str, context: list = None):
        # 1. Intent Recognition (using Bedrock)
        # Simple heuristic for now, could be LLM based
        intent = "general_advice"
        if "risk" in user_input.lower():
            intent = "risk_assessment"
        elif "simulate" in user_input.lower() or "what if" in user_input.lower():
            intent = "scenario_simulation"
            
        # 2. Routing to Agents
        if intent == "risk_assessment":
            return RiskAgent.analyze(user_input)
        elif intent == "scenario_simulation":
            return SimulationAgent.run_simulation(user_input)
        else:
            return AdvisorAgent.provide_advice(user_input, context)

class RiskAgent:
    @staticmethod
    def analyze(query: str):
        # Specific logic for risk
        return BedrockService.generate_response(f"Analyze risk for request: {query}")

class SimulationAgent:
    @staticmethod
    def run_simulation(query: str):
        # Specific logic for simulation (Monte Carlo mock)
        return BedrockService.generate_response(f"Simulate scenario: {query}. Provide a concise outcome.")

class AdvisorAgent:
    @staticmethod
    def provide_advice(query: str, context: list):
        # General advice combining RAG context
        context_str = " ".join(context) if context else ""
        return BedrockService.generate_response(f"Context: {context_str}. User Query: {query}. Provide helpful financial advice.")
