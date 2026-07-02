import { useTemplateConnection } from "@/features/template/components/provider/TemplateDocProvider";
import { Wifi, WifiOff } from "lucide-react";

export type TemplateConnectionProps = {};

const TemplateConnection: React.FC<TemplateConnectionProps> = () => {
  const isConnected = useTemplateConnection();
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        {isConnected ? (
          <span className="flex items-center gap-1 text-green-600">
            <Wifi className="size-3" />
            Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground/60">
            <WifiOff className="size-3" />
            Offline
          </span>
        )}
      </div>
    </div>
  );
};

export default TemplateConnection;
