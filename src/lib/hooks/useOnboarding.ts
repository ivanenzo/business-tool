import { useMutation } from "@tanstack/react-query";

export const useCreateEmployee = () => {
  return useMutation({
    mutationFn: async (data: { department?: string; invitationCode: string }) => {
      const response = await fetch("/api/onboarding/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete onboarding");
      }
      
      return response.json();
    },
  });
};

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async (data: { companyName: string; companyWebsite?: string; companyLogo?: string }) => {
      const response = await fetch("/api/onboarding/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete onboarding");
      }
      
      return response.json();
    },
  });
};