import { createHashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Organizations from "./pages/Organizations/Organizations";
import Locations from "./pages/Locations/Locations";
import Branches from "./pages/Branches/Branches";
import BranchDetails from "./pages/Branches/BranchDetails";
import CreateBranch from "./pages/Branches/CreateBranch";
import EditBranch from "./pages/Branches/EditBranch";
import Roles from "./pages/Roles/Roles";
import CreateCustomRole from "./pages/Roles/CreateCustomRole";
import RoleDetails from "./pages/Roles/RoleDetails";
import ServiceRequests from "./pages/ServiceRequests/ServiceRequests";
import Quotations from "./pages/Quotations/Quotations";
import JobOrders from "./pages/JobOrders/JobOrders";
import JobOrderDetails from "./pages/JobOrders/JobOrderDetails";
import Inspections from "./pages/Inspections/Inspections";
import AuditLog from "./pages/AuditLog/AuditLog";
import Users from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import UpdateUser from "./pages/Users/UpdateUser";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile/Profile";
import RegistrationsPage from "./pages/Registrations/RegistrationsPage";
import RegistrationDetailPage from "./pages/Registrations/RegistrationDetailPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage";
import OnboardingDetails from "./pages/Onboarding/OnboardingDetails";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizationDetails from "./pages/Organizations/OrganizationDetails";
import ServiceRequestDetails from "./pages/ServiceRequests/ServiceRequestDetails";
import EditRole from "./pages/Roles/EditRole";
import CreateRegisterOrganization from "./pages/Organizations/CreateRegisterOrganization";
// import FuelRetail from './pages/fuelRetail/FuelRetail';
import FuelRetailDetails from './pages/fuelRetail/FuelRetailDetails';
import RegisterFuelRetail from './pages/fuelRetail/RegisterFuelRetail';
import EditFuelRetail from './pages/fuelRetail/EditFuelRetail';
import FuelRetail from "./pages/fuelRetail/fuelRetail";

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
    children: [
      {
        index: true,
        element: <Branches />,
      },
      {
        path: "roles/:id/edit",
        element: <EditRole />,
      },
      {
        path: "organizations/register",
        element: <CreateRegisterOrganization />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "fuel-retail",
        element: <FuelRetail />,
      },
      {
        path: "fuel-retail/:id",
        element: <FuelRetailDetails />,
      },
      {
        path: "fuel-retail/register",
        element: <RegisterFuelRetail />,
      },
      {
        path: "fuel-retail/:id/edit",
        element: <EditFuelRetail />,
      },
      {
        path: "organizations/:id",
        element: <OrganizationDetails />,
      },
      {
        path: "locations",
        element: <Locations />,
      },
      {
        path: "branches",
        element: <Branches />,
      },
      {
        path: "branches/create",
        element: <CreateBranch />,
      },
      {
        path: "branches/:id/edit",
        element: <EditBranch />,
      },
      {
        path: "branches/:id",
        element: <BranchDetails />,
      },
      {
        path: "roles/create",
        element: <CreateCustomRole />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "roles/:id",
        element: <RoleDetails />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:id",
        element: <UserDetails />,
      },
      {
        path: "users/:id/edit",
        element: <UpdateUser />,
      },
      {
        path: "service-requests",
        element: <ServiceRequests />,
      },
      {
        path: "service-requests/:id",
        element: <ServiceRequestDetails />,
      },
      {
        path: "quotations",
        element: <Quotations />,
      },
      {
        path: "job-orders",
        element: <JobOrders />,
      },
      {
        path: "job-orders/:id",
        element: <JobOrderDetails />,
      },
      {
        path: "inspections",
        element: <Inspections />,
      },
      {
        path: "audit-log",
        element: <AuditLog />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "registrations",
        element: <RegistrationsPage />,
      },
      {
        path: "registrations/:id",
        element: <RegistrationDetailPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "onboarding/:id",
        element: <OnboardingDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
