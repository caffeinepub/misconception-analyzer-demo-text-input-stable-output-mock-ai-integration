# Specification

## Summary
**Goal:** Make the app’s analysis reflect arbitrary user-provided explanations by returning a backend-derived misconception and an explicit mental-model breakdown, and ensure the UI only labels results as fallback when fallback was actually used.

**Planned changes:**
- Update backend `analyzeExplanation` (`backend/main.mo`) to derive analysis from the caller’s explanation text (not fixed placeholders) and return exactly `misconception` and `whyFailed`, with `whyFailed` describing the mental-model breakdown and referencing the user input.
- Update the frontend analysis flow to prefer and display the backend `analyzeExplanation` result when it succeeds, and only prepend `[Using fallback analyzer]` to `whyFailed` when the backend call fails and fallback analysis is used.

**User-visible outcome:** Users can submit any explanation and receive analysis that is clearly tied to their text, showing a specific misconception and a clear explanation of why their mental model broke down; the fallback disclosure appears only when fallback was used.
