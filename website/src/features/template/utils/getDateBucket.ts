export type DateBucketLabel = "Today" | "Last 7 Days" | "Older";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getDateBucket(dateStr: string | undefined): {
  key: DateBucketLabel;
  label: DateBucketLabel;
} {
  if (!dateStr) {
    return { key: "Older", label: "Older" };
  }

  const diffDays = Math.floor((startOfDay(new Date()) - startOfDay(new Date(dateStr))) / DAY_MS);

  const bucket: DateBucketLabel = diffDays <= 0 ? "Today" : diffDays <= 7 ? "Last 7 Days" : "Older";

  return { key: bucket, label: bucket };
}
