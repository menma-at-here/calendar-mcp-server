import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { upsetServerAndGetAuthUrl } from "tools/upsetServerAndGetAuthUrl";
import { shouldGetToken } from "tools/shouldGetToken";
import { getCalendarWithToken } from "tools/getCalendarWithToken";

export const server = new McpServer({
  name: "calendar-mcp-server",
  version: "1.0.0"
});


server.tool(
  "shouldGetToken",
  "Check if the token should be obtained.",
  // ツールの引数を定義するスキーマ
  async () => {
    // 認証用の関数を呼び出してトークンが必要かどうかを確認
    const isShouldGetToken = shouldGetToken();
    return {
      content: [
        {
          type: "text",
          text: isShouldGetToken.toString(),
        },
      ],
    };
  }
)

server.tool(
  "getAuthUrlAndStartServer",
  "Get the authorization URL for Google Calendar API. \n\n" + "Start the server to listen for the callback, get authentication code, get access token from the code and save the token in this MCP.",
  async () => {
    const authUrl = upsetServerAndGetAuthUrl();
    return {
      content: [
        {
          type: "text",
          text: authUrl,
        },
      ],
    };
  }
)

server.tool(
  "getCalendarWithToken",
  "Get the calendar events for the current week.",
  {
    start: z.string().date().describe("Start date for the calendar events"),
    end: z.string().date().describe("End date for the calendar events"),
  },
  async ({start, end}) => {
    const events = await getCalendarWithToken(new Date(start), new Date(end));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(events),
        },
      ],
    };
  }
)

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("callendar MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
