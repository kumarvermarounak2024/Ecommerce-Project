import React, { useState } from "react";
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../auth/ApiConnect";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Default to user, admin can be set separately
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    const { name, email, mobile, password, confirmPassword } = formData;

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!mobile.trim()) {
      setError("Mobile number is required");
      return false;
    }

    // Mobile validation (Indian mobile number format)
    // const mobileRegex = /^[6-9]\d{9}$/;
    // if (!mobileRegex.test(mobile)) {
    //   setError("Please enter a valid 10-digit mobile number");
    //   return false;
    // }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;

      const response = await registerUser(userData);

      if (response && response.success) {
        setSuccess("Registration successful! Please check your email for verification.");

        // Clear form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          role: "customer",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-200 rounded-full opacity-20 animate-ping"></div>
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-500 p-8 text-center relative lg:w-2/5">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              {/* Logo */}
              <div className="flex items-center justify-center">
                <img
                  src={logo}
                  alt="Mandir Store Logo"
                  className="w-120 h-140 transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>

              {/* Welcome Text */}
              {/* <div className="text-white">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">Join Mandir Store</h2>
                <p className="text-white/90 text-sm lg:text-base">
                  Create your account to explore our collection of spiritual books, malas, and sacred items
                </p>
              </div> */}

              {/* Features List */}
              {/* <div className="mt-6 space-y-3 text-white/90 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Access to exclusive spiritual products</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Secure and fast checkout</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Order tracking and support</span>
                </div>
              </div> */}

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 lg:p-8 lg:w-3/5">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h3>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            {/* Success Alert */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-green-800 text-sm font-medium">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="text-red-500 w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-400 group-focus-within:text-orange-500 w-5 h-5 transition-colors duration-200" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      className="block w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="text-gray-400 group-focus-within:text-orange-500 w-5 h-5 transition-colors duration-200" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      className="block w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 group-focus-within:text-orange-500 w-5 h-5 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-400 group-focus-within:text-orange-500 w-5 h-5 transition-colors duration-200" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      className="block w-full pl-12 pr-12 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-400 hover:text-orange-500 w-5 h-5 transition-colors duration-200" />
                      ) : (
                        <Eye className="text-gray-400 hover:text-orange-500 w-5 h-5 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-gray-400 group-focus-within:text-orange-500 w-5 h-5 transition-colors duration-200" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      className="block w-full pl-12 pr-12 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-gray-400 hover:text-orange-500 w-5 h-5 transition-colors duration-200" />
                      ) : (
                        <Eye className="text-gray-400 hover:text-orange-500 w-5 h-5 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="font-semibold text-orange-600 hover:text-orange-500">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-orange-600 hover:text-orange-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200">
            <Shield className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-xs text-gray-600 font-medium">
              Secure Registration
            </span>
            <Sparkles className="w-4 h-4 text-yellow-500 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;