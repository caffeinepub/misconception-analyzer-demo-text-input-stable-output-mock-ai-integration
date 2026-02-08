import type { Principal } from "@icp-sdk/core/principal";

export interface ExplanationAnalysis {
  misconception: string;
  whyFailed: string;
}

export interface backendInterface {
  analyzeExplanation?: (explanation: string) => Promise<ExplanationAnalysis>;
}
