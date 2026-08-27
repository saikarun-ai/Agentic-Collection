# ReAct Agent implementation
# Implements Thought -> Action -> Observation -> Thought loop.
from typing import Callable, Dict, Any, List, Optional
import json

class ReActAgent:
    """
    ReAct (Reasoning and Acting) Agent implementation.
    Executes tasks in a Thought -> Action -> Observation -> Thought loop.
    Supports both multi-step tool reasoning and a simplified single-turn execution mode.
    """
    def __init__(self, name: str = "ReActAgent", tools: Optional[Dict[str, Callable]] = None, max_iterations: int = 5):
        self.name = name
        self.tools: Dict[str, Callable] = tools or {}
        self.max_iterations = max_iterations
        self.history: List[Dict[str, Any]] = []

    def register_tool(self, name: str, func: Callable) -> None:
        """Register a tool/function that the agent can execute."""
        self.tools[name] = func

    def parse_action(self, action_str: str) -> tuple[Optional[str], dict]:
        """
        Parse an action string of format:
        Action: <tool_name> <json_args> or <tool_name>(<json_args>)
        """
        action_str = action_str.strip()
        if not action_str.startswith("Action:"):
            return None, {}

        raw_action = action_str[len("Action:"):].strip()
        parts = raw_action.split(" ", 1)
        tool_name = parts[0].strip()
        args = {}
        if len(parts) > 1:
            try:
                args = json.loads(parts[1].strip())
            except json.JSONDecodeError:
                args = {"raw": parts[1].strip()}
        return tool_name, args

    def execute_simple(self, task: str, prompt_handler: Optional[Callable[[str], str]] = None) -> Dict[str, Any]:
        """
        Simplified single-turn code approach for direct agent execution without multi-step loops.

        :param task: The user task or prompt.
        :param prompt_handler: Optional simple function converting user prompt into direct response.
        :return: Execution summary with output.
        """
        self.history = [{"role": "user", "content": task}]
        if prompt_handler:
            response = prompt_handler(task)
        else:
            response = f"Simple Response for task: {task}"

        self.history.append({"role": "assistant", "content": response})
        return {
            "status": "completed",
            "mode": "simple",
            "output": response,
            "iterations": 1,
            "history": self.history
        }

    def execute(self, task: str, llm_callback: Optional[Callable[[List[Dict[str, Any]]], str]] = None, simple_mode: bool = False) -> Dict[str, Any]:
        """
        Execute the task using either the simplified single-turn mode or standard Thought-Action-Observation loop.

        :param task: The user task or goal description.
        :param llm_callback: Callable simulating the LLM decision step. Returns text containing Thought/Action or final answer.
        :param simple_mode: If True, uses the simplified single-step approach.
        :return: Execution summary with output and step history.
        """
        if simple_mode or self.max_iterations == 1:
            handler = (lambda prompt: llm_callback([{"role": "user", "content": prompt}])) if llm_callback else None
            return self.execute_simple(task, prompt_handler=handler)

        self.history = [{"role": "user", "content": task}]
        iterations = 0

        while iterations < self.max_iterations:
            iterations += 1

            if llm_callback:
                response = llm_callback(self.history)
            else:
                # Default fallback response generation if no LLM callback provided
                response = f"Thought: I need to complete task '{task}'. Final Answer: Completed task automatically."

            self.history.append({"role": "assistant", "content": response})

            if "Action:" in response:
                action_lines = [line.strip() for line in response.split("\n") if line.strip().startswith("Action:")]
                if action_lines:
                    action_line = action_lines[0]
                    tool_name, tool_args = self.parse_action(action_line)

                    if tool_name and tool_name in self.tools:
                        try:
                            observation = self.tools[tool_name](**tool_args)
                            obs_str = f"Observation: {observation}"
                        except Exception as e:
                            obs_str = f"Observation: Error executing tool '{tool_name}': {str(e)}"
                    else:
                        obs_str = f"Observation: Error - Tool '{tool_name}' not found."

                    self.history.append({"role": "user", "content": obs_str})
                    continue

            # Reached final answer or completion
            final_answer = response.split("Final Answer:")[-1].strip() if "Final Answer:" in response else response
            return {
                "status": "completed",
                "mode": "standard",
                "output": final_answer,
                "iterations": iterations,
                "history": self.history
            }

        return {
            "status": "max_iterations_reached",
            "mode": "standard",
            "output": self.history[-1]["content"],
            "iterations": iterations,
            "history": self.history
        }
