import InvoiceRecord from "../models/invoiceRecords.model.js";

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceRecord.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching invoices", error: error.message });
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceRecord.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching invoice", error: error.message });
  }
};

// Update an invoice
export const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await InvoiceRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.status(200).json({ success: true, message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating invoice", error: error.message });
  }
};
