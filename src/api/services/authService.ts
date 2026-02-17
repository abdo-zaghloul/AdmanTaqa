import axiosInstance from "../config";
import type { AuthResponse } from "@/types/auth";

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  organizationName: string;
  organizationType: "SERVICE_PROVIDER" | "FUEL_STATION";
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export const authService = {
  async login(body: LoginBody): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>("auth/login", body);
    return data;
  },
  async register(body: RegisterBody): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>("auth/register", body);
    return data;
  },
};
