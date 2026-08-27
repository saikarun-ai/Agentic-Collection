# Orchestrator Agent implementation
# Coordinates multiple sub-agents to complete complex task graphs.
from typing import Dict, List, Any, Optional, Union
from .react_agent import ReActAgent

class OrchestratorAgent:
    """
    Orchestrator Agent implementation.
    Coordinates multiple worker agents (such as ReActAgent instances) to execute multi-step pipelines or task DAGs.
    """
    def __init__(self, name: str = "OrchestratorAgent", workers: Optional[Dict[str, Any]] = None):
        self.name = name
        self.workers: Dict[str, Any] = workers or {}

    def register_worker(self, worker_name: str, agent_instance: Any) -> None:
        """Register a worker agent under a given name."""
        self.workers[worker_name] = agent_instance

    def run(self, pipeline: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Execute a pipeline of tasks across registered worker agents.

        :param pipeline: List of task step dictionaries, e.g.:
                         [
                             {"step": 1, "worker": "search_agent", "task": "Find top Python APIs"},
                             {"step": 2, "worker": "summarizer_agent", "task": "Summarize findings"}
                         ]
        :return: Execution summary including results of each step and final status.
        """
        results = []
        context = {}

        for step_idx, step in enumerate(pipeline, 1):
            worker_name = step.get("worker")
            task_desc = step.get("task", "")

            # Interpolate context into task description if placeholders present
            for k, v in context.items():
                task_desc = task_desc.replace(f"{{{k}}}", str(v))

            if worker_name not in self.workers:
                return {
                    "status": "failed",
                    "error": f"Worker '{worker_name}' is not registered.",
                    "completed_steps": results
                }

            worker = self.workers[worker_name]

            # Execute worker agent task
            if hasattr(worker, "execute") and callable(worker.execute):
                llm_cb = step.get("llm_callback")
                step_result = worker.execute(task_desc, llm_callback=llm_cb) if llm_cb else worker.execute(task_desc)
            elif callable(worker):
                step_result = {"status": "completed", "output": worker(task_desc)}
            else:
                return {
                    "status": "failed",
                    "error": f"Worker '{worker_name}' is neither an agent with execute() nor callable.",
                    "completed_steps": results
                }

            output = step_result.get("output") if isinstance(step_result, dict) else str(step_result)
            context[f"step_{step_idx}_output"] = output

            results.append({
                "step": step_idx,
                "worker": worker_name,
                "task": task_desc,
                "result": step_result
            })

            if isinstance(step_result, dict) and step_result.get("status") == "failed":
                return {
                    "status": "failed",
                    "error": f"Step {step_idx} failed.",
                    "completed_steps": results
                }

        return {
            "status": "completed",
            "pipeline_results": results,
            "final_output": results[-1]["result"] if results else None
        }
