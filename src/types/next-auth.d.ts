import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: string;
      companyId: string;
      companyName: string;
      onboardingCompleted: boolean;
    };
  }

  interface User {
    role: string;
    companyId: string;
    companyName: string;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    companyId: string;
    companyName: string;
    onboardingCompleted: boolean;
  }
}