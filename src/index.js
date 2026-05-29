import express from "express";
import { createReviewAgent } from "./agent.js";
import { verifyRequestByKeyId } from "@copilot-extensions/preview-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", agent: "code-review-assistant" });
});

app.post("/", async (req, res) => {
  // Verify the request came from GitHub Copilot
  const signature = req.headers["github-public-key-signature"];
  const keyId = req.headers["github-public-key-identifier"];
  const body = JSON.stringify(req.body);

  if (process.env.NODE_ENV !== "development") {
    try {
      const { isValid } = await verifyRequestByKeyId(body, signature, keyId, {
        token: req.headers.authorization?.replace("Bearer ", "") ?? "",
      });
      if (!isValid) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch {
      return res.status(401).json({ error: "Signature verification failed" });
    }
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
  const messages = req.body.messages ?? [];

  try {
    await createReviewAgent(messages, token, res);
  } catch (err) {
    console.error("Agent error:", err);
    res.write(`data: ${JSON.stringify({ type: "error", error: String(err) })}\n\n`);
  } finally {
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Code review agent listening on port ${PORT}`);
});
