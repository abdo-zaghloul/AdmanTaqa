import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/services/authService";
import type { RegisterBody } from "@/api/services/authService";
import { toast } from "sonner";

const registerSchema = z.object({
  organizationName: z.string().min(1, "Company name is required"),
  organizationType: z.enum(["SERVICE_PROVIDER", "FUEL_STATION"]),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

function getErrorMessage(err: unknown): string | null {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message ?? null;
  }
  return null;
}

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "SERVICE_PROVIDER",
      email: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const body: RegisterBody = {
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        ...(data.phone ? { phone: data.phone } : {}),
      };
      const response = await authService.register(body);
      if (response.success && response.data) {
        login(response.data);
        toast.success("Registration successful. Welcome aboard!");
        navigate("/", { replace: true });
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
    isLoading,
  };
}
