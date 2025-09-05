import TimeOffRequestForm from "@/components/TimeOffRequestForm";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
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
    redirect("/onboarding");
  }

  const requests = await prisma.timeOffRequest.findMany({
    where: {
      employeeId: session.user.id,
    },
  });

  const companyHolidays = await prisma.companyHoliday.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  return (
    <TimeOffRequestForm
      existingRequests={requests}
      companyHolidays={companyHolidays}
    />
  );
};

export default page;
