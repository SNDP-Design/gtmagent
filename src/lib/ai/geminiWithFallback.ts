/**
 * Gemini model fallback chain.
 * Tries models in order; falls back to the next when a model is exhausted or unavailable.
 *
 * Order:
 *   gemini-2.5-pro → gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash
 */

import { getChatCompletion, getStreamingChatCompletion } from './chatCompletion';

export const GEMINI_FALLBACK_CHAIN = [
  'gemini/gemini-2.5-pro',
  'gemini/gemini-2.5-flash',
  'gemini/gemini-2.5-flash-lite',
  'gemini/gemini-2.0-flash',
] as const;

/** The default starting model — first in the chain. */
export const GEMINI_DEFAULT_MODEL = GEMINI_FALLBACK_CHAIN[0];

function isRetriableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    message.includes('429') ||
    message.includes('404') ||
    message.includes('503') ||
    message.includes('quota') ||
    message.includes('exhausted') ||
    message.includes('not found') ||
    message.includes('unavailable') ||
    message.includes('rate limit') ||
    message.includes('does not exist') ||
    message.includes('model_not_found') ||
    message.includes('api error: 429') ||
    message.includes('api error: 404') ||
    message.includes('api error: 503')
  );
}

/**
 * Non-streaming Gemini chat completion with automatic model fallback.
 * Starts from `startModel` (defaults to first in chain) and falls back on retriable errors.
 */
export async function geminiChatCompletion(
  messages: object[],
  parameters: object = {},
  startModel: string = GEMINI_DEFAULT_MODEL
): Promise<any> {
  const chainIndex = GEMINI_FALLBACK_CHAIN.indexOf(startModel as any);
  const modelsToTry: readonly string[] =
    chainIndex !== -1
      ? GEMINI_FALLBACK_CHAIN.slice(chainIndex)
      : [startModel, ...GEMINI_FALLBACK_CHAIN];

  let lastError: unknown;

  for (const model of modelsToTry) {
    try {
      const result = await getChatCompletion('GEMINI', model, messages, parameters);
      if (model !== startModel) {
        console.log(`[Gemini Fallback] Used model: ${model} (original: ${startModel})`);
      }
      return result;
    } catch (error) {
      lastError = error;
      if (isRetriableError(error)) {
        console.warn(`[Gemini Fallback] Model ${model} unavailable, trying next...`);
        continue;
      }
      // Non-retriable — stop immediately
      throw error;
    }
  }

  throw lastError;
}

/**
 * Streaming Gemini chat completion with automatic model fallback.
 * Starts from `startModel` (defaults to first in chain) and falls back on retriable errors.
 */
export async function geminiStreamingChatCompletion(
  messages: object[],
  onChunk: (chunk: any) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  parameters: object = {},
  startModel: string = GEMINI_DEFAULT_MODEL
): Promise<void> {
  const chainIndex = GEMINI_FALLBACK_CHAIN.indexOf(startModel as any);
  const modelsToTry: readonly string[] =
    chainIndex !== -1
      ? GEMINI_FALLBACK_CHAIN.slice(chainIndex)
      : [startModel, ...GEMINI_FALLBACK_CHAIN];

  let lastError: unknown;

  for (const model of modelsToTry) {
    let succeeded = false;
    let retriable = false;

    await getStreamingChatCompletion(
      'GEMINI',
      model,
      messages,
      (chunk) => {
        succeeded = true;
        onChunk(chunk);
      },
      () => {
        succeeded = true;
        onComplete();
      },
      (error) => {
        lastError = error;
        retriable = isRetriableError(error);
        if (!retriable) {
          onError(error);
        } else {
          console.warn(`[Gemini Fallback] Streaming model ${model} unavailable, trying next...`);
        }
      },
      parameters
    );

    if (succeeded) {
      if (model !== startModel) {
        console.log(`[Gemini Fallback] Streamed with model: ${model} (original: ${startModel})`);
      }
      return;
    }

    if (!retriable) return; // onError already called
  }

  // All models exhausted
  onError(lastError instanceof Error ? lastError : new Error('All Gemini models exhausted'));
}
