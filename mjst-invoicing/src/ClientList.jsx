import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./AuthContext";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [editClientData, setEditClientData] = useState({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientPIC: "",
    clientPICTitle: "",
    businessSector: ""
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/clients", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    if (isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated]);

  const openEditModal = (client) => {
    setSelectedClientId(client.clientid);
    setEditClientData({
      clientName: client.clientname,
      clientAddress: client.clientaddress,
      clientPhone: client.clientphone,
      clientPIC: client.clientpic,
      clientPICTitle: client.clientpictitle,
      businessSector: client.businesssector
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClientId(null);
    setEditClientData({
      clientName: "",
      clientAddress: "",
      clientPhone: "",
      clientPIC: "",
      clientPICTitle: "",
      businessSector: ""
    });
  };

  const openDeleteModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedClientId(null);
  };

  const deleteClient = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/clients/${selectedClientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(clients.filter(client => client.clientid !== selectedClientId));
      toast.success("Client deleted successfully");
    } catch (err) {
      console.error("Error deleting client:", err.message);
      toast.error("Failed to delete client");
    } finally {
      closeDeleteModal();
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditClientData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveClient = async () => {
    console.log("Updating client with data:", editClientData); // Debugging line
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/clients/${selectedClientId}`, editClientData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Update response:", response.data); // Debugging line
      setClients(clients.map(client => client.clientid === selectedClientId ? { ...client, ...editClientData } : client));
      toast.success("Client updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Error updating client:", err.message);
      toast.error("Failed to update client");
    } finally {
      closeEditModal();
    }
  };

  const filteredClients = clients.filter(client =>
    client.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientaddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientphone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientpic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientpictitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.businesssector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientid.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Client List</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg md:w-3/4 lg:w-full">
          <thead className="bg-gray-100 border-b border-gray-200 rounded-lg">
            <tr>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Client ID
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Client Name
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Address
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Phone
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                PIC
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                PIC Title
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Business Sector
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600 border border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0
              ? filteredClients.map(client => (
                  <tr
                    key={client.clientid}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {client.clientid}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {client.clientname}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {client.clientaddress}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200 text-center">
                      {client.clientphone}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {client.clientpic}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {client.clientpictitle}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200 text-center">
                      {client.businesssector}
                    </td>
                    <td className="py-2 px-4 border-b border border-gray-200">
                      <button
                        onClick={() => openEditModal(client)}
                        className="w-full px-2 py-1 mb-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(client.clientid)}
                        className="w-full px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 border border-gray-200">
                    No clients found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Client</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={editClientData.clientName}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <textarea
                type="text"
                name="clientAddress"
                value={editClientData.clientAddress}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="clientPhone"
                value={editClientData.clientPhone}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">PIC</label>
              <input
                type="text"
                name="clientPIC"
                value={editClientData.clientPIC}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">PIC Title</label>
              <input
                type="text"
                name="clientPICTitle"
                value={editClientData.clientPICTitle}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Business Sector</label>
              <input
                type="text"
                name="businessSector"
                value={editClientData.businessSector}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-between space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={saveClient}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Client</h2>
            <p className="mb-4">Are you sure you want to delete this client?</p>
            <div className="flex justify-between space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteClient}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;