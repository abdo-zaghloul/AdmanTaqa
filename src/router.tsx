import { createHashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteAccessGuard from "./components/RouteAccessGuard";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile/Profile";

// ---------- Authority   ----------

import OrganizationDetails from "./pages/Authority/Organizations/OrganizationDetails";
import Organizations from "./pages/Authority/Organizations/Organizations";
import OrganizationsRejected from "./pages/Authority/Organizations/OrganizationsRejected";
import FuelStations from "./pages/Authority/FuelStations/FuelStations";
import FuelStationsPending from "./pages/Authority/FuelStations/FuelStationsPending";
import FuelStationsRejected from "./pages/Authority/FuelStations/FuelStationsRejected";
import RegistrationsPage from "./pages/Registrations/RegistrationsPage";
import RegistrationDetailPage from "./pages/Registrations/RegistrationDetailPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage";
import OnboardingDetails from "./pages/Onboarding/OnboardingDetails";
import JobOrders from "./pages/JobOrders/JobOrders";
import JobOrderDetails from "./pages/JobOrders/JobOrderDetails";
import Inspections from "./pages/Inspections/Inspections";
import AuditLog from "./pages/AuditLog/AuditLog";

// ---------- Service Provider   ----------
import Users from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import UpdateUser from "./pages/Users/UpdateUser";
import Roles from "./pages/Roles/Roles";
import CreateCustomRole from "./pages/Roles/CreateCustomRole";
import RoleDetails from "./pages/Roles/RoleDetails";
import EditRole from "./pages/Roles/EditRole";
import ServiceCategories from "./pages/ServiceCategories/ServiceCategories";
import ServiceOfferings from "./pages/ServiceOfferings/ServiceOfferings";
import ProviderRfqs from "./pages/Provider/ProviderRfqs";
import ProviderRfqDetail from "./pages/Provider/ProviderRfqDetail";
import ProviderJobOrders from "./pages/Provider/ProviderJobOrders";
import ProviderJobOrderDetail from "./pages/Provider/ProviderJobOrderDetail";
import Locations from "./pages/Locations/Locations";

// ---------- Shared (مشترك: Authority + Service Provider + Fuel Station) ----------
import Quotations from "./pages/Quotations/Quotations";

export const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      // ---------- Common (للجميع) ----------
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      // ---------- Authority (هيئة) ----------
      {
        path: "organizations",
        element: (
          <RouteAccessGuard pathKey="organizations">
            <Organizations />
          </RouteAccessGuard>
        ),
      },
      {
        path: "organizations/rejected",
        element: (
          <RouteAccessGuard pathKey="organizations/rejected">
            <OrganizationsRejected />
          </RouteAccessGuard>
        ),
      },
      {
        path: "organizations/:id",
        element: (
          <RouteAccessGuard pathKey="organizations/:id">
            <OrganizationDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-stations",
        element: (
          <RouteAccessGuard pathKey="fuel-stations">
            <FuelStations />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-stations/pending",
        element: (
          <RouteAccessGuard pathKey="fuel-stations/pending">
            <FuelStationsPending />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-stations/rejected",
        element: (
          <RouteAccessGuard pathKey="fuel-stations/rejected">
            <FuelStationsRejected />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-stations/:id",
        element: (
          <RouteAccessGuard pathKey="fuel-stations/:id">
            <OrganizationDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "registrations",
        element: (
          <RouteAccessGuard pathKey="registrations">
            <RegistrationsPage />
          </RouteAccessGuard>
        ),
      },
      {
        path: "registrations/:id",
        element: (
          <RouteAccessGuard pathKey="registrations/:id">
            <RegistrationDetailPage />
          </RouteAccessGuard>
        ),
      },
      {
        path: "onboarding",
        element: (
          <RouteAccessGuard pathKey="onboarding">
            <OnboardingPage />
          </RouteAccessGuard>
        ),
      },
      {
        path: "onboarding/:id",
        element: (
          <RouteAccessGuard pathKey="onboarding/:id">
            <OnboardingDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "job-orders",
        element: (
          <RouteAccessGuard pathKey="job-orders">
            <JobOrders />
          </RouteAccessGuard>
        ),
      },
      {
        path: "job-orders/:id",
        element: (
          <RouteAccessGuard pathKey="job-orders/:id">
            <JobOrderDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "inspections",
        element: (
          <RouteAccessGuard pathKey="inspections">
            <Inspections />
          </RouteAccessGuard>
        ),
      },
      {
        path: "audit-log",
        element: (
          <RouteAccessGuard pathKey="audit-log">
            <AuditLog />
          </RouteAccessGuard>
        ),
      },

      // ---------- Service Provider (مزود الخدمة) ----------
      {
        path: "users",
        element: (
          <RouteAccessGuard pathKey="users">
            <Users />
          </RouteAccessGuard>
        ),
      },
      {
        path: "users/:id",
        element: (
          <RouteAccessGuard pathKey="users/:id">
            <UserDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <RouteAccessGuard pathKey="users/:id/edit">
            <UpdateUser />
          </RouteAccessGuard>
        ),
      },
      {
        path: "roles",
        element: (
          <RouteAccessGuard pathKey="roles">
            <Roles />
          </RouteAccessGuard>
        ),
      },
      {
        path: "roles/create",
        element: (
          <RouteAccessGuard pathKey="roles/create">
            <CreateCustomRole />
          </RouteAccessGuard>
        ),
      },
      {
        path: "roles/:id",
        element: (
          <RouteAccessGuard pathKey="roles/:id">
            <RoleDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "roles/:id/edit",
        element: (
          <RouteAccessGuard pathKey="roles/:id/edit">
            <EditRole />
          </RouteAccessGuard>
        ),
      },
      {
        path: "service-Offering",
        element: (
          <RouteAccessGuard pathKey="service-Offering">
            <ServiceOfferings />
          </RouteAccessGuard>
        ),
      },
      {
        path: "service-categories",
        element: (
          <RouteAccessGuard pathKey="service-categories">
            <ServiceCategories />
          </RouteAccessGuard>
        ),
      },
      {
        path: "provider-rfqs",
        element: (
          <RouteAccessGuard pathKey="provider-rfqs">
            <ProviderRfqs />
          </RouteAccessGuard>
        ),
      },
      {
        path: "provider-rfqs/:id",
        element: (
          <RouteAccessGuard pathKey="provider-rfqs/:id">
            <ProviderRfqDetail />
          </RouteAccessGuard>
        ),
      },
      {
        path: "provider-job-orders",
        element: (
          <RouteAccessGuard pathKey="provider-job-orders">
            <ProviderJobOrders />
          </RouteAccessGuard>
        ),
      },
      {
        path: "provider-job-orders/:id",
        element: (
          <RouteAccessGuard pathKey="provider-job-orders/:id">
            <ProviderJobOrderDetail />
          </RouteAccessGuard>
        ),
      },
      {
        path: "locations",
        element: (
          <RouteAccessGuard pathKey="locations">
            <Locations />
          </RouteAccessGuard>
        ),
      },

      // ---------- Shared (مشترك: Authority + Service Provider + Fuel Station) ----------
      {
        path: "quotations",
        element: (
          <RouteAccessGuard pathKey="quotations">
            <Quotations />
          </RouteAccessGuard>
        ),
      },

      // ---------- Catch-all ----------
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
