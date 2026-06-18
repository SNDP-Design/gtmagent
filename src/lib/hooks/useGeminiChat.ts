'use client';

import { useState, useCallback } from 'react';
import {
  geminiChatCompletion,
  geminiStreamingChatCompletion,
  GEMINI_DEFAULT_MODEL,
} from '@/lib/ai/geminiWithFallback';

/**
 * Drop-in replacement for useChat('GEMINI', ...) that uses the model fallback chain.
 * Starts from GEMINI_DEFAULT_MODEL and falls back through the full chain on errors.
 */
export function useGeminiChat(streaming: boolean = true) {
  const [response, setResponse] = useState('');
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (messages: object[], parameters: object = {}) => {
      setResponse('');
      setFullResponse(streaming ? [] : null);
      setIsLoading(true);
      setError(null);

      try {
        if (streaming) {
          await geminiStreamingChatCompletion(
            messages,
            (chunk) => {
              setFullResponse((prev: any[]) => [...prev, chunk]);
              const content = chunk?.choices?.[0]?.delta?.content;
              if (content) setResponse((prev) => prev + content);
            },
            () => setIsLoading(false),
            (err) => {
              setError(err);
              setIsLoading(false);
            },
            parameters,
            GEMINI_DEFAULT_MODEL
          );
        } else {
          const result = await geminiChatCompletion(messages, parameters, GEMINI_DEFAULT_MODEL);
          setFullResponse(result);
          setResponse(result?.choices?.[0]?.message?.content || '');
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    },
    [streaming]
  );

  return { response, fullResponse, isLoading, error, sendMessage };
}
