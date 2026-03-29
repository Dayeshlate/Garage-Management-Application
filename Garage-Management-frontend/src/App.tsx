import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { RoleGuard } from "@/components/RoleGuard";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Customers } from "@/pages/customers/Customers";
import { Vehicles } from "@/pages/vehicles/Vehicles";
import { JobCards } from "@/pages/jobcards/JobCards";
import { Inventory } from "@/pages/inventory/Inventory";
import { Billing } from "@/pages/billing/Billing";
import { Reports } from "@/pages/reports/Reports";
import { Settings } from "@/pages/settings/Settings";

import { UserDashboard } from "@/pages/user/UserDashboard";
import { TrackService } from "@/pages/user/TrackService";
import { MyVehicles } from "@/pages/user/MyVehicles";
import { MyInvoices } from "@/pages/user/MyInvoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<RoleGuard allowedRoles={['ADMIN']}><Dashboard /></RoleGuard>} />
              <Route path="/customers" element={<RoleGuard allowedRoles={['ADMIN']}><Customers /></RoleGuard>} />
              <Route path="/vehicles" element={<RoleGuard allowedRoles={['ADMIN']}><Vehicles /></RoleGuard>} />
              <Route path="/job-cards" element={<RoleGuard allowedRoles={['ADMIN']}><JobCards /></RoleGuard>} />
              <Route path="/inventory" element={<RoleGuard allowedRoles={['ADMIN']}><Inventory /></RoleGuard>} />
              <Route path="/billing" element={<RoleGuard allowedRoles={['ADMIN']}><Billing /></RoleGuard>} />
              <Route path="/reports" element={<RoleGuard allowedRoles={['ADMIN']}><Reports /></RoleGuard>} />
              <Route path="/settings" element={<RoleGuard allowedRoles={['ADMIN']}><Settings /></RoleGuard>} />

              {/* User Routes */}
              <Route path="/my-dashboard" element={<RoleGuard allowedRoles={['USER']}><UserDashboard /></RoleGuard>} />
              <Route path="/track-service" element={<RoleGuard allowedRoles={['USER']}><TrackService /></RoleGuard>} />
              <Route path="/my-vehicles" element={<RoleGuard allowedRoles={['USER']}><MyVehicles /></RoleGuard>} />
              <Route path="/my-invoices" element={<RoleGuard allowedRoles={['USER']}><MyInvoices /></RoleGuard>} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
