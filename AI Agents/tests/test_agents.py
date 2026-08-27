import pytest
import sys
import os

# Add parent directory to sys.path so we can import AI Agents modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.react_agent import ReActAgent
from agents.orchestrator_agent import OrchestratorAgent


def test_react_agent_tool_execution():
    agent = ReActAgent(name="TestReAct")

    def add(a: int, b: int) -> int:
        return a + b

    agent.register_tool("add", add)

    def mock_llm(history):
        if len(history) == 1:
            return 'Thought: Need to add numbers.\nAction: add {"a": 5, "b": 10}'
        else:
            return "Thought: Task complete. Final Answer: 15"

    result = agent.execute("What is 5 + 10?", llm_callback=mock_llm)
    assert result["status"] == "completed"
    assert result["output"] == "15"
    assert result["iterations"] == 2


def test_react_agent_missing_tool():
    agent = ReActAgent(name="TestReAct")

    def mock_llm(history):
        if len(history) == 1:
            return 'Thought: Using non-existent tool.\nAction: unknown_tool {"query": "test"}'
        else:
            return "Thought: Stopping after error. Final Answer: Handled missing tool."

    result = agent.execute("Run missing tool", llm_callback=mock_llm)
    assert result["status"] == "completed"
    assert "Error - Tool 'unknown_tool' not found." in agent.history[2]["content"]


def test_react_agent_simple_execution():
    agent = ReActAgent(name="TestSimpleReAct")
    result = agent.execute("Simple summary task", simple_mode=True)
    assert result["status"] == "completed"
    assert result["mode"] == "simple"
    assert result["iterations"] == 1
    assert "Simple Response for task:" in result["output"]


def test_orchestrator_agent_pipeline():
    orchestrator = OrchestratorAgent()
    worker1 = ReActAgent(name="Worker1")
    worker2 = ReActAgent(name="Worker2")

    orchestrator.register_worker("worker_1", worker1)
    orchestrator.register_worker("worker_2", worker2)

    def mock_llm_worker1(history):
        return "Thought: Completed step 1. Final Answer: Step 1 Done"

    def mock_llm_worker2(history):
        return "Thought: Completed step 2. Final Answer: Step 2 Done"

    pipeline = [
        {"step": 1, "worker": "worker_1", "task": "Task 1", "llm_callback": mock_llm_worker1},
        {"step": 2, "worker": "worker_2", "task": "Task 2 using {step_1_output}", "llm_callback": mock_llm_worker2}
    ]

    result = orchestrator.run(pipeline)
    assert result["status"] == "completed"
    assert len(result["pipeline_results"]) == 2
    assert result["pipeline_results"][0]["result"]["output"] == "Step 1 Done"
    assert result["pipeline_results"][1]["result"]["output"] == "Step 2 Done"


def test_orchestrator_unregistered_worker():
    orchestrator = OrchestratorAgent()
    pipeline = [{"step": 1, "worker": "missing_worker", "task": "Task 1"}]

    result = orchestrator.run(pipeline)
    assert result["status"] == "failed"
    assert "Worker 'missing_worker' is not registered." in result["error"]
