
//  import { useEffect, useState } from "react"
//  import { motion } from "framer-motion"
// // import CreateProductForm from "../components/CreateProductForm"
// // import ProductList from "../components/ProductList"
import AnalyticsTab from "../components/AnalyticsTab"
// import { useProductStore } from "../stores/useProductStore"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { SidebarProvider } from "../components/SidebarContext"

// const tabs = [
//   { id: "create", label: "Create Product", icon: PlusCircle },
//   { id: "products", label: "Products", icon: ShoppingBasket },
//   { id: "analytics", label: "Analytics", icon: BarChart },
// ]


const AdminPage = () => {
  // const [activeTab, setActiveTab] = useState("create")

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
            <AnalyticsTab/>
          </main>
        </div>
      </div>
    </SidebarProvider>
      {/* <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.h1 className='text-4xl font-bold mb-8 text-emerald-300 text-center'
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
          >
            Dashboard
          </motion.h1>

          <div className="flex justify-center mb-8">
            {tabs.map((tab) =>(
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <tab.icon className='mr-2 h-5 w-5'/>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "create" && <CreateProductForm/>}
          {activeTab === "products" && <ProductList/>}
          {activeTab === "analytics" && <AnalyticsTab/>}
        </div>
      </div> */}
    </>
  )
}

export default AdminPage