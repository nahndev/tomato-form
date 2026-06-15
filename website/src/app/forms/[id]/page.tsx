import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { mode } = await searchParams;
  const query = mode ? `?mode=${mode}` : "";
  redirect(`/templates/${id}${query}`);
}
