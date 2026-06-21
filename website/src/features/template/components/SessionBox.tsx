import SessionCanvas from "@/features/template/components/canvas/SessionCanvas";
import {
  SessionProvider,
  useSessionContext,
} from "@/features/template/components/provider/SessionProvider";
import { Session } from "@/types/template";

export type SessionBuilderProps = {
  session: Session;
};

const SessionBox: React.FC<SessionBuilderProps> = ({ session }) => {
  return (
    <SessionProvider session={session}>
      <SessionHeader />
      <SessionCanvas />
    </SessionProvider>
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
