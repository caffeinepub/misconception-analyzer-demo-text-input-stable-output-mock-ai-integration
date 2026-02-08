import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAnalyzeExplanation } from './hooks/useQueries';
import { Loader2, Lightbulb, AlertCircle } from 'lucide-react';

const EXAMPLE_INPUTS = [
  "Ice cream sales cause drowning deaths because whenever ice cream sales go up, drowning deaths also increase.",
  "All swans are white because every swan I've ever seen has been white, so there can never be a black swan.",
  "The rooster's crow causes the sun to rise because the sun always comes up right after the rooster crows."
];

function App() {
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const analyzeMutation = useAnalyzeExplanation();

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationError('');

    // Validate input
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setValidationError('Please enter an explanation before submitting.');
      return;
    }

    // Check length (soft limit for UX)
    if (trimmedInput.length > 10000) {
      setValidationError('Your explanation is very long (over 10,000 characters). Please shorten it for better analysis.');
      return;
    }

    // Trigger analysis
    analyzeMutation.mutate(trimmedInput);
  };

  const handleReset = () => {
    setInput('');
    setValidationError('');
    analyzeMutation.reset();
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setValidationError('');
    analyzeMutation.reset();
  };

  const isLoading = analyzeMutation.isPending;
  const result = analyzeMutation.data;
  const error = analyzeMutation.error;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Misconception Analyzer
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Discover why your understanding failed, not just what went wrong
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Explanation</CardTitle>
              <CardDescription>
                Explain a concept or phenomenon in your own words. We'll analyze your thinking pattern.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your explanation here... (e.g., 'I think X causes Y because...')"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setValidationError('');
                  }}
                  className="min-h-[150px] resize-y text-base"
                  disabled={isLoading}
                />
                {input.length > 8000 && (
                  <p className="text-xs text-muted-foreground">
                    Character count: {input.length} / 10,000
                  </p>
                )}
              </div>

              {/* Validation Error */}
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze My Thinking'
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>

              {/* Example Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Try an example:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_INPUTS.map((example, index) => (
                    <Button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                      className="text-xs h-auto py-2 px-3"
                    >
                      Example {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          {(result || error) && (
            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-500">
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error.message || 'An error occurred during analysis. Please try again.'}
                    </AlertDescription>
                  </Alert>
                ) : result ? (
                  <>
                    {/* Detected Misconception */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-sm font-bold">
                          1
                        </span>
                        Detected Misconception
                      </h3>
                      <p className="text-base leading-relaxed text-foreground pl-8">
                        {result.misconception}
                      </p>
                    </div>

                    <Separator />

                    {/* Why Understanding Failed */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-sm font-bold">
                          2
                        </span>
                        Why Your Understanding Failed
                      </h3>
                      <p className="text-base leading-relaxed text-foreground pl-8">
                        {result.whyFailed}
                      </p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* System Flow Explanation */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            <strong>How it works:</strong> You enter your explanation → The system analyzes your thinking pattern → 
            You receive insights about the specific misconception and why your mental model broke down.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
