# Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open standard that enables developers to build secure, bidirectional connections between data sources and AI models. Created to address the challenge of data fragmentation, MCP acts as a universal link, connecting Large Language Models (LLMs) to tools, databases, and APIs.

This directory serves as a guide, reference, and hub for implementing MCP-based connections to supercharge AI agents and automations.

---

## Table of Contents
- [Core Architecture](#core-architecture)
- [Key Components](#key-components)
  - [MCP Hosts (Clients)](#mcp-hosts-clients)
  - [MCP Servers](#mcp-servers)
  - [Data Sources](#data-sources)
- [Standard Protocol Capabilities](#standard-protocol-capabilities)
  - [1. Prompts](#1-prompts)
  - [2. Resources](#2-resources)
  - [3. Tools](#3-tools)
- [How to Set Up an MCP Server](#how-to-set-up-an-mcp-server)
- [Best Practices](#best-practices)
- [Additional Resources](#additional-resources)

---

## Core Architecture

MCP operates on a client-server architecture. The "Client" (or Host) is typically an LLM application or runtime (like Claude Desktop, Cursor, or a custom agent framework), and the "Server" is a lightweight utility that exposes data, prompts, or tools via the protocol.

```
┌──────────────────┐          MCP          ┌────────────────────┐
│                  │  ──────────────────>  │                    │
│   MCP Client     │                       │    MCP Server      │
│  (Host / Agent)  │  <──────────────────  │ (Tools/Data Source)│
│                  │                       │                    │
└──────────────────┘                       └────────────────────┘
```

The communication is asynchronous and relies on JSON-RPC 2.0 over standard transports, such as:
- **Stdio**: Standard input/output (most common for local integrations).
- **SSE**: Server-Sent Events (often used for remote or web-based services).

---

## Key Components

### MCP Hosts (Clients)
An MCP Host is any software that integrates LLMs and orchestrates communication with MCP Servers.
* **Responsibilities**:
  * Managing connection lifecycles.
  * Maintaining user permission boundaries (e.g., asking before executing a tool).
  * Formatting context (prompts, resources) and sending it to the model.
* **Examples**: Claude Desktop, Cursor IDE, Windsurf, custom Python/TypeScript LLM orchestration pipelines.

### MCP Servers
An MCP Server is a lightweight process or service that exposes resources, prompts, and executable tools.
* **Responsibilities**:
  * Declaring capabilities to the client upon initialization.
  * Safely executing tool calls on the underlying operating system or API.
  * Returning structured text or image payloads back to the client.
* **Examples**: Filesystem access server, GitHub Integration server, PostgreSQL database server, Google Search server.

### Data Sources
Data sources represent the actual systems or information stores that the MCP Server accesses. This includes local files, SQLite/PostgreSQL databases, web APIs, cloud services, and custom enterprise tools.

---

## Standard Protocol Capabilities

The Model Context Protocol supports three main primitives:

### 1. Prompts
Pre-defined templates that guide the LLM's behavior or provide ready-made workflows.
* **Example**: A "code review" prompt that prepopulates the conversation with guidelines and expects files to analyze as inputs.

### 2. Resources
A way to expose read-only data sources to the LLM. Think of this as the "context-loading" mechanism.
* **Formats**: Can be text or binary data (e.g., images).
* **Identifier**: Identified using standard URIs (e.g., `file:///workspace/src/app.ts` or `postgres://db/table/schema`).

### 3. Tools
Executable functions that allow the LLM to interact with external systems and modify state. Tools require explicit user approval before execution.
* **Example**: Writing/saving a file, creating a GitHub pull request, running a terminal command, or calling a third-party API.

---

## How to Set Up an MCP Server

Below is a quick overview of how to configure and run an MCP server.

### 1. Configuration (Local Integration)
If you are using Claude Desktop, you can configure local MCP servers in your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "my-sqlite-db": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "--db-path",
        "/path/to/my/database.db"
      ]
    },
    "my-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### 2. Creating a Custom MCP Server (Node.js Example)
You can quickly build a TypeScript/Node.js MCP server using the official SDK:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "calculator-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_numbers",
        description: "Adds two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "add_numbers") {
    const { a, b } = request.params.arguments as { a: number; b: number };
    return {
      content: [
        {
          type: "text",
          text: `Result: ${a + b}`,
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

// Start the server over stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## Best Practices

1. **Security First**: Limit scope and permissions for every server. For example, if a tool only needs to read files, do not give it write access. Use strict sandboxing where possible.
2. **Clear Schema Descriptions**: Models rely entirely on descriptions to understand when and how to call tools. Be descriptive and precise in tool input schemas.
3. **Structured Outputs**: Handle errors gracefully and return descriptive error messages in JSON-RPC formats so the model can self-correct when appropriate.
4. **Idempotence**: Aim to make tool calls idempotent, meaning calling them multiple times with the same inputs results in the same outcome without unintended side effects.

---

## Additional Resources

- **Official Protocol Specification**: [Model Context Protocol GitHub](https://github.com/modelcontextprotocol)
- **Pre-built Servers**: Explore community-contributed MCP servers for databases, APIs, git providers, and shell environments.
- **SDKs**: Official SDK support is available in both **TypeScript/JavaScript** and **Python**.
