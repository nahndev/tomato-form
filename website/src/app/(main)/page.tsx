import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, Database, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Form Builder",
    description:
      "Create multi-step forms with conditional logic, user assignments, and approval workflows for any business process.",
  },
  {
    icon: Database,
    title: "Shared Data",
    description:
      "Manage centralized datasets — employees, departments, projects — reusable across all forms and workflows.",
  },
  {
    icon: LayoutDashboard,
    title: "Management Boards",
    description:
      "Monitor all submissions through configurable boards with advanced search, filtering, and status tracking.",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Workflow-driven form platform
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to{" "}
            <span className="text-primary">Tomato</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A unified platform for internal business processes — replacing
            fragmented communication channels with structured, traceable, and
            collaborative workflows.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" className="px-6">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            );
          })}
        </div>

        {/* Workflow section */}
        <div className="mt-20 rounded-2xl bg-primary/5 p-8 ring-1 ring-primary/20">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Typical Workflow
          </h2>
          <ol className="space-y-3">
            {[
              "A manager creates a form and defines the workflow.",
              "User A submits initial information.",
              "User B reviews or provides additional details.",
              "User C receives notifications and continues the process.",
              "The submission progresses through predefined workflow stages.",
              "All activities are tracked and managed through boards.",
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
