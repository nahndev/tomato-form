import { SessionProvider } from "@/features/template/components/provider/SessionProvider";
import SessionCanvas from "@/features/template/components/session/SessionCanvas";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";

export type SessionBuilderProps = {
  sessionId: string;
};

const SessionBox: React.FC<SessionBuilderProps> = ({ sessionId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-md">
        <SessionProvider sessionId={sessionId}>
          <SessionHeader />
          <SessionCanvas />
        </SessionProvider>
      </div>
    </div>
  );
};

const SessionHeader: React.FC = () => {
  const { session } = useSessionState();
  return (
    <div className="bg-gray-200 p-2">
      <h3>{session?.name}</h3>
    </div>
  );
};

export default SessionBox;
