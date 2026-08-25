import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "./_components/AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-screen h-screen flex flex-row">
      <AppSidebar />
      <ScrollArea className="flex-1">
        <main className="min-w-0">{children}</main>
      </ScrollArea>
    </div>
  );
}
