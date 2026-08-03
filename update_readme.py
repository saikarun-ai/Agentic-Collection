import os
import re

def count_files_in_dir(directory):
    if not os.path.exists(directory):
        return 0
    # Count only files (not directories)
    count = 0
    for root, dirs, files in os.walk(directory):
        for f in files:
            # Skip hidden files or README files if necessary, or count everything
            if not f.startswith('.'):
                count += 1
    return count

def update_readme():
    mcp_servers_count = count_files_in_dir('MCP/servers')
    ai_agents_count = count_files_in_dir('AI Agents/agents')
    prompts_count = count_files_in_dir('Prompts/templates')

    stats_block = f"""<!-- STATS_START -->
| Component | Directory | Count |
| --- | --- | --- |
| 🔌 **MCP Servers** | `MCP/servers/` | **{mcp_servers_count}** |
| 🧠 **AI Agents** | `AI Agents/agents/` | **{ai_agents_count}** |
| 📝 **Prompts & Templates** | `Prompts/templates/` | **{prompts_count}** |
<!-- STATS_END -->"""

    readme_path = 'README.md'
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if placeholders exist in README.md, if not, we append them in a nice section
    pattern = re.compile(r'<!-- STATS_START -->.*?<!-- STATS_END -->', re.DOTALL)
    if pattern.search(content):
        new_content = pattern.sub(stats_block, content)
    else:
        # Find a good spot to insert. We can insert it right after the Repository Structure section or before the Core Concepts section.
        # Let's insert it before the "Core Concepts to Get Started" header.
        insert_marker = "## Core Concepts to Get Started"
        if insert_marker in content:
            stats_section = f"## Repository Dashboard & Statistics\n\nThis table is dynamically generated to display the live count of resources in this project:\n\n{stats_block}\n\n---\n\n"
            new_content = content.replace(insert_marker, stats_section + insert_marker)
        else:
            # fallback append to the end
            new_content = content + f"\n\n## Repository Dashboard & Statistics\n\n{stats_block}\n"

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully updated README.md with live statistics!")

if __name__ == '__main__':
    update_readme()
