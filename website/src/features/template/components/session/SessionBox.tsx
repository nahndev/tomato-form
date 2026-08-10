import SessionCanvas from "@/features/template/components/session/SessionCanvas";
import SessionHeader from "@/features/template/components/session/SessionHeader";
import { SessionProvider } from "@/features/template/components/session/SessionProvider";

export type SessionBuilderProps = {
  sessionId: string;
};

const SessionBox: React.FC<SessionBuilderProps> = ({ sessionId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-md p-4">
        <SessionProvider sessionId={sessionId}>
          <SessionHeader />
          <SessionCanvas />
        </SessionProvider>
      </div>
    </div>
  );
};

export default SessionBox;
