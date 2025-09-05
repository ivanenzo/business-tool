"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Company Profile Actions
export async function updateCompanyProfile(data: {
  name: string;
  website?: string;
  logo?: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        companyId: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.company.update({
      where: {
        id: user.companyId!,
      },
      data: {
        name: data.name,
        website: data.website || null,
        logo: data.logo || null,
      },
    });

    revalidatePath("/admin/company-settings/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating company profile:", error);
    throw new Error("Failed to update company profile");
  }
}

// Working Days Actions
export async function updateCompanyWorkingDays(workingDays: string[]) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
        companyId: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.company.update({
      where: {
        id: user.companyId!,
      },
      data: {
        workingDays: JSON.stringify(workingDays),
      },
    });

    revalidatePath("/admin/company-settings/working-days");
    return { success: true };
  } catch (error) {
    console.error("Error updating working days:", error);
    throw new Error("Failed to update working days");
  }
}

// Holiday Actions
export async function addCompanyHoliday(data: {
  name: string;
  date: Date;
  isRecurring: boolean;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        companyId: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const holiday = await prisma.companyHoliday.create({
      data: {
        name: data.name,
        date: data.date,
        isRecurring: data.isRecurring,
        companyId: user.companyId!,
      },
    });

    revalidatePath("/admin/company-settings/holidays");
    return holiday;
  } catch (error) {
    console.error("Error adding holiday:", error);
    throw new Error("Failed to add holiday");
  }
}

export async function updateCompanyHoliday(data: {
  id: string;
  name: string;
  date: Date;
  isRecurring: boolean;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        companyId: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const holiday = await prisma.companyHoliday.findUnique({
      where: { id: data.id },
      select: { companyId: true },
    });

    if (!holiday || holiday.companyId !== user.companyId) {
      throw new Error("Holiday not found or unauthorized");
    }

    const updatedHoliday = await prisma.companyHoliday.update({
      where: { id: data.id },
      data: {
        name: data.name,
        date: data.date,
        isRecurring: data.isRecurring,
      },
    });

    revalidatePath("/admin/company-settings/holidays");
    return updatedHoliday;
  } catch (error) {
    console.error("Error updating holiday:", error);
    throw new Error("Failed to update holiday");
  }
}

export async function deleteCompanyHoliday(id: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        companyId: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const existingHoliday = await prisma.companyHoliday.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!existingHoliday || existingHoliday.companyId !== user.companyId) {
      throw new Error("Holiday not found or unauthorized");
    }

    await prisma.companyHoliday.delete({
      where: { id },
    });

    revalidatePath("/admin/company-settings/holidays");
    return { success: true };
  } catch (error) {
    console.error("Error deleting holiday:", error);
    throw new Error("Failed to delete holiday");
  }
}

// Employee Allowance Actions
export async function updateEmployeeAllowance(data: {
  employeeId: string;
  availableDays: number;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: {
        id: data.employeeId,
      },
      data: {
        availableDays: data.availableDays,
      },
    });

    revalidatePath("/admin/employees/allowance");
    return { success: true };
  } catch (error) {
    console.error("Error updating employee allowance:", error);
    throw new Error("Failed to update employee allowance");
  }
}

// Invitation Code Actions
export async function generateInvitationCode() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
        companyId: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const generateRandomCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    let code = generateRandomCode();

    let existingCode = await prisma.code.findFirst({
      where: { code },
    });

    while (existingCode) {
      code = generateRandomCode();
      existingCode = await prisma.code.findFirst({
        where: { code },
      });
    }

    const newCode = await prisma.code.create({
      data: {
        code,
        companyId: user.companyId!,
        used: false,
      },
    });

    revalidatePath("/admin/invitation-codes");
    return newCode;
  } catch (error) {
    console.error("Error generating invitation code:", error);
    throw new Error("Failed to generate invitation code");
  }
}

// Time Off Request Actions
export async function updateTimeOffRequestStatus(data: {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  notes?: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        companyId: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const request = await prisma.timeOffRequest.findUnique({
      where: { id: data.requestId },
      include: { employee: true },
    });

    if (!request || request.employee.companyId !== user.companyId) {
      throw new Error("Time off request not found or unauthorized");
    }

    const updatedRequest = await prisma.timeOffRequest.update({
      where: { id: data.requestId },
      data: {
        status: data.status,
        notes: data.notes,
        managerId: user.id,
      },
    });

    if (data.status === "APPROVED") {
      await prisma.user.update({
        where: { id: request.employeeId },
        data: {
          availableDays: {
            decrement: updatedRequest.workingDaysCount,
          },
        },
      });
    }

    revalidatePath("/admin/time-off-requests");
    return updatedRequest;
  } catch (error) {
    console.error("Error updating time off request status:", error);
    throw new Error("Failed to update time off request status");
  }
}