import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href={"/"} className="flex items-center gap-2 font-semibold">
          <span className="text-lg font-bold">TimeOffer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">{session?.user?.name}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </nav>
      </header>
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
