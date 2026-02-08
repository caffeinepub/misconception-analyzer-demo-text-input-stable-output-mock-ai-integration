import { ANALYSIS_PROMPT } from './analysisPrompt';

export interface AnalysisResult {
  misconception: string;
  whyFailed: string;
}

/**
 * Deterministic mock analysis function that simulates AI behavior.
 * Returns stable, predictable results based on input patterns and references actual user input.
 * References ANALYSIS_PROMPT to maintain consistency with future real implementation.
 */
export function mockAnalysis(input: string): AnalysisResult {
  // Reference the prompt (even though mock doesn't use LLM) to maintain architecture
  const _prompt = ANALYSIS_PROMPT;
  
  const lowerInput = input.toLowerCase().trim();
  
  // Extract a safe snippet from the input for personalized feedback
  const extractSnippet = (text: string, maxLength: number = 60): string => {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= maxLength) return `"${cleaned}"`;
    return `"${cleaned.substring(0, maxLength)}..."`;
  };
  
  const snippet = extractSnippet(input);
  
  // Pattern detection for common misconception types with personalized feedback
  
  // Temporal sequence → causation
  if (lowerInput.includes('because') && (lowerInput.includes('after') || lowerInput.includes('then') || lowerInput.includes('before'))) {
    return {
      misconception: "Confusing temporal sequence with causation",
      whyFailed: `In your explanation ${snippet}, you're assuming that because one event follows another in time, the first event caused the second. This is the 'post hoc ergo propter hoc' fallacy—sequence doesn't imply reason. Two events can occur in order without a causal relationship. Your reasoning conflates correlation with causation based purely on temporal ordering.`
    };
  }
  
  // Absolute language → overgeneralization
  if (lowerInput.includes('always') || lowerInput.includes('never') || lowerInput.includes('every')) {
    const absoluteWord = lowerInput.includes('always') ? 'always' : lowerInput.includes('never') ? 'never' : 'every';
    return {
      misconception: "Overgeneralizing from limited observations",
      whyFailed: `Your statement ${snippet} uses absolute language ("${absoluteWord}") based on limited examples or specific contexts. This overgeneralization ignores exceptions and edge cases. Real-world phenomena often have nuanced conditions and boundaries that absolute statements miss. The pattern you've observed may hold in some cases but breaks down when conditions change.`
    };
  }
  
  // Comparison/analogy language
  if (lowerInput.includes('similar') || lowerInput.includes('like') || lowerInput.includes('same as') || lowerInput.includes('just as')) {
    return {
      misconception: "False analogy or inappropriate pattern matching",
      whyFailed: `In ${snippet}, you're drawing parallels between concepts that share surface similarities but differ in fundamental ways. While analogies can be helpful learning tools, this comparison breaks down because the underlying mechanisms or contexts are different. Similarity in one aspect doesn't guarantee similarity in others—the analogy obscures important distinctions.`
    };
  }
  
  // Reversal language
  if (lowerInput.includes('opposite') || lowerInput.includes('reverse') || lowerInput.includes('backwards')) {
    return {
      misconception: "Reversing cause and effect relationships",
      whyFailed: `Your explanation ${snippet} has flipped the direction of causality—treating the effect as the cause and vice versa. This reversal suggests a misunderstanding of which variable influences the other. The actual causal arrow points in the opposite direction from your reasoning, leading to an inverted mental model.`
    };
  }
  
  // Negation patterns
  if (lowerInput.includes('not') || lowerInput.includes("doesn't") || lowerInput.includes("don't") || lowerInput.includes("can't")) {
    return {
      misconception: "Misunderstanding through negation or absence reasoning",
      whyFailed: `Your reasoning in ${snippet} relies on what something is NOT or what's absent, but this negative framing may be masking the actual positive mechanism at work. Explaining phenomena through absence or negation often indicates a gap in understanding the underlying process. The explanation needs to identify what IS happening, not just what isn't.`
    };
  }
  
  // Conditional/hypothetical language
  if (lowerInput.includes('if') && (lowerInput.includes('then') || lowerInput.includes('would'))) {
    return {
      misconception: "Confusing hypothetical reasoning with actual mechanisms",
      whyFailed: `In ${snippet}, you're using conditional logic ("if...then") that may not reflect the actual causal mechanism. Your hypothetical reasoning suggests you're inferring how things work from imagined scenarios rather than understanding the underlying process. The real mechanism may not follow the conditional pattern you've proposed.`
    };
  }
  
  // Question words (suggesting uncertainty)
  if (lowerInput.includes('maybe') || lowerInput.includes('might') || lowerInput.includes('could be') || lowerInput.includes('perhaps')) {
    return {
      misconception: "Tentative reasoning masking conceptual gaps",
      whyFailed: `Your explanation ${snippet} uses tentative language that reveals uncertainty about the underlying mechanism. While intellectual humility is valuable, this hedging suggests you're guessing rather than reasoning from a solid conceptual foundation. The uncertainty indicates missing knowledge about how the phenomenon actually works.`
    };
  }
  
  // Default response for general cases - now personalized
  return {
    misconception: "Incomplete mental model or missing key concept",
    whyFailed: `Your explanation ${snippet} suggests a gap in the underlying conceptual framework. You may be missing a key principle, applying a rule outside its valid context, or not accounting for important variables. The reasoning shows partial understanding but lacks the complete picture needed to explain this phenomenon accurately. Consider what fundamental concepts or mechanisms you might be overlooking.`
  };
}
