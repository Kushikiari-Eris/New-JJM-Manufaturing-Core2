import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"
import DashboardPage from "./pages/DashboardPage"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "./stores/useUserStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import CategoryPage from "./pages/CategoryPage"
import CartPage from "./pages/CartPage"
import { useCartStore } from "./stores/useCartStore"
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage"
import PurchaseCancelPage from "./pages/PurchaseCancelPage"
import { SidebarProvider } from "./components/SidebarContext"
import ProductPage from "./pages/ProductPage"
import CustomerOrderPage from "./pages/CustomerOrderPage"
import MyPurchasePage from "./pages/MyPurchasePage"
import CheckOutPage from "./pages/CheckOutPage"
import CodSuccessPage from "./pages/CodSuccessPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import Footer from "./components/Footer"
import InvoiceRecordsPage from "./pages/InvoiceRecordsPage"
import AuditDashboard from "./pages/AuditDashboard"
import ProductExecutionPage from "./pages/ProductExecutionPage"
import AuditHrRequestPage from "./pages/AuditHrRequestPage"
import InventoryPage from "./pages/InventoryPage"
import WorkOrdersPage from "./pages/WorkOrdersPage"
import MaintenancePage from "./pages/MaintenancePage"
import { SocketProvider } from "./context/SocketContext"
import AuditRequestAdminPage from "./pages/AuditRequestAdminPage"
import AuditRequestFinancePage from "./pages/AuditRequestFinancePage"
import AuditRequestLogisticPage from "./pages/AuditRequestLogisticPage"
import AuditRequestCorePage from "./pages/AuditRequestCorePage"
import AuditorDashbboard from "./pages/AuditorDashbboard"
import Testing from "./pages/Testing"
import AuditTaskPage from "./pages/AuditTaskPage"
import AuditorPendingPage from "./pages/AuditorPendingPage"
import AuditInProgressTaskPage from "./pages/AuditInProgressTaskPage"
import AuditCompletedTasksPage from "./pages/AuditCompletedTasksPage"
import AuditReportsTasksPage from "./pages/AuditReportsTasksPage"
import SuperAdminPage from "./pages/SuperAdminPage"
import SchedulerPage from "./pages/SchedulerPage"
import FinishProductPage from "./pages/FinishProductPage"
import DataInputPage from "./pages/DataInputPage"
import ModelTrainingPage from "./pages/ModelTrainingPage"
import PredictionPage from "./pages/PredictionPage"
import DataTablePage from "./pages/DataTablePage"
import PredictiveAnalyticsPage from "./pages/PredictiveAnalyticsPage"
import AuditDashboard1 from "./pages/AuditDashboard1"
import AuditScheduleListPage from "./pages/AuditScheduleListPage"
import SecuritySettingPage from "./pages/SecuritySettingsPage"

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const location = useLocation(); // Get current route

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  const isAdmin = user?.role === "admin";
  const isAudit = user?.role === "audit";
  const isAuditor = user?.role === "auditor";
  const isSuperAdmin = user?.role === "superadmin";
  const hideNavbarAndFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <SocketProvider>
        <SidebarProvider>
          {!hideNavbarAndFooter && !isAdmin && !isAudit && !isAuditor && !isSuperAdmin && <Navbar />}
          
          <Routes>
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" 
              element={!user ? <LoginPage /> : 
                <Navigate to={
                  isSuperAdmin ? "/dashboard" :
                  isAdmin ? "/dashboard" : 
                  isAudit ? "/auditDashboard" : 
                  isAuditor ? "/auditorDashboard" : "/"
                } />} 
            />
            <Route path="/" element={<HomePage />} />

            {/* SuperAdmin Routes */}
            <Route path="/superAdminPage" element={(user?.role === "superadmin") ? <SuperAdminPage /> : <Navigate to="/login" />} />

            {/* Admin & SuperAdmin Routes */}
            <Route path="/dashboard" element={(user?.role === "admin" || user?.role === "superadmin") ? <DashboardPage /> : <Navigate to="/" />} />
            <Route path="/product" element={(user?.role === "admin" || user?.role === "superadmin") ? <ProductPage /> : <Navigate to="/" />} />
            <Route path="/orders" element={(user?.role === "admin" || user?.role === "superadmin") ? <CustomerOrderPage /> : <Navigate to="/" />} />
            <Route path="/invoiceRecords" element={(user?.role === "admin" || user?.role === "superadmin") ? <InvoiceRecordsPage /> : <Navigate to="/login" />} />
            <Route path="/productExecution" element={(user?.role === "admin" || user?.role === "superadmin") ? <ProductExecutionPage /> : <Navigate to="/login" />} />
            <Route path="/workOrders" element={(user?.role === "admin" || user?.role === "superadmin") ? <WorkOrdersPage /> : <Navigate to="/login" />} />
            <Route path="/inventory" element={(user?.role === "admin" || user?.role === "superadmin") ? <InventoryPage /> : <Navigate to="/login" />} />
            <Route path="/maintenance" element={(user?.role === "admin" || user?.role === "superadmin") ? <MaintenancePage /> : <Navigate to="/login" />} />
            <Route path="/testing" element={(user?.role === "admin" || user?.role === "superadmin") ? <Testing /> : <Navigate to="/login" />} />
            <Route path="/schedule" element={(user?.role === "admin" || user?.role === "superadmin") ? <SchedulerPage /> : <Navigate to="/login" />} />
            <Route path="/finish-product" element={(user?.role === "admin" || user?.role === "superadmin") ? <FinishProductPage /> : <Navigate to="/login" />} />
            <Route path="/audit-schedule" element={(user?.role === "admin" || user?.role === "superadmin") ? <AuditScheduleListPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={(user?.role === "admin" || user?.role === "superadmin") ? <SecuritySettingPage /> : <Navigate to="/login" />} />

            <Route path="/data-input" element={(user?.role === "admin" || user?.role === "superadmin") ? <DataInputPage /> : <Navigate to="/login" />} />
            <Route path="/model-training" element={(user?.role === "admin" || user?.role === "superadmin") ? <ModelTrainingPage /> : <Navigate to="/login" />} />
            <Route path="/prediction" element={(user?.role === "admin" || user?.role === "superadmin") ? <PredictionPage /> : <Navigate to="/login" />} />
            <Route path="/data-table" element={(user?.role === "admin" || user?.role === "superadmin") ? <DataTablePage /> : <Navigate to="/login" />} />
            <Route path="/predictive-analytics" element={(user?.role === "admin" || user?.role === "superadmin") ? <PredictiveAnalyticsPage /> : <Navigate to="/login" />} />

            {/* Audit & superadmin Routes */}
            <Route path="/auditDashboard" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditDashboard /> : <Navigate to="/login" />} />
            <Route path="/auditDashboard1" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditDashboard1 /> : <Navigate to="/login" />} />
            <Route path="/auditRequestHr" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditHrRequestPage /> : <Navigate to="/login" />} />
            <Route path="/auditRequestAdmin" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditRequestAdminPage /> : <Navigate to="/login" />} />
            <Route path="/auditRequestFinance" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditRequestFinancePage /> : <Navigate to="/login" />} />
            <Route path="/auditRequestLogistic" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditRequestLogisticPage /> : <Navigate to="/login" />} />
            <Route path="/auditRequestCore" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditRequestCorePage /> : <Navigate to="/login" />} />
            <Route path="/auditTask" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditTaskPage /> : <Navigate to="/login" />} />
            <Route path="/auditReports" element={(user?.role === "audit" || user?.role === "superadmin") ? <AuditReportsTasksPage /> : <Navigate to="/login" />} />

            {/* Auditor & superadmin Routes */}
            <Route path="/auditorDashboard" element={(user?.role === "auditor" || user?.role === "superadmin") ? <AuditorDashbboard /> : <Navigate to="/login" />} />
            <Route path="/auditPendingTask" element={(user?.role === "auditor" || user?.role === "superadmin") ? <AuditorPendingPage /> : <Navigate to="/login" />} />
            <Route path="/auditInProgressTask" element={(user?.role === "auditor" || user?.role === "superadmin") ? <AuditInProgressTaskPage /> : <Navigate to="/login" />} />
            <Route path="/auditCompletedTask" element={(user?.role === "auditor" || user?.role === "superadmin") ? <AuditCompletedTasksPage /> : <Navigate to="/login" />} />

            {/* Common User Routes */}
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
            <Route path="/cod-success" element={user ? <CodSuccessPage /> : <Navigate to="/login" />} />
            <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
            <Route path="/purchasePage" element={user ? <MyPurchasePage /> : <Navigate to="/login" />} />
            <Route path="/checkoutPage" element={user ? <CheckOutPage /> : <Navigate to="/login" />} />
            <Route path="/orderTrackingPage/:orderId" element={user ? <OrderTrackingPage /> : <Navigate to="/login" />} />
          </Routes>


          {!hideNavbarAndFooter && !isAdmin && !isAudit && !isAuditor && !isSuperAdmin && <Footer />}
          <Toaster />
        </SidebarProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
