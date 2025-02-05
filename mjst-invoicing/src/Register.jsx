import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validatePassword = password => {
    const regex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long and include at least one number and one special character.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        fullname,
        username,
        department,
        email,
        password
      });
      toast.success("User created successfully!");
      // Reset form fields
      setFullname("");
      setUsername("");
      setDepartment("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Error creating user");
    }
  };

  return (
    <div className="w-full h-full p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl mb-1 font-bold text-gray-700">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name:
            </label>
            <input
              type="text"
              name="fullname"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department:
            </label>
            <input
              type="text"
              name="department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2  border border-transparent shadow-sm text-sm rounded-md text-white bg-blue-ribbon hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Register;