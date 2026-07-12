import Anthropic from "@anthropic-ai/sdk";

// Client partagé — lit ANTHROPIC_API_KEY depuis l'environnement (.env.local).
export const anthropic = new Anthropic();

export const CLAUDE_MODEL = "claude-opus-4-8";
