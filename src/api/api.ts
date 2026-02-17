import axiosInstance from "./config";

export interface RegistrationDocument {
  url: string;
  name: string;
}

export interface Registration {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  documents: RegistrationDocument[];
}

interface FetchRegistrationsResponse {
  data: Registration[];
  totalPages: number;
  total: number;
  page: number;
}

export async function fetchRegistrations(
  status: string,
  page: number,
  pageSize: number
): Promise<FetchRegistrationsResponse> {
  const { data } = await axiosInstance.get("/registrations", {
    params: { status, page, pageSize },
  });
  return data;
}

export async function fetchRegistrationById(id: string): Promise<Registration> {
  const { data } = await axiosInstance.get(`/registrations/${id}`);
  return data.data ?? data;
}

export async function approveRegistration(id: string): Promise<void> {
  await axiosInstance.post(`/registrations/${id}/approve`);
}

export async function rejectRegistration(id: string): Promise<void> {
  await axiosInstance.post(`/registrations/${id}/reject`);
}
