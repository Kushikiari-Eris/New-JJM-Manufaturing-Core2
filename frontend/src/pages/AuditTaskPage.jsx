import React from 'react'
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { SidebarProvider, useSidebar } from "../components/SidebarContext"
import AuditTaskTable from '../components/AuditTaskTable'

const AuditTaskPage = () => {
  return (
    <>
    <SidebarProvider>
      <DashboardLayout />
    </SidebarProvider>
    </>
  )
}

const DashboardLayout = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex transition-all duration-300">
      {/* Sidebar */}
      <div
        className={`fixed h-screen z-20 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className={`transition-all duration-300 flex-1 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 w-full shadow-md z-10">
          <Navbar />
        </div>

        {/* Main content with padding */}
        <main className="mt-20 overflow-y-auto bg-gray-100 h-screen transition-all duration-300">
          <div className="p-4">
            <AuditTaskTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditTaskPage