import React from 'react'
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { SidebarProvider } from "../components/SidebarContext"
import InvoiceRecordsList from '../components/InvoiceRecordsList'

const InvoiceRecordsPage = () => {
  return (
    <>
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar with fixed width */}
        <div className="z-50">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Fixed Navbar */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
            <Navbar />
          </div>

          {/* Main content with padding to avoid overlap */}
          <main className="mt-40">
                <InvoiceRecordsList/>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </>
  )
}

export default InvoiceRecordsPage