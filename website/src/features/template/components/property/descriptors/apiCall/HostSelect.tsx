"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_CALL_HOSTS } from "@/features/template/constants/widget/apiHosts";

interface HostSelectProps {
  value: string | undefined;
  onChange: (hostId: string) => void;
}

export function HostSelect({ value, onChange }: HostSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm">
        <SelectValue placeholder="Choose a host…" />
      </SelectTrigger>
      <SelectContent>
        {API_CALL_HOSTS.map((host) => (
          <SelectItem key={host.id} value={host.id}>
            {host.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
