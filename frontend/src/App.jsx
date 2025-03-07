import { Navigate, Route, Routes } from "react-router-dom"


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
import FinishProductPage from "./pages/FinishProductPage"
import RawMaterialRequest from "./pages/RawMaterialRequest"
import InvoiceRecordsPage from "./pages/InvoiceRecordsPage"
import AuditDashboard from "./pages/auditDashboard"
import ProductExecutionPage from "./pages/ProductExecutionPage"
import AuditHrRequestPage from "./pages/AuditHrRequestPage"
import AuditCorePage from "./pages/AuditCorePage"
import InventoryPage from "./pages/InventoryPage"




function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner/>


  const isAdmin = user?.role === "admin"
  const isAudit = user?.role === "audit"

  return (
    
    <>
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
        
          <SidebarProvider>
              {!isAdmin && !isAudit && (<Navbar/>)}
              
                <Routes>
                  <Route path="/signup" element={!user ? <SignUpPage/> : <Navigate to='/' />} />
                  <Route path="/login" element={!user ? <LoginPage/> :  <Navigate to={isAdmin ? "/dashboard" : isAudit ? "/auditDashboard" : "/"}/>} />
                  <Route path="/" element={<HomePage/>} />

                  <Route path="/dashboard" element={user?.role === "admin" ? <DashboardPage/> : <Navigate to='/' />} />
                  <Route path="/product" element={user?.role === "admin" ? <ProductPage/> : <Navigate to='/' />} />
                  <Route path="/orders" element={user?.role === "admin" ? <CustomerOrderPage/> : <Navigate to='/' />} />
                  {/* <Route path='/finishProduct' element={user?.role === "admin" ? <FinishProductPage /> : <Navigate to='/login' />} />   not needed anymore */}
                  <Route path='/rawMaterialRequest' element={user?.role === "admin" ? <RawMaterialRequest /> : <Navigate to='/login' />} />
                  <Route path='/invoiceRecords' element={user?.role === "admin" ? <InvoiceRecordsPage /> : <Navigate to='/login' />} />
                  <Route path='/productExecution' element={user?.role === "admin" ? <ProductExecutionPage /> : <Navigate to='/login' />} />
                   <Route path='/inventory' element={user?.role === "admin" ? <InventoryPage /> : <Navigate to='/login' />} />


                  <Route path='/auditDashboard' element={user?.role === "audit" ? <AuditDashboard /> : <Navigate to='/login' />} />
                  <Route path='/auditHrRequest' element={user?.role === "audit" ? <AuditHrRequestPage /> : <Navigate to='/login' />} />
                  <Route path='/auditCore' element={user?.role === "audit" ? <AuditCorePage /> : <Navigate to='/login' />} />


                  <Route path='/category/:category' element={<CategoryPage />} />
                  <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
                  <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
                  <Route path='/cod-success' element={user ? <CodSuccessPage /> : <Navigate to='/login' />} />
                  <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
                  <Route path='/purchasePage' element={user ? <MyPurchasePage /> : <Navigate to='/login' />} />
                  <Route path='/checkoutPage' element={user ? <CheckOutPage /> : <Navigate to='/login' />} />
                  <Route path='/orderTrackingPage/:orderId' element={user ? <OrderTrackingPage /> : <Navigate to='/login' />} />
                  
                </Routes>
                 {!isAdmin && !isAudit && <Footer />}
              <Toaster/>
          </SidebarProvider>
        
      </div>
    </>
  )
}

export default App
