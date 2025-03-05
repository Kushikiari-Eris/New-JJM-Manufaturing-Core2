import { stripe } from "../config/stripe.js"
import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"
import OrderTracker from "../models/orderTracker.model.js";
import { gatewayTokenGenerator } from "../middleware/gatewayTokenGenerator.js";
import axios from "axios";

export const stripeCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode, shippingAddress } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let subTotal = 0;
    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // Convert PHP to centavos
      subTotal += amount * product.quantity;
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "php",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    // ✅ Default shipping method: Lalamove
    const shippingMethod = "Lalamove";
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // ✅ Default to 3 days

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["PH"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 5000, // PHP 50 shipping fee (5000 centavos)
              currency: "php",
            },
            display_name: "Standard Shipping (Lalamove)", // ✅ Updated label
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 3 }, // ✅ Fixed 3 days
            },
          },
        },
      ],
      custom_fields: [
        {
          key: "phone_number",
          label: { type: "custom", custom: "Phone Number" },
          type: "text",
          optional: false,
        },
      ],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        customerName: shippingAddress?.name || "Unknown Customer", // ✅ Added customer name
        couponCode: couponCode || "",
        subTotal: subTotal / 100,
        shippingFee: 5000,
        shippingMethod, // ✅ Added shipping method
        deliveryDate: deliveryDate.toISOString(), // ✅ Added delivery date
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            name: p.name, // ✅ Added product name
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
      shipping: shippingAddress
        ? {
            name: shippingAddress.name,
            phone: "{CHECKOUT_SESSION_CUSTOM_FIELDS.phone_number}",
            address: {
              line1: shippingAddress.line1,
              city: shippingAddress.city,
              postal_code: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          }
        : undefined,
    });

    // ✅ Generate a coupon when the total amount reaches 500 pesos (50,000 centavos)
    if (totalAmount >= 50000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      id: session.id,
      subTotal: subTotal / 100, // Convert centavos to pesos
      totalAmount: totalAmount / 100,
      shippingMethod, // ✅ Return shipping method in response
      deliveryDate: deliveryDate.toISOString(), // ✅ Return delivery date
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};






export const codCheckoutSession = async (req, res) => {
  try {
    const { products, shippingAddress, totalAmount, subTotal, shippingFee } =
      req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Create a new order
    const newOrder = new Order({
      user: req.user._id,
      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
      })),
      subTotal,
      totalAmount,
      shippingFee,
      paymentMethod: "COD",
      orderStatus: "Pending",
      shippingAddress,
      shippingMethod: "Lalamove", // Fixed shipping method
    });

    await newOrder.save();

    // 🔹 Create an OrderTracker entry
    const newOrderTracker = new OrderTracker({
      orderId: newOrder._id,
      orderStatus: "Pending", // Default status when order is placed
    });

    await newOrderTracker.save();

    // Clean and format the contactInformation (phone number)
    const cleanPhoneNumber = newOrder.shippingAddress.phone.replace(
      /[^0-9]/g, // This regex removes anything that is not a digit
      ""
    );

    // Integrating Finance System
    try {
      const token = gatewayTokenGenerator(); // Assuming you have this token generator for authentication
      const payload = {
        orderNumber: newOrder._id.toString(), // Convert to string
        customerId: newOrder.user.toString(), // Convert to string
        customerName: newOrder.shippingAddress.name, // Name from shipping address
        orders: products.map((product) => ({
          itemName: product.name, // Product name
          quantity: product.quantity,
          price: product.price,
        })),
        paymentMethod: newOrder.paymentMethod, // Payment method is COD (Cash on Delivery)
        contactInformation: cleanPhoneNumber, // Cleaned phone number
        shippingMethod: newOrder.shippingMethod, // Lalamove
        deliveryDate: new Date(new Date().setDate(new Date().getDate() + 3)) // Assuming 3 days from now for delivery
          .toISOString()
          .slice(0, 10), // Format the date as yy-mm-dd
        customerAddress: newOrder.shippingAddress.city, // Assuming city is available in shipping address
        orderDate: newOrder.createdAt.toISOString().slice(0, 10), // Adding the order creation date (formatted as yy-mm-dd)
      };

      console.log("Sending to Finance:", payload); // Log payload for debugging

      const financeResponse = await axios.post(
        `${process.env.API_GATEWAY_URL}/finance/order-information`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Order sent to Finance:", financeResponse.data);
    } catch (financeError) {
      console.error("❌ Error sending order to Finance:", financeError.message);
      return res.status(500).json({
        message: "Error sending order to Finance",
        error: financeError.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully and tracking initialized.",
      orderId: newOrder._id,
      orderTrackerId: newOrderTracker._id,
    });
  } catch (error) {
    console.error("COD Checkout Error:", error);
    res
      .status(500)
      .json({ message: "Error processing COD order", error: error.message });
  }
};




export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details"],
    });

    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists, skipping duplicate entry.",
        orderId: existingOrder._id,
      });
    }

    const phoneField = session.custom_fields?.find(
      (field) => field.key === "phone_number"
    );
    const phoneNumber = phoneField ? phoneField.text.value : null;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: "Missing phone number in checkout session." });
    }

    const shippingMethod =
      session.metadata.shippingMethod || "Lalamove Express Shipping";

    let deliveryDate = session.metadata.deliveryDate
      ? new Date(session.metadata.deliveryDate)
      : new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    
    const formattedDeliveryDate = new Date(deliveryDate); 

    const shippingAddress = session.customer_details.address;
    const userId = session.metadata.userId;
    const customerName = session.metadata.customerName; 
    const products = JSON.parse(session.metadata.products);

    const subtotal = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      customerName, 
      products: products.map((product) => ({
        product: product.id,
        name: product.name, 
        quantity: product.quantity,
        price: product.price,
      })),
      paymentMethod: "Gcash",
      subTotal: subtotal,
      totalAmount: session.amount_total / 100,
      shippingFee: session.shipping_cost
        ? session.shipping_cost.amount_total / 100
        : 0,
      discount: session.total_details?.amount_discount
        ? session.total_details.amount_discount / 100
        : 0,
      stripeSessionId: sessionId,
      shippingMethod,
      deliveryDate: formattedDeliveryDate,
      shippingAddress: {
        name: session.customer_details.name,
        line1: shippingAddress.line1,
        city: shippingAddress.city,
        state: shippingAddress.state || "",
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country,
        phone: phoneNumber,
      },
    });

    await newOrder.save();

    const newOrderTracker = new OrderTracker({
      orderId: newOrder._id,
      orderStatus: "Pending",
    });

    await newOrderTracker.save();

    try {
      const token = gatewayTokenGenerator();
      const financeResponse = await axios.post(
        `${process.env.API_GATEWAY_URL}/finance/order-information`,
        {
          orderNumber: newOrder._id,
          customerId: userId,
          customerName,
          orders: products.map((product) => ({
            itemName: product.name, 
            quantity: product.quantity,
            price: product.price,
          })),
          paymentMethod: newOrder.paymentMethod,
          contactInformation: newOrder.shippingAddress.phone,
          orderDate: newOrder.createdAt.toISOString().slice(0, 10), 
          shippingMethod,
          deliveryDate: formattedDeliveryDate.toISOString().slice(0, 10), 
          customerAddress: newOrder.shippingAddress.city,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(" Order sent to Finance:", financeResponse.data);
    } catch (financeError) {
      console.error(" Error sending order to Finance:", financeError.message);
    }

    res.status(200).json({
      success: true,
      message:
        "Payment successful, order created, sent to finance, and order tracker initialized.",
      orderId: newOrder._id,
      orderTrackerId: newOrderTracker._id,
      shippingMethod,
      deliveryDate: formattedDeliveryDate.toISOString().slice(0, 10), 
      orderDate: newOrder.createdAt.toISOString().slice(0, 10), 
    });
  } catch (error) {
    console.error(" Error in checkoutSuccess:", error.message);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};











async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })

    return coupon.id
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId })
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId
    })
    
    await newCoupon.save()

    return newCoupon
}