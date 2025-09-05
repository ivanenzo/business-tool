import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyWorkingDaysForm from "@/components/CompanyWorkingDaysForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/admin/company-settings");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      companyId: true,
    },
  });

  console.log(`user`, user);

  const company = await prisma.company.findUnique({
    where: {
      id: user?.companyId,
    },
    select: {
      workingDays: true,
    },
  });

  console.log(`company`, company);

  const initialWorkingDays = JSON.parse(company?.workingDays || "[]");

  console.log(`initialWorkingDays`, initialWorkingDays);

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Working Days</h1>
          <p className="text-gray-500">
            Configure your company&apos;s working days
          </p>
        </div>
        <Button asChild variant={"outline"}>
          <Link href="/admin/company-settings">Back to settings</Link>
        </Button>
      </div>
      <CompanyWorkingDaysForm initialWorkingDays={initialWorkingDays} />
    </div>
  );
};

export default page;
