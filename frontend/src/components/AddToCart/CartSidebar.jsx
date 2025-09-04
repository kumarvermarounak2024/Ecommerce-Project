// import React, { useEffect, useState } from "react";
// import {
//   ShoppingCart,
//   X,
//   Plus,
//   Minus,
//   Trash2,
//   User,
//   MapPin,
//   CreditCard,
//   Upload,
//   CheckCircle,
// } from "lucide-react";
// import QR from "../../assets/qr.jpeg"
// import axios from "axios";

// // Mock cart helpers (replace with your actual implementation)

// const cartHelpers = {
//   formatPrice: (price) => `₹${price?.toLocaleString()}`,
  
//   generateOrderSummary: (items) => {
//     const subtotal = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     return {
//       itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
//       subtotal,
//       savings: items.reduce(
//         (sum, item) =>
//           sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
//         0
//       ),
//       shipping: items.shippingPrice,
//       total: subtotal,
//     };
//   },

//   isFreeShippingApplicable: (amount) => amount >= 999,
// };


// // Checkout Modal Component
// const CheckoutModal = ({ isOpen, onClose, cartItems, getTotalPrice }) => {
//   console.log("items cart", cartItems);
//   const [formData, setFormData] = useState({
//     name: "",
//     contact: "",
//     address: "",
//     pincode: "",
//     country: "India",
//     image: null,
//   });

//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success"); // success or error
//   const [errors, setErrors] = useState({});
//   const [userInfo, setUserInfo] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Mock user data (replace with actual logged-in user data)
//   useEffect(() => {
//     const fetchUser = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         console.warn("No user ID found in localStorage.");
//         return;
//       }

//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_APP_BASE_URL
//           }/auth/getCustomerById/${userId}`
//         );
//         if (res.data) {
//           setUserInfo({
//             name: res.data.name,
//             email: res.data.email,
//             contact: res.data.mobile,
//             orders: Math.floor(Math.random() * 10 + 1),
//             avatar:
//               "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   if (!userInfo) {
//     return <div>Loading user info...</div>;
//   }
//   if (!isOpen) return null;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         image: file,
//       }));
//       if (errors.image) {
//         setErrors((prev) => ({
//           ...prev,
//           image: "",
//         }));
//       }
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.contact.trim()) newErrors.contact = "Contact is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
//     if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
//     if (!formData.image)
//       newErrors.image = "Payment screenshot is required";

//     // Contact validation
//     if (
//       formData.contact &&
//       !/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))
//     ) {
//       newErrors.contact = "Please enter a valid 10-digit contact number";
//     }

//     // Pincode validation
//     if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = "Please enter a valid 6-digit pincode";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const showToastMessage = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);

//     // Hide toast after 3 seconds
//     setTimeout(() => {
//       setShowToast(false);
//     }, 3000);
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!validateForm()) {
//   //     return;
//   //   }

//   //   setIsSubmitting(true);

//   //   try {
//   //     const userId = localStorage.getItem("userId");

//   //     if (!userId) {
//   //       showToastMessage("User not logged in. Please login first.", "error");
//   //       setIsSubmitting(false);
//   //       return;
//   //     }

//   //     // Prepare order data according to your API requirements

//   //     const orderData = {
//   //       userId: userId,
//   //       items: cartItems.map((items) => ({
//   //         product: items.id, // assuming item.id is the product ID
//   //         quantity: items.quantity,
//   //         price: items.price,
//   //         hsnCode: items.hsnCode,
//   //       })),

//   //       shippingAddress: {
//   //         fullName: formData.name,
//   //         phone: formData.contact,
//   //         addressLine: formData.address,
//   //         city: formData.city,
//   //         state: formData.state,
//   //         postalCode: formData.pincode,
//   //         country: formData.country,
//   //       },
//   //       paymentMethod: "Online",
//   //     };

//   //     console.log("Submitting order data:", orderData);

//   //     // Make API call to create order
//   //     const response = await axios.post(
//   //       `${import.meta.env.VITE_APP_BASE_URL}/order/createOrder`,
//   //       orderData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     console.log("Order created successfully:", response.data);

//   //     // Show success message
//   //     showToastMessage("Order submitted successfully!", "success");

//   //     // Close modal and reset form after successful submission
//   //     setTimeout(() => {
//   //       onClose();
//   //       // Reset form
//   //       setFormData({
//   //         name: "",
//   //         contact: "",
//   //         address: "",
//   //         pincode: "",
//   //         country: "India",
//   //         image: null,
//   //       });

//   //       // Optionally clear the cart here if you have a clearCart function
//   //       // clearCart();
//   //     }, 2000);
//   //   } catch (error) {
//   //     console.error("Error creating order:", error);

//   //     // Show error message
//   //     const errorMessage =
//   //       error.response?.data?.message ||
//   //       error.response?.data?.error ||
//   //       "Failed to submit order. Please try again.";

//   //     showToastMessage(errorMessage, "error");
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!validateForm()) {
//       return;
//     }
  
//     setIsSubmitting(true);
  
//     try {
//       const userId = localStorage.getItem("userId");
  
//       if (!userId) {
//         showToastMessage("User not logged in. Please login first.", "error");
//         setIsSubmitting(false);
//         return;
//       }
  
//       // Create FormData to handle image upload + other data
//       const form = new FormData();
//       form.append("userId", userId);
//       form.append("image", formData.image); // 👈 Payment screenshot
  
//       form.append(
//         "items",
//         JSON.stringify(
//           cartItems.map((item) => ({
//             product: item.id,
//             quantity: item.quantity,
//             price: item.price,
//             hsnCode: item.hsnCode,
//           }))
//         )
//       );
  
//       form.append(
//         "shippingAddress",
//         JSON.stringify({
//           fullName: formData.name,
//           phone: formData.contact,
//           addressLine: formData.address,
//           city: formData.city,
//           state: formData.state,
//           postalCode: formData.pincode,
//           country: formData.country,
//         })
//       );
  
//       form.append("paymentMethod", "Online");
  
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_BASE_URL}/order/createOrder`,
//         form,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // 👈 Required
//           },
//         }
//       );
  
//       console.log("Order created successfully:", response.data);
//       showToastMessage("Order submitted successfully!", "success");
  
//       setTimeout(() => {
//         onClose();
//         setFormData({
//           name: "",
//           contact: "",
//           address: "",
//           pincode: "",
//           country: "India",
//           image: null,
//         });
//       }, 2000);
//     } catch (error) {
//       console.error("Error creating order:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to submit order. Please try again.";
//       showToastMessage(errorMessage, "error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const Toast = () => {
//     if (!showToast) return null;

//     const bgColor = toastType === "success" ? "bg-green-500" : "bg-red-500";
//     const icon =
//       toastType === "success" ? (
//         <CheckCircle className="h-5 w-5" />
//       ) : (
//         <X className="h-5 w-5" />
//       );

//     return (
//       <div
//         className={`fixed top-4 right-4 z-[60] ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce`}
//       >
//         {icon}
//         <span>{toastMessage}</span>
//       </div>
//     );
//   };

//   const orderSummary = cartHelpers.generateOrderSummary(cartItems);

//   return (
//     <>
//       <Toast />
//       <div className="fixed inset-0 z-50">
//         {/* Overlay */}
//         <div
//           className="absolute inset-0 bg-black bg-opacity-50"
//           onClick={onClose}
//         ></div>

//         {/* Modal */}
//         <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
//           <div className="flex flex-col h-full">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b bg-orange-50">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Enter Your Shipping Details
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 disabled={isSubmitting}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-4">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Left Side - Form (2/3 width) */}
//                 <div className="lg:col-span-2">
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Shipping Address Section */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex items-center space-x-2 mb-4">
//                         <MapPin className="h-5 w-5 text-orange-500" />
//                         <h3 className="text-lg font-semibold text-gray-800">
//                           Shipping Address
//                         </h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-500" : "border-gray-300"
//                               } ${isSubmitting ? "bg-gray-100" : ""}`}
//                             placeholder="Enter your name"
//                           />
//                           {errors.name && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.name}
//                             </p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Contact <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="tel"
//                             name="contact"
//                             value={formData.contact}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.contact
//                               ? "border-red-500"
//                               : "border-gray-300"
//                               } ${isSubmitting ? "bg-gray-100" : ""}`}
//                             placeholder="Enter contact number"
//                           />
//                           {errors.contact && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.contact}
//                             </p>
//                           )}
//                         </div>

//                         <div className="md:col-span-2">
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Address <span className="text-red-500">*</span>
//                           </label>
//                           <textarea
//                             name="address"
//                             value={formData.address}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             rows={3}
//                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.address
//                               ? "border-red-500"
//                               : "border-gray-300"
//                               } ${isSubmitting ? "bg-gray-100" : ""}`}
//                             placeholder="Enter your complete address"
//                           />
//                           {errors.address && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.address}
//                             </p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isSubmitting ? "bg-gray-100" : ""
//                               }`}
//                             placeholder="Enter city"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             State
//                           </label>
//                           <input
//                             type="text"
//                             name="state"
//                             value={formData.state}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isSubmitting ? "bg-gray-100" : ""
//                               }`}
//                             placeholder="Enter state"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Pincode <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="pincode"
//                             value={formData.pincode}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.pincode
//                               ? "border-red-500"
//                               : "border-gray-300"
//                               } ${isSubmitting ? "bg-gray-100" : ""}`}
//                             placeholder="Enter pincode"
//                           />
//                           {errors.pincode && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {errors.pincode}
//                             </p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Country
//                           </label>
//                           <input
//                             type="text"
//                             name="country"
//                             value={formData.country}
//                             onChange={handleInputChange}
//                             disabled={isSubmitting}
//                             className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isSubmitting ? "bg-gray-100" : ""
//                               }`}
//                             placeholder="Enter country"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Payment Section */}
//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <div className="flex items-center space-x-2 mb-4">
//                         <CreditCard className="h-5 w-5 text-blue-500" />
//                         <h3 className="text-lg font-semibold text-gray-800">
//                           Payment
//                         </h3>
//                       </div>

//                       {/* QR Code */}
//                       <div className="mb-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">
//                           Scan QR Code for Payment
//                         </h4>
//                         <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
//                           <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
//                             <img src={QR} alt="Qr" />
//                           </div>
//                           <p className="text-xs text-gray-500 mt-4">
//                             Scan with your payment app
//                           </p>
//                           {/* <p  className="text-xs text-gray-500 mt-4"> UPI ID- 12340102@cbin</p> */}
//                         </div>
//                         <h4 className="text-sm font-medium text-gray-700 mb-2 mt-2">
//                           UPI ID for Payment
//                         </h4>
//                         <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center mt-2">

//                           <p className="text-xl text-gray-500 mt-4"> UPI ID- 12340102@cbin</p>
//                         </div>
//                       </div>

//                       {/* Payment Screenshot Upload */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload Payment Screenshot{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
//                           <div className="space-y-1 text-center">
//                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                             <div className="flex text-sm text-gray-600">
//                               <label
//                                 htmlFor="payment-upload"
//                                 className={`relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 ${isSubmitting
//                                   ? "pointer-events-none opacity-50"
//                                   : ""
//                                   }`}
//                               >
//                                 <span>Upload a file</span>
//                                 <input
//                                   id="payment-upload"
//                                   name="payment-upload"
//                                   type="file"
//                                   accept="image/*"
//                                   onChange={handleFileUpload}
//                                   disabled={isSubmitting}
//                                   className="sr-only"
//                                 />
//                               </label>
//                               <p className="pl-1">or drag and drop</p>
//                             </div>
//                             <p className="text-xs text-gray-500">
//                               PNG, JPG, GIF up to 10MB
//                             </p>
//                           </div>
//                         </div>
//                         {formData.image && (
//                           <p className="text-sm text-green-600 mt-2">
//                             ✓ {formData.image.name} uploaded
//                           </p>
//                         )}
//                         {errors.image && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {errors.image}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full py-3 rounded-lg font-medium transition-colors ${isSubmitting
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-orange-500 hover:bg-orange-600"
//                         } text-white`}
//                     >
//                       {isSubmitting ? "Submitting Order..." : "Submit Order"}
//                     </button>
//                   </form>
//                 </div>

//                 {/* Right Side - User Details & Order Summary (1/3 width) */}
//                 <div className="space-y-4">
//                   {/* User Information */}
//                   <div className="bg-white border rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                       Customer Information
//                     </h3>
//                     <div className="flex items-center space-x-3 mb-3">
//                       <img
//                         src={userInfo.avatar}
//                         alt={userInfo.name}
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                       <div>
//                         <h4 className="font-medium text-gray-800">
//                           {userInfo.name}
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           {userInfo.orders} orders
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {userInfo.contact}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {userInfo.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Summary */}

//                   <div className="bg-white border rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                       Order Summary
//                     </h3>

//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">
//                           Subtotal ({orderSummary.itemCount} items):
//                         </span>
//                         <span>
//                           {cartHelpers.formatPrice(orderSummary.subtotal + orderSummary.savings)}
//                         </span>
//                       </div>

//                       {orderSummary.savings > 0 && (
//                         <div className="flex justify-between text-green-600">
//                           <span>You save:</span>
//                           <span>
//                             -{cartHelpers.formatPrice(orderSummary.savings)}
//                           </span>
//                         </div>
//                       )}

//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Shipping:</span>
//                         <span
//                           className={
//                             cartHelpers.isFreeShippingApplicable(orderSummary.subtotal)
//                               ? "text-green-600"
//                               : ""
//                           }
//                         >
//                           {cartHelpers.isFreeShippingApplicable(orderSummary.subtotal)
//                             ? "FREE"
//                             : cartHelpers.formatPrice(orderSummary.shipping)}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Total */}
//                     <div className="flex justify-between items-center pt-2 mt-2 border-t">
//                       <span className="text-lg font-semibold text-gray-800">
//                         Total:
//                       </span>
//                       <span className="text-lg font-bold text-orange-500">
//                         {cartHelpers.formatPrice(orderSummary.subtotal)}
//                       </span>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Cart Item Component
// const CartItem = ({ item, updateQuantity, removeFromCart }) => {
//   return (
//     <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
//       <img
//         src={item.image}
//         alt={item.name}
//         className="w-16 h-16 object-cover rounded-lg"
//       />
//       <div className="flex-1">
//         <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
//           {item.name}
//         </h3>
//         <p className="text-orange-500 font-semibold">
//           {cartHelpers.formatPrice(item.price)}
//         </p>
//         {item.originalPrice && item.originalPrice > item.price && (
//           <p className="text-xs text-gray-500 line-through">
//             {cartHelpers.formatPrice(item.originalPrice)}
//           </p>
//         )}
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//               className="p-1 hover:bg-gray-200 rounded transition-colors"
//               disabled={item.quantity <= 1}
//             >
//               <Minus className="h-4 w-4" />
//             </button>
//             <span className="font-medium min-w-[20px] text-center">
//               {item.quantity}
//             </span>
//             <button
//               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//               className="p-1 hover:bg-gray-200 rounded transition-colors"
//             >
//               <Plus className="h-4 w-4" />
//             </button>
//           </div>
//           <button
//             onClick={() => removeFromCart(item.id)}
//             className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
//             title="Remove item"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Empty Cart Component
// const EmptyCart = () => {
//   return (
//     <div className="text-center py-8">
//       <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//       <p className="text-gray-500 mb-2">Your cart is empty</p>
//       <p className="text-sm text-gray-400">
//         Add some spiritual products to get started
//       </p>
//     </div>
//   );
// };

// // Cart Summary Component
// const CartSummary = ({ cartItems, getTotalPrice, onCheckout }) => {
//   const orderSummary = cartHelpers.generateOrderSummary(cartItems);
//   const isFreeShipping = cartHelpers.isFreeShippingApplicable(
//     orderSummary.subtotal
//   );

//   return (
//     <div className="border-t p-4 space-y-4">
//       {/* Order Summary */}
//       <div className="space-y-2 text-sm">
//         <div className="flex justify-between">
//           <span className="text-gray-600">
//             Subtotal ({orderSummary.itemCount} items):
//           </span>
//           <span>
//             {cartHelpers.formatPrice(orderSummary.subtotal + orderSummary.savings)}
//           </span>
//         </div>

//         {orderSummary.savings > 0 && (
//           <div className="flex justify-between text-green-600">
//             <span>You save :</span>
//             <span>-{cartHelpers.formatPrice(orderSummary.savings)}</span>
//           </div>
//         )}

//         <div className="flex justify-between">
//           <span className="text-gray-600">Shipping:</span>
//           <span className={isFreeShipping ? "text-green-600" : ""}>
//             {isFreeShipping
//               ? "FREE"
//               : cartHelpers.formatPrice(orderSummary.shipping)}
//           </span>
//         </div>

//         {!isFreeShipping && (
//           <div className="text-xs text-orange-600">
//             Add {cartHelpers.formatPrice(999 - orderSummary.subtotal)} more for
//             free shipping...!
//           </div>
//         )}
//       </div>

//       {/* Total */}
//       <div className="flex justify-between items-center pt-2 border-t">
//         <span className="text-lg font-semibold text-gray-800">Total:</span>
//         <span className="text-lg font-bold text-orange-500">
//           {cartHelpers.formatPrice(orderSummary.subtotal)}
//         </span>
//       </div>

//       {/* Checkout Button */}
//       <button
//         onClick={onCheckout}
//         className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
//       >
//         Proceed to Buy
//       </button>
//     </div>

//   );
// };

// // Main Cart Sidebar Component with Checkout Modal
// const CartSidebar = ({
//   isOpen,
//   onClose,
//   cartItems,
//   updateQuantity,
//   removeFromCart,
//   getTotalPrice,
//   clearCart,
// }) => {
//   const [showCheckoutModal, setShowCheckoutModal] = useState(false);

//   if (!isOpen) return null;

//   // Sample cart items for demo
//   const sampleCartItems = cartItems.length > 0 ? cartItems : [];

//   const handleCheckout = () => {
//     setShowCheckoutModal(true);
//   };

//   const handleClearCart = () => {
//     if (window.confirm("Are you sure you want to clear your cart?")) {
//       clearCart();
//     }
//   };

//   const mockGetTotalPrice = () => {
//     return sampleCartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-40">
//         {/* Overlay */}
//         <div
//           className="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity"
//           onClick={onClose}
//         ></div>

//         {/* Cart Sidebar */}
//         <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
//           <div className="flex flex-col h-full">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b bg-white">
//               <div className="flex items-center space-x-2">
//                 <ShoppingCart className="h-5 w-5 text-orange-500" />
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Shopping Cart
//                 </h2>
//                 {sampleCartItems.length > 0 && (
//                   <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
//                     {sampleCartItems.length}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center space-x-2">
//                 {sampleCartItems.length > 0 && (
//                   <button
//                     onClick={handleClearCart}
//                     className="text-xs text-red-500 hover:text-red-700 transition-colors"
//                     title="Clear cart"
//                   >
//                     Clear All
//                   </button>
//                 )}
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Cart Items */}
//             <div className="flex-1 overflow-y-auto p-4">
//               {sampleCartItems.length === 0 ? (
//                 <EmptyCart />
//               ) : (
//                 <div className="space-y-4">
//                   {sampleCartItems.map((item) => (
//                     <CartItem
//                       key={item.id}
//                       item={item}
//                       updateQuantity={updateQuantity || (() => { })}
//                       removeFromCart={removeFromCart || (() => { })}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Footer with Summary */}
//             {sampleCartItems.length > 0 && (
//               <CartSummary
//                 cartItems={sampleCartItems}
//                 getTotalPrice={getTotalPrice || mockGetTotalPrice}
//                 onCheckout={handleCheckout}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       <CheckoutModal
//         isOpen={showCheckoutModal}
//         onClose={() => setShowCheckoutModal(false)}
//         cartItems={sampleCartItems}
//         getTotalPrice={getTotalPrice || mockGetTotalPrice}
//       />
//     </>
//   );
// };

// export default CartSidebar;

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  User,
  MapPin,
  CreditCard,
  Upload,
  CheckCircle,
} from "lucide-react";
import QR from "../../assets/qr.jpeg";
import axios from "axios";

// Mock cart helpers (replace with your actual implementation)
const cartHelpers = {
  formatPrice: (price) => `₹${price?.toLocaleString()}`,

  generateOrderSummary: (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate shipping as the sum of all items' shipping prices
    const shipping = items.reduce(
      (sum, item) => sum + (item.shippingPrice || 0) * item.quantity,
      0
    );

    return {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      savings: items.reduce(
        (sum, item) =>
          sum +
          ((item.originalPrice || item.price) - item.price) * item.quantity,
        0
      ),
      shipping, // Use the calculated shipping value here
      total: subtotal + shipping,
    };
  },
};

// Checkout Modal Component
const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  getTotalPrice,
  clearCart,
}) => {
  console.log("items cart", cartItems);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    pincode: "",
    country: "India",
    image: null,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  const [errors, setErrors] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No user ID found in localStorage.");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/auth/getCustomerById/${userId}`
        );
        if (res.data) {
          setUserInfo({
            name: res.data.name,
            email: res.data.email,
            contact: res.data.mobile,
            orders: Math.floor(Math.random() * 10 + 1),
            avatar: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!userInfo) {
    return <div>Loading user info...</div>;
  }
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.image) newErrors.image = "Payment screenshot is required";

    // Contact validation
    if (
      formData.contact &&
      !/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))
    ) {
      newErrors.contact = "Please enter a valid 10-digit contact number";
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        showToastMessage("User not logged in. Please login first.", "error");
        setIsSubmitting(false);
        return;
      }

      // Create FormData to handle image upload + other data
      const form = new FormData();
      form.append("userId", userId);
      form.append("image", formData.image);

      form.append(
        "items",
        JSON.stringify(
          cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price,
            hsnCode: item.hsnCode,
            shippingPrice: item.shippingPrice, // Include shipping price
          }))
        )
      );

      form.append(
        "shippingAddress",
        JSON.stringify({
          fullName: formData.name,
          phone: formData.contact,
          addressLine: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: formData.country,
        })
      );

      form.append("paymentMethod", "Online");

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/order/createOrder`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Order created successfully:", response.data);
      showToastMessage("Order submitted successfully!", "success");

      // Clear the cart after successful order
      if (clearCart && typeof clearCart === "function") {
        clearCart();
      }

      setTimeout(() => {
        onClose();
        setFormData({
          name: "",
          contact: "",
          address: "",
          pincode: "",
          country: "India",
          image: null,
        });
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit order. Please try again.";
      showToastMessage(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Toast = () => {
    if (!showToast) return null;

    const bgColor = toastType === "success" ? "bg-green-500" : "bg-red-500";
    const icon =
      toastType === "success" ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      );

    return (
      <div
        className={`fixed top-4 right-4 z-[60] ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce`}
      >
        {icon}
        <span>{toastMessage}</span>
      </div>
    );
  };

  const orderSummary = cartHelpers.generateOrderSummary(cartItems);

  return (
    <>
      <Toast />
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-orange-50">
              <h2 className="text-xl font-bold text-gray-800">
                Enter Your Shipping Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Form (2/3 width) */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Shipping Address Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Shipping Address
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-100" : ""}`}
                            placeholder="Enter your name"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors.contact
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-100" : ""}`}
                            placeholder="Enter contact number"
                          />
                          {errors.contact && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contact}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors.address
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-100" : ""}`}
                            placeholder="Enter your complete address"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isSubmitting ? "bg-gray-100" : ""
                            }`}
                            placeholder="Enter city"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isSubmitting ? "bg-gray-100" : ""
                            }`}
                            placeholder="Enter state"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors.pincode
                                ? "border-red-500"
                                : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-100" : ""}`}
                            placeholder="Enter pincode"
                          />
                          {errors.pincode && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.pincode}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isSubmitting ? "bg-gray-100" : ""
                            }`}
                            placeholder="Enter country"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Payment
                        </h3>
                      </div>

                      {/* QR Code */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Scan QR Code for Payment
                        </h4>
                        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                          <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                            <img src={QR} alt="Qr" />
                          </div>
                          <p className="text-xs text-gray-500 mt-4">
                            Scan with your payment app
                          </p>
                        </div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 mt-2">
                          UPI ID for Payment
                        </h4>
                        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center mt-2">
                          <p className="text-xl text-gray-500 mt-4">
                            {" "}
                            UPI ID- 12340102@cbin
                          </p>
                        </div>
                      </div>

                      {/* Payment Screenshot Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Payment Screenshot{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="payment-upload"
                                className={`relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 ${
                                  isSubmitting
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }`}
                              >
                                <span>Upload a file</span>
                                <input
                                  id="payment-upload"
                                  name="payment-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  disabled={isSubmitting}
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                        {formData.image && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData.image.name} uploaded
                          </p>
                        )}
                        {errors.image && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.image}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      } text-white`}
                    >
                      {isSubmitting ? "Submitting Order..." : "Submit Order"}
                    </button>
                  </form>
                </div>

                {/* Right Side - User Details & Order Summary (1/3 width) */}
                <div className="space-y-4">
                  {/* User Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Customer Information
                    </h3>
                    <div className="flex items-center space-x-3 mb-3">
                      {/* <img
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {userInfo.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {userInfo.orders} orders
                        </p>
                        <p className="text-sm text-gray-600">
                          {userInfo.contact}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Order Summary
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subtotal ({orderSummary.itemCount} items):
                        </span>
                        <span>
                          {cartHelpers.formatPrice(
                            orderSummary.subtotal + orderSummary.savings
                          )}
                        </span>
                      </div>

                      {orderSummary.savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>You save:</span>
                          <span>
                            -{cartHelpers.formatPrice(orderSummary.savings)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>
                          {cartHelpers.formatPrice(orderSummary.shipping)}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 mt-2 border-t">
                      <span className="text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-orange-500">
                        {cartHelpers.formatPrice(orderSummary.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Cart Item Component
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
          {item.name}
        </h3>
        <p className="text-orange-500 font-semibold">
          {cartHelpers.formatPrice(item.price)}
        </p>
        {item.originalPrice && item.originalPrice > item.price && (
          <p className="text-xs text-gray-500 line-through">
            {cartHelpers.formatPrice(item.originalPrice)}
          </p>
        )}
        {item.shippingPrice && (
          <p className="text-xs text-gray-500">
            Shipping: {cartHelpers.formatPrice(item.shippingPrice)}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-medium min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="text-center py-8">
      <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-2">Your cart is empty</p>
      <p className="text-sm text-gray-400">
        Add some spiritual products to get started
      </p>
    </div>
  );
};

// Cart Summary Component
const CartSummary = ({ cartItems, getTotalPrice, onCheckout }) => {
  const orderSummary = cartHelpers.generateOrderSummary(cartItems);

  return (
    <div className="border-t p-4 space-y-4">
      {/* Order Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({orderSummary.itemCount} items):
          </span>
          <span>
            {cartHelpers.formatPrice(
              orderSummary.subtotal + orderSummary.savings
            )}
          </span>
        </div>

        {orderSummary.savings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>You save :</span>
            <span>-{cartHelpers.formatPrice(orderSummary.savings)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span>{cartHelpers.formatPrice(orderSummary.shipping)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-lg font-semibold text-gray-800">Total:</span>
        <span className="text-lg font-bold text-orange-500">
          {cartHelpers.formatPrice(orderSummary.total)}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
      >
        Proceed to Buy
      </button>
    </div>
  );
};

// Main Cart Sidebar Component with Checkout Modal
const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  clearCart,
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isOpen) return null;

  // Sample cart items for demo
  const sampleCartItems = cartItems.length > 0 ? cartItems : [];

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const mockGetTotalPrice = () => {
    return sampleCartItems.reduce(
      (sum, item) =>
        sum + (item.price + (item.shippingPrice || 0)) * item.quantity,
      0
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Cart Sidebar */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Shopping Cart
                </h2>
                {sampleCartItems.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {sampleCartItems.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {sampleCartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    title="Clear cart"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {sampleCartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="space-y-4">
                  {sampleCartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity || (() => {})}
                      removeFromCart={removeFromCart || (() => {})}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Summary */}
            {sampleCartItems.length > 0 && (
              <CartSummary
                cartItems={sampleCartItems}
                getTotalPrice={getTotalPrice || mockGetTotalPrice}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={sampleCartItems}
        getTotalPrice={getTotalPrice || mockGetTotalPrice}
        clearCart={clearCart}
      />
    </>
  );
};

export default CartSidebar;