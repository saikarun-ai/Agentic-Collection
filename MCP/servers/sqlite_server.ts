// SQLite DB MCP Server
// Exposes database schema querying and execute_query actions.
export function executeQuery(dbPath: string, sql: string) {
    // mock execution
    return { success: true, rows: [] };
}
