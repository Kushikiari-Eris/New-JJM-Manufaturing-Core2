import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Main invoice schema
const invoiceSchema = new mongoose.Schema(
  {
    purchaseOrderId: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerContact: { type: Number, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    discounts: { type: String, required: true },
    dueDate: { type: String, required: true },
    invoiceDate: { type: String, required: true },
    items: { type: [itemSchema], required: true },
    notes: { type: String },
    orderDate: { type: String, required: true },
    orderNumber: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    subTotal: { type: Number, required: true },
    terms: { type: String, required: true },
    paymentMethod: { type: String },
    totalAmount: { type: Number, required: true },
    Status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const InvoiceRecord = mongoose.model("InvoiceRecord", invoiceSchema);

export default InvoiceRecord;
