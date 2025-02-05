import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    userfullname: "",
    username: "",
    userdepartment: "",
    useremail: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const openDeleteModal = userId => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  const openEditModal = user => {
    setSelectedUserId(user.userid);
    setEditUserData({
      userfullname: user.userfullname,
      username: user.username,
      userdepartment: user.userdepartment,
      useremail: user.useremail
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
    setEditUserData({
      userfullname: "",
      username: "",
      userdepartment: "",
      useremail: ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        fullname: editUserData.userfullname,
        username: editUserData.username,
        department: editUserData.userdepartment,
        email: editUserData.useremail,
      };
      await axios.put(`http://localhost:5000/users/${selectedUserId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => user.userid === selectedUserId ? { ...user, ...payload } : user));
      toast.success("User updated successfully!");
      closeEditModal();
      window.location.reload();
    } catch (err) {
      console.error("Error updating user:", err.message);
      toast.error("Failed to update user.");
    }
  };
  

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/users/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.userid !== selectedUserId));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err.message);
      toast.error("Failed to delete user.");
    } finally {
      closeDeleteModal();
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userfullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userdepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.useremail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-screen p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-center">
          <thead className="bg-gray-100 border-b border-gray-200 rounded-lg">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Full Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Username
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Department
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0
              ? filteredUsers.map(user =>
                  <tr
                    key={user.userid}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {user.userfullname}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {user.username}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {user.userdepartment}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      {user.useremail}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-200">
                      <button
                        onClick={() => openEditModal(user)}
                        className="w-20 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.userid)}
                        className="w-20 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              : <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 border border-gray-200"
                  >
                    No users found
                  </td>
                </tr>}
          </tbody>
        </table>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="userfullname"
                value={editUserData.userfullname}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={editUserData.username}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Department</label>
              <input
                type="text"
                name="userdepartment"
                value={editUserData.userdepartment}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                name="useremail"
                value={editUserData.useremail}
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
                onClick={saveUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-between space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={deleteUser}
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

export default UserList;