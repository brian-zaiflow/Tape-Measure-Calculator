import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CalculatorHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to Use</DialogTitle>
          <DialogDescription>
            Tape Measure Calculator features and tips
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Basic Operations */}
          <div>
            <h3 className="font-semibold mb-2">Basic Calculator</h3>
            <p className="text-muted-foreground">
              Enter inch measurements and use +, −, ×, ÷ to calculate. The <strong>"</strong> mark is always added automatically.
            </p>
          </div>

          {/* Manual Fractions */}
          <div>
            <h3 className="font-semibold mb-2">Enter Fractions</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Whole + fraction:</strong> Type <code>5 3/4</code> (5, space, 3, /, 4)</li>
              <li><strong>Fraction only:</strong> Type <code>3/4</code> (3, /, 4)</li>
              <li><strong>Quick fractions:</strong> Use buttons below calculator for common fractions</li>
            </ul>
          </div>

          {/* Decimal to Fraction */}
          <div>
            <h3 className="font-semibold mb-2">Decimal to Fraction</h3>
            <p className="text-muted-foreground">
              Type a decimal inch value like <code>5.625</code> and press <strong>=</strong> to convert to <strong>5 5/8"</strong>. Great for converting measurements from digital tools!
            </p>
          </div>

          {/* Rounding */}
          <div>
            <h3 className="font-semibold mb-2">Rounding Behavior</h3>
            <p className="text-muted-foreground">
              All results round to the nearest <strong>1/16"</strong> or <strong>1/32"</strong> (toggle in Settings). Halfway values <strong>round up</strong> per construction standard practice.
            </p>
          </div>

          {/* Settings */}
          <div>
            <h3 className="font-semibold mb-2">Settings</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>1/16" / 1/32":</strong> Choose precision for rounding</li>
              <li><strong>Reduce / Exact:</strong> Show reduced fractions (1/2) or exact (8/16)</li>
            </ul>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold mb-2">Examples</h3>
            <ul className="list-none text-muted-foreground space-y-1 text-xs font-mono">
              <li>• 5 3/4 + 2 1/8 = 7 7/8"</li>
              <li>• 10.5 = 10 1/2"</li>
              <li>• 12 × 3/4 = 9"</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
