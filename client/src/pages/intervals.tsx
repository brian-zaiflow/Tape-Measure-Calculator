import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { ImperialMeasurement } from "@/types";
import {
  parseInput,
  formatImperialMeasurement,
  toDecimalInches,
  toImperialMeasurement,
} from "@/lib/fraction-math";

export default function Intervals() {
  const [boardLength, setBoardLength] = useState("");
  const [edgeOffset, setEdgeOffset] = useState("2\"");
  const [itemCount, setItemCount] = useState("");

  const [marks, setMarks] = useState<ImperialMeasurement[]>([]);
  const [summary, setSummary] = useState({
    count: 0,
    spacing: 0,
    span: 0,
    hasWarning: false,
    warningMessage: "",
  });

  useEffect(() => {
    calculateMarks();
  }, [boardLength, edgeOffset, itemCount]);

  const calculateMarks = () => {
    const emptySummary = {
      count: 0,
      spacing: 0,
      span: 0,
      hasWarning: false,
      warningMessage: "",
    };

    const boardParsed = parseInput(boardLength);
    const offsetParsed = parseInput(edgeOffset);
    const count = parseInt(itemCount);

    if (!boardParsed || !offsetParsed || !count) {
      setMarks([]);
      setSummary(emptySummary);
      return;
    }

    const boardInches = toDecimalInches(boardParsed);
    const offsetInches = toDecimalInches(offsetParsed);

    if (boardInches <= 0 || offsetInches < 0) {
      setMarks([]);
      setSummary(emptySummary);
      return;
    }

    if (count < 2) {
      setMarks([]);
      setSummary({
        ...emptySummary,
        hasWarning: true,
        warningMessage: "Enter at least 2 items to calculate even spacing.",
      });
      return;
    }

    if (offsetInches * 2 >= boardInches) {
      setMarks([]);
      setSummary({
        ...emptySummary,
        hasWarning: true,
        warningMessage: "Edge offset is too large. It must be less than half the total length.",
      });
      return;
    }

    const firstPosition = offsetInches;
    const lastPosition = boardInches - offsetInches;
    const span = lastPosition - firstPosition;
    const spacing = span / (count - 1);

    const newMarks: ImperialMeasurement[] = [];
    for (let i = 0; i < count; i++) {
      const position = firstPosition + spacing * i;
      newMarks.push(toImperialMeasurement(position));
    }

    setMarks(newMarks);
    setSummary({
      count,
      spacing,
      span,
      hasWarning: false,
      warningMessage: "",
    });
  };

  const clearAll = () => {
    setBoardLength("");
    setEdgeOffset("2\"");
    setItemCount("");
    setMarks([]);
    setSummary({
      count: 0,
      spacing: 0,
      span: 0,
      hasWarning: false,
      warningMessage: "",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-1 text-center">
            Even Spacing Calculator
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Place hooks, screws, brackets, or marks evenly with a matching edge offset
          </p>
        </div>

        <Card className="p-6 shadow-xl">
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="boardLength" className="text-base font-semibold">
                Total Length <span className="text-destructive">*</span>
              </Label>
              <Input
                id="boardLength"
                value={boardLength}
                onChange={(e) => setBoardLength(e.target.value)}
                placeholder={'30 3/8" or 96"'}
                className="font-mono text-lg mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edgeOffset" className="text-base font-semibold">
                Distance From Each End <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edgeOffset"
                value={edgeOffset}
                onChange={(e) => setEdgeOffset(e.target.value)}
                placeholder='2"'
                className="font-mono text-lg mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                First and last marks will be this far from the ends.
              </p>
            </div>

            <div>
              <Label htmlFor="itemCount" className="text-base font-semibold">
                Number of Items <span className="text-destructive">*</span>
              </Label>
              <Input
                id="itemCount"
                type="number"
                value={itemCount}
                onChange={(e) => setItemCount(e.target.value)}
                placeholder="5"
                className="text-lg mt-1"
                min="2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this for hooks, screws, brackets, shelf pins, handles, or layout marks.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <Button onClick={clearAll} variant="outline" className="w-full">
              Clear All
            </Button>
          </div>

          {summary.hasWarning && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-600 dark:text-amber-500">
                {summary.warningMessage}
              </p>
            </div>
          )}

          {marks.length > 0 && (
            <>
              <Card className="p-4 bg-primary/5 border-primary/20 mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-sm">Layout Summary</span>
                </h3>
                <div className="space-y-1.5 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-semibold">{summary.count}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Spacing between items:</span>
                    <span className="font-semibold font-mono">
                      {formatImperialMeasurement(toImperialMeasurement(summary.spacing))}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Span between first and last:</span>
                    <span className="font-semibold font-mono">
                      {formatImperialMeasurement(toImperialMeasurement(summary.span))}
                    </span>
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                  Mark Positions:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {marks.map((mark, index) => (
                    <div
                      key={index}
                      className="bg-background rounded-lg px-3 py-2.5 text-center font-mono font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(formatImperialMeasurement(mark))}
                      title="Click to copy"
                    >
                      {formatImperialMeasurement(mark)}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Even Spacing:</strong> Enter the total length,
              the distance from each end, and how many items you need. The calculator shows every
              mark position from the left edge.
              <br />
              <span className="text-muted-foreground/70">
                Example: 30 3/8" length, 2" from each end, 5 items = marks at 2", 8 5/8", 15 3/16", 21 13/16", 28 3/8".
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
