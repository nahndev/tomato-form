import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CurrentUserBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-medium leading-none">Admin User</p>
        <p className="text-xs text-muted-foreground">Administrator</p>
      </div>
    </div>
  );
};

export default CurrentUserBadge;
