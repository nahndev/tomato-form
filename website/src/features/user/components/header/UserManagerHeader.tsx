import { BackButton } from "@/components/ui/back-button";
import CurrentUserBadge from "@/features/user/components/header/CurrentUserBadge";

const UserManagerHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <BackButton href="/" aria-label="Back to home" />
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the people who can be assigned across the application
          </p>
        </div>
      </div>
      <CurrentUserBadge />
    </div>
  );
};

export default UserManagerHeader;
