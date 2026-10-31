import { Spinner } from "@/components/common/spinner";

export default function Loading() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" label="Loading BookNook..." />
    </div>
  );
}
