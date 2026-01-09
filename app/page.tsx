import Loader from "@/components/ui/Loader";
import { getCurrentUser } from "@/server/lib/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in", RedirectType.replace);
  }

  redirect("/posts", RedirectType.replace);

  return (
    <div className="flex-center min-h-screen w-full bg-dark-2">
      <div className="flex flex-col items-center gap-4">
        <Loader />
        <p className="text-light-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}
