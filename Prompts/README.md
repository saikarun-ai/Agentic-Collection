# Prompts and Templates Directory

Welcome to the **Prompts & Templates** module of the AI Agents and Automation Development Hub.

Prompts are the instructions, constraints, and templates that guide LLM behaviors and ensure highly deterministic and structured outputs. In the context of Model Context Protocol (MCP) and agentic loops, prompts are treated as first-class, dynamic resources that can accept parameters and integrate with external state.

---

## What is an MCP Prompt?

In the Model Context Protocol (MCP), a **Prompt** is a reusable prompt template exposed by an MCP Server (or managed directly by an MCP Host) that can take arguments from the client, compile them into a formatted prompt string, and feed them to the LLM.

### Benefits of Structuring Prompts:
1. **Consistency**: Ensure your agents follow the same core instructions and system boundaries across runs.
2. **Dynamic Interpolation**: Pass real-time inputs (like user query, schema, or system state) directly into the templates.
3. **Decoupling**: Keep your prompt templates separated from your core application logic.

---

## Template Formats

In this repository, we support two main template formats:
- **Plain Text (`.txt`)**: Best for simple, multi-line system prompts or conversational instructions.
- **JSON Templates (`.json`)**: Best for structured templates that define variable placeholders, descriptions, and user vs system roles explicitly.
