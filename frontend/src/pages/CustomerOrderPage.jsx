import React, { useEffect, useState } from 'react'
import { SidebarProvider } from '../components/SidebarContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import OrderList from '../components/OrderList'
import { useOrderStore } from '../stores/useOrderStore'
import ViewOrderList from '../components/ViewOrderList'
import OrderTrackingDetails from '../components/OrderTrackingDetails'
import LoadingSpinner from '../components/LoadingSpinner'

const CustomerOrderPage = () => {
    const { fetchAllOrder, loading } = useOrderStore()

    useEffect(() => {
        fetchAllOrder();
    }, []);

    // First modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Second modal state
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    // Open first modal
    const openModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    // Close first modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    // Open second modal
    const openSecondModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsSecondModalOpen(true);
    };

    // Close second modal
    const closeSecondModal = () => {
        setIsSecondModalOpen(false);
        setSelectedOrderId(null);
    };


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
                        <OrderList openModal={openModal} openSecondModal={openSecondModal}/>
                        {isModalOpen && <ViewOrderList orderId={selectedOrderId} onClose={closeModal} />}

                        {isSecondModalOpen && <OrderTrackingDetails orderId={selectedOrderId} onClose={closeSecondModal} />}
                    </div>

                </main>
                </div>
            </div>
        </SidebarProvider>
        
    </>
  )
}

export default CustomerOrderPage