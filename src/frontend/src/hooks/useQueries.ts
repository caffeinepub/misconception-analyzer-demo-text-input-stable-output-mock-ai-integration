import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { mockAnalysis, type AnalysisResult } from '../lib/mockAnalysis';

/**
 * Validates that a backend result has the expected shape.
 */
function isValidAnalysisResult(result: any): result is AnalysisResult {
  return (
    result &&
    typeof result === 'object' &&
    typeof result.misconception === 'string' &&
    typeof result.whyFailed === 'string' &&
    result.misconception.length > 0 &&
    result.whyFailed.length > 0
  );
}

/**
 * React Query hook for analyzing learner explanations.
 * Attempts backend call first, falls back to deterministic mock with clear disclosure.
 */
export function useAnalyzeExplanation() {
  const { actor } = useActor();

  return useMutation<AnalysisResult, Error, string>({
    mutationFn: async (input: string) => {
      // Validate input
      if (!input || input.trim().length === 0) {
        throw new Error('Please enter an explanation to analyze.');
      }

      // Try backend first if available
      if (actor && 'analyzeExplanation' in actor) {
        try {
          const actorWithMethod = actor as any;
          if (typeof actorWithMethod.analyzeExplanation === 'function') {
            const result = await actorWithMethod.analyzeExplanation(input);
            
            // Validate the backend result shape
            if (isValidAnalysisResult(result)) {
              // Backend succeeded - return result WITHOUT fallback disclosure
              return {
                misconception: result.misconception,
                whyFailed: result.whyFailed
              };
            } else {
              // Backend returned invalid shape - treat as failure
              console.warn('Backend returned invalid result shape:', result);
              throw new Error('Invalid backend response format');
            }
          }
        } catch (error) {
          console.warn('Backend analysis failed, using fallback analyzer:', error);
          // Fall back to mock WITH disclosure
          const mockResult = mockAnalysis(input);
          return {
            misconception: mockResult.misconception,
            whyFailed: `[Using fallback analyzer] ${mockResult.whyFailed}`
          };
        }
      }

      // Backend method not available - use deterministic mock WITH disclosure
      const mockResult = mockAnalysis(input);
      return {
        misconception: mockResult.misconception,
        whyFailed: `[Using fallback analyzer] ${mockResult.whyFailed}`
      };
    },
  });
}
