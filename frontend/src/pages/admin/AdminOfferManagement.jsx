import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
} from "lucide-react";
import Modal from "./adminComponents/Modal";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOfferManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    offerPercentage: "",
    images: [],
  });

  const getAllOffers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/offer/getAllOffers`
      );
      setOffers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    getAllOffers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      offerPercentage: "",
      images: [],
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      offerPercentage: item.offerPercentage,
      images: [],
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = editingItem !== null;
      let endpoint = isEditing
        ? `${import.meta.env.VITE_APP_BASE_URL}/offer/updateOfferById/${editingItem._id}`
        : `${import.meta.env.VITE_APP_BASE_URL}/offer/createOffer`;

      const method = isEditing ? "PATCH" : "POST";

      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("description", formData.description);
      formPayload.append("offerPercentage", formData.offerPercentage);

      if (formData.images.length > 0) {
        formPayload.append("image", formData.images[0]);
      } else if (!isEditing) {
        toast.error("Please upload an image.");
        return;
      }

      const response = await fetch(endpoint, {
        method,
        body: formPayload,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit");

      toast.success(result.message || `${isEditing ? "Updated" : "Created"} successfully!`);

      setShowAddModal(false);
      setShowEditModal(false);
      await getAllOffers();
      setFormData({ name: "", description: "", offerPercentage: "", images: [] });
      setEditingItem(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/offer/deleteOfferById/${id}`,
          { method: "DELETE" }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to delete");
        toast.success(result.message || "Deleted successfully!");
        await getAllOffers();
      } catch (err) {
        console.error("Error:", err);
        toast.error(err.message || "Failed to delete offer");
      }
    }
  };

  const filteredOffers = offers.filter((offer) =>
    offer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Offer Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search offer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{offer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{offer.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{offer.offerPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {offer.image && (
                      <img
                        src={offer.image}
                        alt="Offer"
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={editingItem ? "Edit Offer" : "Add New Offer"}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Percentage</label>
              <input
                type="number"
                name="offerPercentage"
                value={formData.offerPercentage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...(!editingItem && { required: true })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              {editingItem ? "Update Offer" : "Add Offer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminOfferManagement;