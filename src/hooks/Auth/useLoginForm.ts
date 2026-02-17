import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/services/authService";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

function getErrorMessage(err: unknown): string | null {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message ?? null;
  }
  return null;
}

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        login(response.data);
        toast.success("Welcome back! Login successful");
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
        navigate(from || "/", { replace: true });
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || "An error occurred during login");
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
