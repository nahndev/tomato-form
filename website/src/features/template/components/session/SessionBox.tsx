import {
  SessionProvider,
  useSessionContext,
} from "@/features/template/components/provider/SessionProvider";
import SessionCanvas from "@/features/template/components/session/SessionCanvas";
import { Session } from "@/types/template";

export type SessionBuilderProps = {
  session: Session;
};

const SessionBox: React.FC<SessionBuilderProps> = ({ session }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-md">
        <SessionProvider session={session}>
          <SessionHeader />
          <SessionCanvas />
        </SessionProvider>
      </div>
    </div>
  );
};

const SessionHeader: React.FC = () => {
  const { session } = useSessionContext();
  return (
    <div className="bg-gray-200 p-2">
      <h3>{session.name}</h3>
    </div>
  );
};

export default SessionBox;
