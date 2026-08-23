import { useSubmissionConnection } from "@/features/submission/components/provider/SubmissionDocProvider";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

const SubmissionConnection: React.FC = () => {
  const isConnected = useSubmissionConnection();
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        {isConnected ? (
          <span className="flex items-center gap-1 text-green-600">
            <TomatoIcon icon={TomatoIconKey.Wifi} className="size-3" />
            Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground/60">
            <TomatoIcon icon={TomatoIconKey.WifiOff} className="size-3" />
            Offline
          </span>
        )}
      </div>
    </div>
  );
};

export default SubmissionConnection;
