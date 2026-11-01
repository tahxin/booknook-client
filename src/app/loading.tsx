import { Spinner } from "@/components/common/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <Spinner size="lg" label="Fetching the shelf" />
    </div>
  );
}
