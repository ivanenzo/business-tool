import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, companyWebsite, companyLogo } = await request.json();

    const company = await prisma.company.create({
      data: {
        name: companyName,
        website: companyWebsite,
        logo: companyLogo,
      },
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role: "ADMIN",
        companyId: company.id,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}