import CompanyHolidaysForm from "@/components/CompanyHolidaysForm";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      companyId: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const companyHolidays = await prisma.companyHoliday.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  return <CompanyHolidaysForm initialHolidays={companyHolidays} />;
};

export default page;
