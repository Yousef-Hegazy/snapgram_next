import Bottombar from "@/components/ui/Bottombar";
import LeftSidebar from "@/components/ui/LeftSidebar";
import Loader from "@/components/ui/Loader";
import Topbar from "@/components/ui/Topbar";
import { getCurrentUser } from "@/server/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in", RedirectType.replace);
  }

  return (
    <div className="w-full md:flex flex-col">
      <Topbar user={user} />

      <section className="flex flex-1 h-full">
        <nav className="leftsidebar">
          <Suspense fallback={<Loader />}>
            <LeftSidebar user={user} />
          </Suspense>
        </nav>
        <main className="flex h-screen flex-1">{children}</main>
      </section>

      <Bottombar />
    </div>
  );
}
