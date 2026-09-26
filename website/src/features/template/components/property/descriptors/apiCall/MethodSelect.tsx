"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiCallMethod } from "@/types/api-call";
import { ColorEnum } from "@/types/template";

/** Ticket: "choice with color for every method" - one fixed color per HTTP verb. */
const METHOD_COLOR: Record<ApiCallMethod, ColorEnum> = {
  [ApiCallMethod.GET]: ColorEnum.GREEN,
  [ApiCallMethod.POST]: ColorEnum.BLUE,
  [ApiCallMethod.PATCH]: ColorEnum.YELLOW,
  [ApiCallMethod.PUT]: ColorEnum.ORANGE,
  [ApiCallMethod.DELETE]: ColorEnum.RED,
};

interface MethodSelectProps {
  value: ApiCallMethod;
  onChange: (method: ApiCallMethod) => void;
}

export function MethodSelect({ value, onChange }: MethodSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ApiCallMethod)}>
      <SelectTrigger size="sm" className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(ApiCallMethod).map((method) => (
          <SelectItem key={method} value={method}>
            <Badge
              variant="outline"
              className="border-transparent"
              style={{ backgroundColor: METHOD_COLOR[method], color: "#fff" }}
            >
              {method}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
