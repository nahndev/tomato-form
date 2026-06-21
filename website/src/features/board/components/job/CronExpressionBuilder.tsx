"use client";

import { useMemo } from "react";
import { parseExpression } from "cron-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CronExpressionBuilderProps = {
  value: string;
  onChange: (value: string) => void;
};

const PRESETS: { label: string; expression: string }[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Hourly", expression: "0 * * * *" },
  { label: "Daily", expression: "0 9 * * *" },
  { label: "Weekly", expression: "0 9 * * 1" },
  { label: "Monthly", expression: "0 9 1 * *" },
];

const CronExpressionBuilder: React.FC<CronExpressionBuilderProps> = ({
  value,
  onChange,
}) => {
  const preview = useMemo(() => {
    try {
      const next = parseExpression(value).next().toDate();
      return { nextRun: next.toLocaleString(), error: null as string | null };
    } catch {
      return { nextRun: null, error: "Invalid cron expression" };
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="job-cron">Schedule</Label>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <Button
            key={preset.expression}
            type="button"
            variant={value === preset.expression ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset.expression)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Input
        id="job-cron"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 0 9 * * *"
        error={preview.error ?? undefined}
      />

      {!preview.error && preview.nextRun && (
        <p className="text-xs text-muted-foreground">
          Next run: {preview.nextRun}
        </p>
      )}
    </div>
  );
};

export default CronExpressionBuilder;
