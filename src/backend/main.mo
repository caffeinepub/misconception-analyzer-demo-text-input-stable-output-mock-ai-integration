import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

actor {
  type ExplanationAnalysis = {
    misconception : Text;
    whyFailed : Text;
  };

  type GeminiError = { #geminiError : Text };

  type GeminiResponse = {
    #content : Text;
    #error : GeminiError;
  };

  type GeminiInput = {
    prompt : Text;
  };

  let staticAnalyses = Map.fromIter<Text, ExplanationAnalysis>(
    [(("2minimal", { misconception = "No clear misconception detected."; whyFailed = "No error found in mental model, answer is sufficient." }))].values()
  );

  func buildPrompt(explanation : Text) : Text {
    let staticPrompt = "You are a conceptual model analyst for evaluating physical mechanism explanations. Always reply in strictly valid JSON in `{ \"misconception\" : Text; whyFailed : Text }` format. ";
    let input = "Analyze the following explanation for potential misconceptions and explain why an error might occur:\n" # "Explanation: \"" # explanation # "\"";
    staticPrompt # input;
  };

  func mapResponse(response : Text) : GeminiResponse {
    #content response;
  };

  func tryTransformation(response : ?GeminiResponse) : async ExplanationAnalysis {
    switch (response) {
      case (?parsed) { await parseResponse(parsed) };
      case (null) { Runtime.trap("Transformation failed. Invalid Gemini response. ") };
    };
  };

  func parseResponse(response : GeminiResponse) : async ExplanationAnalysis {
    let parsed = await extractContent(response);
    switch (parsed) {
      case (#ok content) { content };
      case (#err err) { Runtime.trap(err) };
    };
  };

  func extractContent(response : GeminiResponse) : async { #err : Text; #ok : ExplanationAnalysis } {
    switch (response) {
      case (#content content) {
        #ok (tryTextToExplanationAnalysis(content));
      };
      case (#error err) {
        #err ("#GeminiError " # debug_show(err));
      };
    };
  };

  func tryTextToExplanationAnalysis(_ : Text) : ExplanationAnalysis {
    Runtime.trap("Function not implemented. Not supported by IC. ");
  };

  func persistentAnalysis(analysis : ExplanationAnalysis) : ?GeminiResponse {
    ?#content (analysis.whyFailed # analysis.misconception);
  };

  public func analyzeExplanation(explanation : Text) : async ExplanationAnalysis {
    switch (staticAnalyses.get(explanation)) {
      case (?staticAnalysis) { staticAnalysis };
      case (null) { await tryTransformation(persistentAnalysis({ misconception = "Mixing latent and sensible heat"; whyFailed = "Because ice has a high heat capacity, you may significantly lower the water's temperature, explaining why it doesn't immediately freeze. Instead, more energy needs to be transferred for the phase change." })) };
    };
  };
};
