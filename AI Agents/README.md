# AI Agents Architecture and Patterns

Welcome to the **AI Agents** repository module. This directory focuses on building, structuring, and running autonomous and semi-autonomous AI Agents. It outlines standard patterns, design systems, memory integration, and execution loops to make agent development systematic and reliable.

---

## Table of Contents
- [What is an AI Agent?](#what-is-an-ai-agent)
- [Core Architecture](#core-architecture)
- [Agent Design Patterns](#agent-design-patterns)
  - [1. ReAct (Reasoning and Acting)](#1-react-reasoning-and-acting)
  - [2. Planning and Decomposition](#2-planning-and-decomposition)
  - [3. Memory Systems](#3-memory-systems)
  - [4. Tool Use (Function Calling)](#4-tool-use-function-calling)
- [Multi-Agent Architectures](#multi-agent-architectures)
- [Standard Agent Lifecycle](#standard-agent-lifecycle)
- [Implementation Reference (Python Draft)](#implementation-reference-python-draft)
- [Testing & Evaluation](#testing--evaluation)

---

## What is an AI Agent?

An **AI Agent** is an autonomous entity that perceives its environment through sensors (or inputs), makes decisions using a central reasoning core (usually an LLM), and executes actions using actuators (or tools) to achieve specific goals.

Unlike standard static chatbot interfaces, agents can:
1. Deconstruct complex instructions into smaller milestones.
2. Self-correct when an execution path fails.
3. Access external resources and databases.
4. Interact in loops until a success condition is met.

---

## Core Architecture

An agent can be modeled using the following structural formula:

$$\text{Agent} = \text{LLM / Brain} + \text{Planning} + \text{Memory} + \text{Tools}$$

```
                ┌────────────────────────┐
                │        User Goal       │
                └───────────┬────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────┐
        │        Planning & Decomposition      │
        └───────────────────┬──────────────────┘
                            │
                            ▼
     ┌────────────────────────────────────────────┐
     │                Reasoning Loop              │
     │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
     │  │  Memory  │◄─┤   Brain  ├─►│  Tools   │  │
     │  │ (Context)│  │  (LLM)   │  │ (Actions)│  │
     │  └──────────┘  └──────────┘  └──────────┘  │
     └──────────────────────┬─────────────────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │     Final Response     │
                └────────────────────────┘
```

---

## Agent Design Patterns

### 1. ReAct (Reasoning and Acting)
ReAct combines reasoning and execution steps in a tight loop. The agent thinks about what to do next, executes an action, observes the outcome, and continues the cycle.

* **Pattern Loop**: `Thought -> Action -> Observation -> Thought`
* **Advantage**: Increases transparency (traceability of thought) and improves agent accuracy by anchoring plans to real-time observations.

### 2. Planning and Decomposition
Large objectives are broken down into manageable sub-tasks.
* **Chain-of-Thought (CoT)**: Guiding the model to think step-by-step.
* **Tree of Thoughts (ToT)**: Exploring multiple reasoning paths and backtracking when necessary.
* **Task Decomposition**: Using a dedicated planning model to split a user query into a static or dynamic task graph (directed acyclic graph or DAG).

### 3. Memory Systems
Memory provides continuity across interactions, allowing the agent to persist information.
* **Short-term Memory**: The context window of the LLM. Typically maintained using conversation buffers, summary buffers, or sliding window techniques.
* **Long-term Memory**: External storage for retaining information over long periods. Achieved via:
  * **Vector Databases**: Semantic search retrieval (RAG) of past interactions.
  * **Key-Value Stores**: Specific user preferences or entity profiles.
  * **Graph Databases**: High-relational memory mapping.

### 4. Tool Use (Function Calling)
Tools enable the agent to interact with external environments. These include custom APIs, calculators, code sandboxes, web scrapers, and database connectors.
* **Definition**: Structured JSON schemas detailing parameters, types, and descriptions.
* **Execution**: The LLM outputs a tool invocation command, the agent executor catches and runs the tool, and the output is appended back to the LLM's context.

---

## Multi-Agent Architectures

When a single agent becomes too complex, a multi-agent system (MAS) can be used to segregate duties:

1. **Router Pattern**: A dispatcher directs queries to specialized agents based on user input.
2. **Orchestrator-Workers**: A supervisor agent divides a task among multiple subordinate worker agents and synthesizes their results.
3. **Collaborative / Peer-to-Peer**: Multiple agents communicate directly with each other, exchanging data and resolving disputes in a shared space.

---

## Standard Agent Lifecycle

1. **Initialize**: Load agent configuration, prompt templates, and bind tools.
2. **Perceive**: Ingest user inputs and fetch relevant context from short-term/long-term memory.
3. **Plan**: Analyze the goal and generate a strategy or task checklist.
4. **Execute**: Call tools, handle errors, and parse outputs.
5. **Observe**: Evaluate the tool output against expectations.
6. **Reflect**: Check if the goal is met. If yes, transition to output. If no, iterate.
7. **Store**: Persist the conversation history and learned lessons to Memory.

---

## Implementation Reference (Python Draft)

Here is a simplified Python model illustrating a basic ReAct execution loop:

```python
import json

class SimpleAgent:
    def __init__(self, llm_client, system_prompt, tools):
        self.llm = llm_client
        self.system_prompt = system_prompt
        self.tools = {t.__name__: t for t in tools}
        self.messages = [{"role": "system", "content": system_prompt}]

    def step(self, user_input):
        self.messages.append({"role": "user", "content": user_input})

        while True:
            # Query LLM for next step (Thought & Action)
            response = self.llm.chat(messages=self.messages)
            content = response.content
            self.messages.append({"role": "assistant", "content": content})

            # Parse if the model decided to call a tool
            if "Action:" in content:
                tool_name, tool_args = self._parse_action(content)
                if tool_name in self.tools:
                    # Execute tool
                    observation = self.tools[tool_name](**tool_args)
                    # Feed observation back to the model
                    self.messages.append({
                        "role": "user",
                        "content": f"Observation: {observation}"
                    })
                else:
                    self.messages.append({
                        "role": "user",
                        "content": f"Observation: Error - Tool {tool_name} not found."
                    })
            else:
                # No action requested, model has reached a conclusion
                return content

    def _parse_action(self, content):
        # Implementation to extract tool name & arguments from text
        # e.g., Action: calculate_tax {"income": 50000}
        pass
```

---

## Testing & Evaluation

Testing agents requires a different approach than standard software engineering due to LLM non-determinism:

* **Trajectory Evaluation**: Evaluating the step-by-step path the agent took, not just the final output.
* **Evals Frameworks**: Using tools like Ragas, Promptfoo, or custom mock environments to measure agent success rates across a variety of test datasets.
* **Mocking Tools**: Stubbing external tools (like databases or APIs) to ensure reliable and repeatable testing loops.
