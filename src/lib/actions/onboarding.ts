"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createEmployee(
  department: string | undefined,
  clerkId: string,
  invitationCode: string
) {
  try {
    const code = await prisma.code.findFirst({
      where: {
        code: invitationCode,
        used: false,
      },
    });

    if (!code) {
      throw new Error("Invalid invitation code");
    }

    await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        role: "EMPLOYEE",
        department: department || null,
        companyId: code.companyId,
        onboardingCompleted: true,
      },
    });

    await prisma.code.update({
      where: {
        id: code.id,
      },
      data: {
        used: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating employee:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function createAdmin(
  companyName: string,
  companyWebsite: string,
  companyLogo: string,
  clerkId: string
) {
  try {
    const company = await prisma.company.create({
      data: {
        name: companyName,
        website: companyWebsite || null,
        logo: companyLogo || null,
      },
    });

    await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        role: "ADMIN",
        companyId: company.id,
        onboardingCompleted: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating admin:", error);
    throw new Error("Failed to complete onboarding");
  }
}