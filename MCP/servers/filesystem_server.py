# Local Filesystem MCP Server
# Exposes read and write filesystem capabilities to LLM clients.
import os

def list_directory(path: str):
    return os.listdir(path)
