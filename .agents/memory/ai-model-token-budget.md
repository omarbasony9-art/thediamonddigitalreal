---
name: AI model token budget
description: gpt-5.6-terra is a reasoning model; it needs a large max_completion_tokens budget or it silently returns empty content.
---

## Rule
Always use `max_completion_tokens: 32000` (or higher) when calling `gpt-5.6-terra`.

**Why:** `gpt-5.6-terra` is a reasoning model. It spends tokens on internal chain-of-thought before writing output. With `max_completion_tokens: 8192`, it consumed all 8192 on reasoning (`reasoning_tokens: 8192`, `finish_reason: "length"`) and produced empty content (`content: ""`). 32000 gives it room for ~8k reasoning + ~24k output.

**How to apply:** In `aiBuilder.ts` and any future OpenAI calls using this model, set `max_completion_tokens: 32000`. Never lower it below 16000 for this model unless the prompt is intentionally minimal.
