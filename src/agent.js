import { createTextEvent, createDoneEvent } from "@copilot-extensions/preview-sdk";

const SYSTEM_PROMPT = `You are a senior software engineer conducting code reviews.
When given a code snippet or diff:
- Identify bugs, security issues, and performance problems
- Suggest idiomatic improvements and better naming
- Note missing tests or edge cases
- Be concise: lead with the most critical finding
- Format feedback as a numbered list when there are multiple issues
- If the code looks good, say so briefly and explain why`;

/**
 * Streams a code-review response back to the Copilot chat UI.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} token  GitHub user token forwarded by Copilot
 * @param {import("express").Response} res
 */
export async function createReviewAgent(messages, token, res) {
  const response = await fetch("https://api.githubcopilot.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Copilot API error ${response.status}: ${err}`);
  }

  // Forward the streamed chunks from Copilot to the caller
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        res.write(`${line}\n\n`);
      }
    }
  }

  res.write(`data: ${createDoneEvent()}\n\n`);
}
