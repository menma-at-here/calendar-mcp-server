import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { authorize } from "./authorize";

vi.mock("fs");
vi.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(() => ({
        setCredentials: vi.fn(),
        generateAuthUrl: vi.fn(() => "http://example.com/auth"),
        getToken: vi.fn(() => Promise.resolve({ tokens: { access_token: "test-token" } })),
      })),
    },
  },
}));

const mockRootDir = path.join(__dirname, "../..");
const mockTokenPath = path.join(mockRootDir, "token.json");
const mockCredentialPath = path.join(mockRootDir, "credentials.json");

describe("authorize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("既存のトークンが存在する場合、OAuth2Client を返す", async () => {
    const mockToken = { access_token: "test-token" };
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === mockTokenPath) return JSON.stringify(mockToken);
      if (filePath === mockCredentialPath)
        return JSON.stringify({
          installed: {
            client_id: "test-client-id",
            client_secret: "test-client-secret",
            redirect_uris: ["http://localhost"],
          },
        });
      return "";
    });

    const client = await authorize();
    expect(client).toBeDefined();
    expect(client.setCredentials).toHaveBeenCalledWith(mockToken);
  });

  it("トークンが存在しない場合、新規認証フローを実行する", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === mockCredentialPath)
        return JSON.stringify({
          installed: {
            client_id: "test-client-id",
            client_secret: "test-client-secret",
            redirect_uris: ["http://localhost"],
          },
        });
      return "";
    });

    const mockWriteFileSync = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    const client = await authorize();

    expect(client).toBeDefined();
    expect(client.generateAuthUrl).toHaveBeenCalled();
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      mockTokenPath,
      JSON.stringify({ access_token: "test-token" })
    );
  });
});
