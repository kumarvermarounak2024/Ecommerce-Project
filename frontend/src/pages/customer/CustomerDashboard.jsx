import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  TrendingUp,
  Grid,
  List,
  ChevronRight,
  Gift,
  BookOpen,
  Sparkles,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";

// Import components and hooks
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import CartSidebar from "../../components/AddToCart/CartSidebar";
import Navbar from "../../components/NavbarInside";
import ToastContainer from "../../components/ToastContainer/Toast";
import axios from "axios";

// Product Modal Component
const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent bg-opacity-50">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="sticky top-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-orange-500">
                ₹{product.price}
              </span>
               {product.shippingPrice && (
                <span className="text-sm text-gray-500">
                  + ₹{product.shippingPrice} Shipping Price
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Add to Cart
            </button>

            
          </div>
        </div>
      </div>
    </div>
  );
};

// Dynamic Header Component
const DynamicHeader = ({ headerData }) => {
  if (!headerData) return null;

  return (
    <div className="bg-gradient-to-r from-orange-100 to-red-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {headerData.name || "Welcome to Gyan Vidya"}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {headerData.description}
            </p>
            {headerData.buttonText && (
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
                {headerData.buttonText}
              </button>
            )}
          </div>
          <div className="hidden md:block">
            <img
              src={
                headerData.image ||
                "https://www.divinehindu.in/cdn/shop/files/NIWIg1ElaSaA0fK04fr.jpg?v=1695127092&width=1100"
              }
              alt={headerData.imageAlt || "Spiritual Items"}
              className="rounded-lg shadow-lg h-68 ml-36"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onImageClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
          onClick={() => onImageClick(product)}
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-800">
              ₹{product.price}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Dynamic Special Offers Component
const DynamicSpecialOffers = ({ offers }) => {
  // Default offers if API data is not available
  const defaultOffers = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders above ₹999",
      icon: <Gift className="h-8 w-8 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      title: "Book Collection",
      description: "Up to 30% off on spiritual books",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      title: "Premium Quality",
      description: "Authentic spiritual products",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      bgColor: "bg-purple-50",
    },
  ];

  const displayOffers = offers && offers.length > 0 ? offers : defaultOffers;

  const getOfferIcon = (offer) => {
    if (offer.icon) {
      switch (offer.icon) {
        case "gift":
          return <Gift className="h-8 w-8 text-green-500" />;
        case "book":
        case "bookopen":
          return <BookOpen className="h-8 w-8 text-blue-500" />;
        case "sparkles":
          return <Sparkles className="h-8 w-8 text-purple-500" />;
        default:
          return <Gift className="h-8 w-8 text-green-500" />;
      }
    }
    return offer.icon || <Gift className="h-8 w-8 text-green-500" />;
  };

  const getBgColor = (offer, index) => {
    if (offer.bgColor) return offer.bgColor;

    const colors = [
      "bg-green-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-orange-50",
      "bg-red-50",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {displayOffers.slice(0, 3).map((offer, index) => (
        <div
          key={offer.id || offer._id || index}
          className={`${getBgColor(offer, index)} p-6 rounded-lg`}
        >
          <div className="flex items-center mb-3">
            {getOfferIcon(offer)}
            <h3 className="text-lg font-semibold text-gray-800 ml-3">
              {offer.name}
            </h3>
          </div>
          <p className="text-gray-600">{offer.description}</p>
          <p className="text-gray-600">{offer.offerPercentage} %</p>
          {offer.validUntil && (
            <p className="text-sm text-gray-500 mt-2">
              Valid until: {new Date(offer.validUntil).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// Dynamic Footer Component
const DynamicFooter = ({ footerData }) => {
  if (!footerData) return null;

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{footerData.name}</h3>
            <p className="text-gray-300 text-sm">
              {footerData.description ||
                "Your trusted source for authentic spiritual products and divine blessings."}
            </p>
            <div className="flex space-x-4">
              {footerData.socialMedia?.facebook && (
                <a
                  href={footerData.socialMedia.facebook}
                  className="text-gray-300 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footerData.socialMedia?.twitter && (
                <a
                  href={footerData.socialMedia.twitter}
                  className="text-gray-300 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {footerData.socialMedia?.instagram && (
                <a
                  href={footerData.socialMedia.instagram}
                  className="text-gray-300 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {footerData.quickLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url || "#"}
                    className="text-gray-300 hover:text-white"
                  >
                    {link.title || link.name}
                  </a>
                </li>
              )) || (
                <>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              {footerData.categories?.map((category, index) => (
                <li key={index}>
                  <a
                    href={`#${category.slug || category.name?.toLowerCase()}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {category.name}
                  </a>
                </li>
              )) || (
                <>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Spiritual Books
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Religious Items
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Meditation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Yoga Accessories
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm">
              {footerData.contact?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-300" />
                  <span className="text-gray-300">
                    {footerData.contact.address}
                  </span>
                </div>
              )}
              {footerData.contact?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-300">
                    {footerData.contact.phone}
                  </span>
                </div>
              )}
              {footerData.contact?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-300">
                    {footerData.contact.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>
            {footerData.copyright ||
              ` @ ${new Date().getFullYear()} Website Designed by Mansharp technologies pvt Ltd. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Dashboard Component
const CustomerDashboard = () => {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity,
  } = useCart();

  const { toasts, addToast, removeToast } = useToast();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for dynamic content
  const [headerData, setHeaderData] = useState(null);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} added to cart!`, "success");
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Fetch Header Data
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/header/getAllHeaders`
        );
        if (res.data.success && res.data.data.length > 0) {
          const activeHeader =
            res.data.data.find((header) => header.status === "active") ||
            res.data.data[0];
          setHeaderData(activeHeader);
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      }
    };

    fetchHeaderData();
  }, []);

  // Fetch Special Offers
  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/offer/getAllOffers`
        );
        if (res.data.success) {
          setSpecialOffers(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch special offers:", error);
      }
    };

    fetchSpecialOffers();
  }, []);

  // Fetch Footer Data
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/footer/getAllFooters`
        );
        if (res.data.success && res.data.data.length > 0) {
          const activeFooter =
            res.data.data.find((footer) => footer.status === "active") ||
            res.data.data[0];
          setFooterData(activeFooter);
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  // Existing useEffect for categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/category/getAllCategory`
        );
        if (res.data.success) {
          const categoryList = res.data.data.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            image: item.image,
            status: item.status,
          }));
          setCategories(categoryList);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Existing useEffect for subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/subCategory/getAllSubCategory`
        );
        if (res.data.success) {
          const subCategoryList = res.data.data.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            image: item.image,
            status: item.status,
            categoryId: item.category,
            categoryName: item.categoryName,
          }));
          setSubCategories(subCategoryList);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  // Existing useEffect for products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/product/getAllProduct`
        );
        if (res.data.success) {
          const products = res.data.data.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.images?.[0] || "",
            shippingPrice: item.shippingPrice,
            originalPrice: item.price,
            details: [
              { key: "Material", value: item.material || "Not specified" },
              { key: "Dimensions", value: item.dimensions || "Not specified" },
              { key: "Weight", value: item.weight || "Not specified" },
            ],
          }));
          setPopularProducts(products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Header functionality */}
      <Navbar
        cartCount={getTotalItems()}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        clearCart={clearCart}
      />

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search spiritual products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dynamic Header */}
      <DynamicHeader headerData={headerData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Special Offers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Special Offers
          </h2>
          <DynamicSpecialOffers offers={specialOffers} />
        </section>

        {/* Popular Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Popular Products
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button className="text-orange-500 hover:text-orange-600 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onImageClick={handleImageClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Dynamic Footer */}
      <DynamicFooter footerData={footerData} />
    </div>
  );
};

export default CustomerDashboard;
