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
  const hideNavbarAndFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <SocketProvider>
        <SidebarProvider>
          {!hideNavbarAndFooter && !isAdmin && !isAudit && !isAuditor && <Navbar />}
          
          <Routes>
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={isAdmin ? "/dashboard" : isAudit ? "/auditDashboard" :  isAuditor ? "/auditorDashboard" : "/"} />} />
            <Route path="/" element={<HomePage />} />

            <Route path="/dashboard" element={user?.role === "admin" ? <DashboardPage /> : <Navigate to="/" />} />
            <Route path="/product" element={user?.role === "admin" ? <ProductPage /> : <Navigate to="/" />} />
            <Route path="/orders" element={user?.role === "admin" ? <CustomerOrderPage /> : <Navigate to="/" />} />
            <Route path='/invoiceRecords' element={user?.role === "admin" ? <InvoiceRecordsPage /> : <Navigate to='/login' />} />
            <Route path='/productExecution' element={user?.role === "admin" ? <ProductExecutionPage /> : <Navigate to='/login' />} />
            <Route path='/workOrders' element={user?.role === "admin" ? <WorkOrdersPage /> : <Navigate to='/login' />} />
            <Route path='/inventory' element={user?.role === "admin" ? <InventoryPage /> : <Navigate to='/login' />} />
            <Route path='/maintenance' element={user?.role === "admin" ? <MaintenancePage /> : <Navigate to='/login' />} />
            <Route path='/testing' element={user?.role === "admin" ? <Testing /> : <Navigate to='/login' />} />

            <Route path='/auditDashboard' element={user?.role === "audit" ? <AuditDashboard /> : <Navigate to='/login' />} />
            <Route path='/auditRequestHr' element={user?.role === "audit" ? <AuditHrRequestPage /> : <Navigate to='/login' />} />
            <Route path='/auditRequestAdmin' element={user?.role === "audit" ? <AuditRequestAdminPage /> : <Navigate to='/login' />} />
            <Route path='/auditRequestFinance' element={user?.role === "audit" ? <AuditRequestFinancePage /> : <Navigate to='/login' />} />
            <Route path='/auditRequestLogistic' element={user?.role === "audit" ? <AuditRequestLogisticPage /> : <Navigate to='/login' />} />
            <Route path='/auditRequestCore' element={user?.role === "audit" ? <AuditRequestCorePage /> : <Navigate to='/login' />} />

            <Route path='/auditorDashboard' element={user?.role === "auditor" ? <AuditorDashbboard /> : <Navigate to='/login' />} />


            <Route path='/category/:category' element={<CategoryPage />} />
            <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
            <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
            <Route path='/cod-success' element={user ? <CodSuccessPage /> : <Navigate to='/login' />} />
            <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
            <Route path='/purchasePage' element={user ? <MyPurchasePage /> : <Navigate to='/login' />} />
            <Route path='/checkoutPage' element={user ? <CheckOutPage /> : <Navigate to='/login' />} />
            <Route path='/orderTrackingPage/:orderId' element={user ? <OrderTrackingPage /> : <Navigate to='/login' />} />
          </Routes>

          {!hideNavbarAndFooter && !isAdmin && !isAudit && !isAuditor&& <Footer />}
          <Toaster />
        </SidebarProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
