import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { SidebarProvider } from "../components/SidebarContext"
import WorkOrderTable from "../components/WorkOrderTable"

const WorkOrdersPage = () => {
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
          <main className="mt-20  overflow-y-auto bg-gray-100 h-full">
            <div className='p-4'>
                <WorkOrderTable/>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </>
  )
}

export default WorkOrdersPage