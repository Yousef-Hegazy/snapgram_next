import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="flex-center min-h-screen w-full bg-dark-2">
      <div className="flex flex-col items-center gap-4">
        <Loader />
        <p className="text-light-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}
