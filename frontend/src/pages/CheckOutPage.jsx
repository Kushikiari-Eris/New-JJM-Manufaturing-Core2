import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useCartStore } from '../stores/useCartStore';
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { useNavigate } from 'react-router-dom';


const stripePromise = loadStripe(
    "pk_test_51QeuG9F9TK0zPPGj1HvY7eS2zYiYcnp1NorgjFS3laJHgzXUjwqOVAHzVBMcRyg4wQwMs5FST4gmSF4wM2AzA58K00PakG2IqM"
);

const CheckOutPage = () => {
    const { total, subtotal, coupon, cart, clearCart, loading } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const navigate = useNavigate();
    const [loadingButton, setLoadingButton] = useState(false);


   const [formData, setFormData] = useState({
        name: "",
        line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: ""
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
        let rawValue = value.replace(/\D/g, ""); // Remove non-numeric characters

        // Ensure the phone number starts with '63' after + (Philippines country code)
        if (rawValue.startsWith("63")) {
        rawValue = rawValue.substring(2); // Remove the "63" from the start
        }

        // Format dynamically as user types
        let formattedValue = rawValue;

        if (formattedValue.length > 0) {
        formattedValue = `+63 ${formattedValue.substring(0, 3)} ${formattedValue.substring(3, 6)} ${formattedValue.substring(6, 10)}`;
        }

        // Ensure backspacing works by allowing empty input
        if (value === "") {
        formattedValue = "";
        }

        setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
        }));
    } else {
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    }
    };



    
    const shippingFee = 50;
    const formattedSubtotal = subtotal;
    const formattedTotal = paymentMethod === "Stripe" 
    ? subtotal  // Exclude shipping fee
    : (shippingFee + subtotal);

    const handleStripePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/stripe-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

    const handleCODPayment = async () => {
    
    if (!formData.name || !formData.line1 || !formData.city || !formData.state || !formData.postal_code || !formData.country) {
        alert("Please fill in all delivery details.");
        return;
    }

    try {
        
        const res = await axios.post("/payments/cod-checkout-session", {
            products: cart,
            totalAmount: formattedTotal,
            subTotal: formattedSubtotal,
            shippingFee: shippingFee,
            paymentMethod: "COD",
            shippingAddress: formData
        });

        if (res.status === 201) {
            clearCart();
            navigate("/cod-success");
        } else {
            alert("Your cart is empty");
        }
    } catch (error) {
        console.error("COD Payment Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Your cart is empty.");
    }
};

    const handlePlaceOrder = async () => {
        if (loadingButton) return; // Prevent multiple clicks
        setLoadingButton(true); // Start loading

        try {
            if (paymentMethod === "COD") {
                await handleCODPayment();
            } else {
                await handleStripePayment();
            }
        } finally {
            setLoadingButton(false); // Stop loading
        }
    };

    if (loading) {
        return <LoadingSpinner/>
    }

  return (
    <>
    <motion.div
        className="mx-auto w-full flex-none px-4 sm:px-6 lg:px-8 max-w-4xl mb-36 xl:max-w-7xl mt-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        >
        <div className="py-10 flex flex-col lg:flex-row justify-center gap-10">
            
            {/* DELIVERY INFORMATION SECTION */}
            <div className="flex-1 p-6 ">
                <h2 className="text-gray-700 font-medium text-2xl">
                    DELIVERY <span className="text-green-500">INFORMATION</span>
                </h2>

                <div className="mt-10">
                    <form action="" className="w-full max-w-2xl">
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Address Line 1"
                                name="line1"
                                value={formData.line1}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        <div className='mb-5'>
                            <input
                                type="text"
                                placeholder="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <input
                                type="text"
                                placeholder="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Postal Code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="+63 923 334 2012"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                                pattern="^\+63\s?\d{3}\s?\d{3}\s?\d{4}$"
                                title="Enter a valid Philippine phone number in +63 923 334 2012 format"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* CART TOTAL SECTION */}
            <div className="flex-1 p-6 ">
                <motion.div
                className="mx-auto mt-6 w-full space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-gray-700 font-medium text-2xl">
                    CART <span className="text-green-500">TOTAL</span>
                    </h2>

                    <div className="mt-5">
                        <div className="flex justify-between border-b py-2">
                            <p>Subtotal</p>
                            <p>₱{formattedSubtotal}</p>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <p>Shipping Fee</p>
                            <p>₱{paymentMethod === "Stripe" ? "Included in Stripe" : shippingFee}</p>
                        </div>
                        <div className="flex justify-between py-2">
                            <p className='font-bold'>Total</p>
                            <p className='font-bold'>₱{formattedTotal}</p>
                        </div>
                    </div>

                    <h2 className="text-gray-700 font-medium text-2xl">
                    PAYMENT <span className="text-green-500">METHOD</span>
                    </h2>

                    <div className='flex flex-col lg:flex-row justify-center gap-5'>
                        <div className='flex-1'>
                            <div className="flex items-center gap-2 border p-2">
                                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="radio radio-success" />
                                <label className="font-medium text-gray-600">
                                    CASH ON DELIVERY
                                </label>
                            </div>
                        </div>
                        <div className='flex-1 '>
                            <div className="flex items-center gap-2 border p-2">
                                <input type="radio" name="paymentMethod" value="Stripe" checked={paymentMethod === "Stripe"} onChange={() => setPaymentMethod("Stripe")} className="radio radio-success" />
                                <label className="">
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" 
                                        alt="Stripe Logo" 
                                        className="w-11 h-auto"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                        <div>
                        <motion.button
                            className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                                loadingButton ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={loadingButton}
                            onClick={handlePlaceOrder}
                        >
                            {loadingButton ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 animate-spin mr-2 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Place Order"
                            )}
                        </motion.button>
                        </div>
                </motion.div>
            </div>

        </div>
    </motion.div>

    </>
  )
}

export default CheckOutPage