import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Company Profile
export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; website?: string; logo?: string }) => {
      const response = await fetch("/api/admin/company-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update company profile");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
    },
  });
};

// Working Days
export const useUpdateWorkingDays = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workingDays: string[]) => {
      const response = await fetch("/api/admin/working-days", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workingDays }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update working days");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-days"] });
    },
  });
};

// Holidays
export const useAddHoliday = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; date: Date; isRecurring: boolean }) => {
      const response = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add holiday");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
};

export const useUpdateHoliday = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name: string; date: Date; isRecurring: boolean }) => {
      const response = await fetch(`/api/admin/holidays/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update holiday");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
};

export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/holidays/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
};

// Employee Allowance
export const useUpdateEmployeeAllowance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { employeeId: string; availableDays: number }) => {
      const response = await fetch("/api/admin/employees/allowance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update employee allowance");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// Invitation Codes
export const useGenerateInvitationCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/invitation-codes", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate invitation code");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation-codes"] });
    },
  });
};

// Time Off Requests
export const useUpdateTimeOffRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, status, notes }: { requestId: string; status: "APPROVED" | "REJECTED"; notes?: string }) => {
      const response = await fetch(`/api/admin/time-off-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update time off request status");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off-requests"] });
    },
  });
};