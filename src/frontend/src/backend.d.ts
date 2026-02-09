import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ExplanationAnalysis {
    whyFailed: string;
    misconception: string;
}
export interface backendInterface {
    analyzeExplanation(explanation: string): Promise<ExplanationAnalysis>;
}
