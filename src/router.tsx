import { createHashRouter } from "react-router-dom";
import Layout from "./components/Layout";
  // Authority
import OrganizationDetails from "./pages/Authority/Organizations/OrganizationDetails";
import Organizations from "./pages/Authority/Organizations/Organizations";
import FuelStations from "./pages/Authority/FuelStations/FuelStations";
 

import Locations from "./pages/Locations/Locations";
import Branches from "./pages/Branches/Branches";
import BranchDetails from "./pages/Branches/BranchDetails";
import CreateBranch from "./pages/Branches/CreateBranch";
import EditBranch from "./pages/Branches/EditBranch";
import Roles from "./pages/Roles/Roles";
import CreateCustomRole from "./pages/Roles/CreateCustomRole";
import RoleDetails from "./pages/Roles/RoleDetails";
// import ServiceRequests from "./pages/ServiceRequests/ServiceRequests";
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
import RouteAccessGuard from "./components/RouteAccessGuard";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
// import ServiceRequestDetails from "./pages/ServiceRequests/ServiceRequestDetails";
import EditRole from "./pages/Roles/EditRole";

import FuelRetailDetails from './pages/fuelRetail/FuelRetailDetails';
import RegisterFuelRetail from './pages/fuelRetail/RegisterFuelRetail';
import EditFuelRetail from './pages/fuelRetail/EditFuelRetail';
import FuelRetail from "./pages/fuelRetail/fuelRetail";
// import ServiceProviders from "./pages/ServiceRequests/ServiceRequests";
// import ServiceRequests from "./pages/ServiceRequests/ServiceOfferings";
import ServiceCategories from "./pages/ServiceCategories/ServiceCategories";
import ServiceOfferings from "./pages/ServiceOfferings/ServiceOfferings";
import BranchRequests from "./pages/BranchRequests/BranchRequests";
import CreateBranchRequest from "./pages/BranchRequests/CreateBranchRequest";
import BranchRequestDetails from "./pages/BranchRequests/BranchRequestDetails";
import WorkOrders from "./pages/WorkOrders/WorkOrders";
import WorkOrderDetails from "./pages/WorkOrders/WorkOrderDetails";
import WorkOrdersReviewQueue from "./pages/WorkOrders/WorkOrdersReviewQueue";
import InternalWorkOrders from "./pages/Station/InternalWorkOrders";
import InternalWorkOrderDetail from "./pages/Station/InternalWorkOrderDetail";
import InternalWorkOrdersReviewQueue from "./pages/Station/InternalWorkOrdersReviewQueue";
import StationRequests from "./pages/Station/StationRequests";
import StationRequestDetail from "./pages/Station/StationRequestDetail";
import CreateMaintenanceRequest from "./pages/Station/CreateMaintenanceRequest";
import ProviderRfqs from "./pages/Provider/ProviderRfqs";
import ProviderRfqDetail from "./pages/Provider/ProviderRfqDetail";
import ProviderJobOrders from "./pages/Provider/ProviderJobOrders";
import ProviderJobOrderDetail from "./pages/Provider/ProviderJobOrderDetail";

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
      {
        index: true,
        element: <Profile />,
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
        path: "organizations",
        element: (
          <RouteAccessGuard pathKey="organizations">
            <Organizations />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-retail",
        element: (
          <RouteAccessGuard pathKey="fuel-retail">
            <FuelRetail />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-retail/:id",
        element: (
          <RouteAccessGuard pathKey="fuel-retail/:id">
            <FuelRetailDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-retail/register",
        element: (
          <RouteAccessGuard pathKey="fuel-retail/register">
            <RegisterFuelRetail />
          </RouteAccessGuard>
        ),
      },
      {
        path: "fuel-retail/:id/edit",
        element: (
          <RouteAccessGuard pathKey="fuel-retail/:id/edit">
            <EditFuelRetail />
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
        path: "fuel-stations/:id",
        element: (
          <RouteAccessGuard pathKey="fuel-stations/:id">
            <OrganizationDetails />
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
        path: "locations",
        element: (
          <RouteAccessGuard pathKey="locations">
            <Locations />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branches",
        element: (
          <RouteAccessGuard pathKey="branches">
            <Branches />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branch-requests",
        element: (
          <RouteAccessGuard pathKey="branch-requests">
            <BranchRequests />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branch-requests/create",
        element: (
          <RouteAccessGuard pathKey="branch-requests/create">
            <CreateBranchRequest />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branch-requests/:id",
        element: (
          <RouteAccessGuard pathKey="branch-requests/:id">
            <BranchRequestDetails />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branches/create",
        element: (
          <RouteAccessGuard pathKey="branches/create">
            <CreateBranch />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branches/:id/edit",
        element: (
          <RouteAccessGuard pathKey="branches/:id/edit">
            <EditBranch />
          </RouteAccessGuard>
        ),
      },
      {
        path: "branches/:id",
        element: (
          <RouteAccessGuard pathKey="branches/:id">
            <BranchDetails />
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
        path: "roles",
        element: (
          <RouteAccessGuard pathKey="roles">
            <Roles />
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
      // {
      //   path: "service-requests/:id",
      //   element: <ServiceRequestDetails />,
      // },
      {
        path: "quotations",
        element: (
          <RouteAccessGuard pathKey="quotations">
            <Quotations />
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
        path: "work-orders",
        element: (
          <RouteAccessGuard pathKey="work-orders">
            <WorkOrders />
          </RouteAccessGuard>
        ),
      },
      {
        path: "work-orders/review-queue",
        element: (
          <RouteAccessGuard pathKey="work-orders/review-queue">
            <WorkOrdersReviewQueue />
          </RouteAccessGuard>
        ),
      },
      {
        path: "work-orders/:id",
        element: (
          <RouteAccessGuard pathKey="work-orders/:id">
            <WorkOrderDetails />
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
      {
        path: "profile",
        element: <Profile />,
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
        path: "internal-work-orders",
        element: (
          <RouteAccessGuard pathKey="internal-work-orders">
            <InternalWorkOrders />
          </RouteAccessGuard>
        ),
      },
      {
        path: "internal-work-orders/review-queue",
        element: (
          <RouteAccessGuard pathKey="internal-work-orders/review-queue">
            <InternalWorkOrdersReviewQueue />
          </RouteAccessGuard>
        ),
      },
      {
        path: "internal-work-orders/:id",
        element: (
          <RouteAccessGuard pathKey="internal-work-orders/:id">
            <InternalWorkOrderDetail />
          </RouteAccessGuard>
        ),
      },
      {
        path: "station-requests",
        element: (
          <RouteAccessGuard pathKey="station-requests">
            <StationRequests />
          </RouteAccessGuard>
        ),
      },
      {
        path: "station-requests/create",
        element: (
          <RouteAccessGuard pathKey="station-requests/create">
            <CreateMaintenanceRequest />
          </RouteAccessGuard>
        ),
      },
      {
        path: "station-requests/:id",
        element: (
          <RouteAccessGuard pathKey="station-requests/:id">
            <StationRequestDetail />
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
