import InvitationCodes from '@/components/InvitationCodes';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      companyId: true, 
      role: true
    }
  })

  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }


  const codes = await prisma.code.findMany({
    where: {
      companyId: user.companyId
    },
    orderBy: {
      used: "asc"
    }
  })

  return (
    <InvitationCodes initialCodes={codes} />
  )
}

export default page