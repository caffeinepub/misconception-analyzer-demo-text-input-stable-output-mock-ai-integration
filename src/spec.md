# Specification

## Summary
**Goal:** Move Gemini-based explanation analysis fully to the backend canister, using the provided API key securely, and return meaningful misconception/whyFailed results to the existing UI.

**Planned changes:**
- Add a public backend canister method `analyzeExplanation(explanation : Text) : async ExplanationAnalysis` in `backend/main.mo` that returns non-placeholder `{ misconception; whyFailed }` derived from the input text.
- Implement the backend Gemini call using the existing analysis intent (misconception detection + why the mental model failed) and map the model output into `ExplanationAnalysis`.
- Ensure the frontend never calls Gemini directly and never contains/exposes the Gemini API key; have the UI render the backend-provided analysis result when available.
- On backend analysis failure or invalid Gemini response, return a controlled backend error so the existing frontend fallback behavior continues and clearly discloses fallback usage.

**User-visible outcome:** When a user submits an explanation, the app shows a backend-generated misconception and why-failed analysis; if backend analysis fails, the app continues to show the existing clearly-labeled fallback analysis.
