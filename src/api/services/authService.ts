import axios from "axios";
import axiosInstance from "../config";
import { apiUrl } from "../config";
import type { AuthResponse, MeResponse } from "@/types/auth";

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

export interface RefreshBody {
  refreshToken: string;
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
  async refresh(body: RefreshBody): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(`${apiUrl}auth/refresh`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },
  async me(): Promise<MeResponse> {
    const { data } = await axiosInstance.get<MeResponse>("auth/me");
    return data;
  },
};
