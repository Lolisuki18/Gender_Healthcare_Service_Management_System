from mcp.server.fastmcp import FastMCP

mcp = FastMCP("genderhealth")

@mcp.tool()
def hello(name: str) -> str:
    """Chào user bằng tên."""
    return f"Xin chào, {name}! Đây là MCP server của GenderHealth."

if __name__ == "__main__":
    mcp.run(transport='stdio') 