# Agentic Skills & Automation Guide

In the context of AI agents and task automation, a **Skill** is a modular, well-defined capability that an agent can invoke to perform a specific action, access information, or manipulate state. Skills are the building blocks of an agent's practical power. Without skills, an LLM is limited to pure conversation; with skills, it can read databases, manage codebases, check weather, edit files, and send emails.

This document describes how to design, structure, write, and register skills for your AI Agents.

---

## Anatomy of a Skill

A robust skill consists of four core elements:

1. **The Declaration (Metadata)**: A clear name, description, and parameter schema that tells the LLM *what* the skill is and *how* to invoke it.
2. **The Logic (Implementation)**: The actual code (Python, TypeScript, bash, etc.) that executes when the skill is called.
3. **The Validation (Error Handling)**: Robust defense mechanisms to handle bad inputs, networking failures, and permission denials safely.
4. **The Response Output**: Structured, LLM-readable responses that describe the outcome of the action.

```
       ┌─────────────────────────────────────────────────────────┐
       │                       SKILL                             │
       │                                                         │
       │  ┌───────────────────────┐   ┌───────────────────────┐  │
       │  │      Declaration      │   │      Validation       │  │
       │  │ (Schema, Description) │   │ (Type-checks, Limits) │  │
       │  └───────────────────────┘   └───────────────────────┘  │
       │                                                         │
       │  ┌───────────────────────┐   ┌───────────────────────┐  │
       │  │      Core Logic       │   │    Structured Output  │  │
       │  │     (Code, APIs)      │   │   (Response payload)  │  │
       │  └───────────────────────┘   └───────────────────────┘  │
       └─────────────────────────────────────────────────────────┘
```

---

## Designing a High-Quality Skill

To make a skill highly effective for LLMs:

* **Write Crystal-Clear Descriptions**: The LLM relies on descriptions to determine when to call a tool. Be extremely explicit. (e.g., Instead of "get info", use "gets detailed information about a GitHub repository including stars, forks, and open issues").
* **Keep Parameters Simple**: Minimize nested structures. Prefer flat key-value pairs where possible. Include docstrings or descriptions for every parameter.
* **Favour Idempotency**: Running a skill twice with the same arguments should ideally produce the same outcome or be safe to execute multiple times (e.g., a "Create Folder" skill should not crash if the folder already exists).
* **Handle Errors Gracefully**: Never crash the host application. Catch exceptions and return a helpful string telling the model what went wrong, giving it a chance to self-correct and try again.

---

## Structuring Skills

We recommend organizing your agentic skills in a dedicated directory structure:

```
skills/
├── __init__.py           # Exports and bundles all skills
├── base.py               # Abstract base classes and decorators
├── file_operations.py    # Grouped skills: write_file, read_file, search_file
├── web_scraping.py       # Grouped skills: fetch_url, search_google
└── database.py           # Grouped skills: query_sqlite, update_record
```

---

## Implementation Reference

Here are standard templates for writing agentic skills in both Python and TypeScript.

### Python (using Pydantic & Docstrings)

```python
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

# 1. Define the Schema using Pydantic
class CreateDirectorySchema(BaseModel):
    path: str = Field(description="The absolute or relative directory path to create.")
    exist_ok: Optional[bool] = Field(default=True, description="If True, do not raise an error if directory exists.")

# 2. Implement the Skill
def create_directory(path: str, exist_ok: bool = True) -> Dict[str, Any]:
    """
    Creates a new directory on the file system at the specified path.
    Use this skill before trying to save files in folders that do not exist yet.
    """
    import os
    try:
        os.makedirs(path, exist_ok=exist_ok)
        return {
            "success": True,
            "message": f"Successfully created directory at '{path}'"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to create directory: {str(e)}"
        }

# 3. Export as Tool metadata
create_directory_tool = {
    "name": "create_directory",
    "description": create_directory.__doc__.strip(),
    "parameters": CreateDirectorySchema.schema()
}
```

### TypeScript / JavaScript (using Zod)

```typescript
import { z } from "zod";

// 1. Define the Input Schema
export const CalculateDiscountSchema = z.object({
  originalPrice: z.number().describe("The original price of the item before discount."),
  discountPercentage: z.number().min(0).max(100).describe("The percentage discount to apply (0-100)."),
});

export type CalculateDiscountInput = z.infer<typeof CalculateDiscountSchema>;

// 2. Implement the Logic
export function calculateDiscount(args: CalculateDiscountInput) {
  try {
    const { originalPrice, discountPercentage } = args;
    const savings = originalPrice * (discountPercentage / 100);
    const finalPrice = originalPrice - savings;

    return {
      success: true,
      originalPrice,
      discountPercentage,
      savings: Number(savings.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred during calculation.",
    };
  }
}
```

---

## Registering Skills with AI Frameworks

### LangChain Custom Tool
```python
from langchain.tools import Tool

langchain_tool = Tool(
    name="Create Directory",
    func=create_directory,
    description="Creates a directory on the file system. Args: path (str), exist_ok (bool)"
)
```

### CrewAI Custom Tool
```python
from crewai.tools import tool

@tool("Create Directory")
def crew_create_directory_tool(path: str, exist_ok: bool = True) -> str:
    """Creates a folder on the filesystem at the given path."""
    res = create_directory(path, exist_ok)
    return str(res)
```

### LlamaIndex Custom Tool
```python
from llama_index.core.tools import FunctionTool

llamaindex_tool = FunctionTool.from_defaults(
    fn=create_directory,
    name="create_directory",
    description="Creates a new directory structure."
)
```

---

## Skill Development Lifecycle

1. **Identify the Need**: Determine a repeatable action or piece of state access the agent requires to complete a task.
2. **Draft the Specification**: Write the input/output schemas before coding.
3. **Mock and Sandbox**: Implement and run the code in a local or sandboxed environment.
4. **Iterative Refinement**: Test with the actual agent to see if it invokes the skill correctly under different prompting styles.
5. **Publish**: Add the tool to the agent's environment registry (e.g., via MCP or framework integrations).
