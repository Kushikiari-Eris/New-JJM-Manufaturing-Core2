import React, { useEffect } from 'react'
import useInvoiceStore from '../stores/useInvoiceRecordsStore';

const InvoiceRecordsList = () => {
    const { invoices, fetchInvoices, loading, error } = useInvoiceStore();

    useEffect(() => {
        fetchInvoices();
    }, []);

    if (loading) return <p className="text-center text-blue-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  return (
    <>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice Records</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Invoice ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="border">
              <td className="border p-2">{invoice.orderNumber}</td>
              <td className="border p-2">{invoice.customerName}</td>
              <td className="border p-2">₱{invoice.totalAmount.toFixed(2)}</td>
              <td className="border p-2">{invoice.Status}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteInvoice(invoice._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default InvoiceRecordsList