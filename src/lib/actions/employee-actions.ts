"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { TimeOffType } from "@prisma/client";

export async function createTimeOffRequest(formData: FormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const type = formData.get("type") as string;
    const reason = formData.get("reason") as string;
    const workingDays = parseInt(formData.get("workingDays") as string) || 0;

    if (!startDate || !endDate || !type) {
      throw new Error("Missing required fields");
    }

    const timeOffRequest = await prisma.timeOffRequest.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type: type as TimeOffType,
        reason: reason || null,
        employeeId: dbUser.id,
        workingDaysCount: workingDays,
      },
    });

    revalidatePath("/employee/my-requests");
    return timeOffRequest;
  } catch (error) {
    console.error("Error creating time off request:", error);
    throw new Error("Failed to create time off request");
  }
}