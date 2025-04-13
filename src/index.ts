import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { upsetServerAndGetAuthUrl, shouldGetToken } from "./util/authorize";
import { z } from "zod";
import { getCalendarWithToken } from "./util/getThisWeek";

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

// server.tool(
//   "exchangeCodeForToken",
//   "Exchange the authorization code for an access token.",
//   {
//     code: z.string().describe("Authorization code from Google"),
//   },
//   async ({ code }) => {
//     const token = exchangeCodeForToken(code);

//     return {
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(token),
//         },
//       ],
//     };
//   }
// )

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


// server.tool(
//   "get-calendar",
//   {
//     start: z.date(),
//     end: z.date(),
//   },

//   async ({ start, end }) => {
//     const startDate = start.toISOString();
//     const endDate = end.toISOString();

//     // Simulate fetching calendar events
//     const events = [
//       { id: 1, title: "Meeting", start: startDate, end: endDate },
//       { id: 2, title: "Lunch", start: startDate, end: endDate },
//     ];

//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify(events.map(event => ({ id: event.id, title: event.title, start: event.start, end: event.end })))
//       }],
//     };
//   }
// )

// const transport = new StdioServerTransport();
// await server.connect(transport);