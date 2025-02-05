import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [companyData, setCompanyData] = useState({
    companyname: "",
    companyaddress: "",
    companydirector: "",
    companydirtitle: "",
    companyphone: "",
    companypic: "",
    companypictitle: "",
    invoicenotes: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/company-master",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data) {
          setCompanyData(response.data);
        } else {
          setIsNew(true);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Saving company data:", companyData); // Debugging line
      if (isNew) {
        await axios.post("http://localhost:5000/company-master", companyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Company data created successfully!");
      } else {
        await axios.put("http://localhost:5000/company-master", companyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Company data updated successfully!");
      }
      setIsEditing(false);
      setIsNew(false);
    } catch (error) {
      console.error("Error saving company data:", error);
      toast.error("Failed to save company data.");
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Company Settings</h1>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companyname"
                  value={companyData.companyname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companyname}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Address
            </label>
            {isEditing
              ? <textarea
                  name="companyaddress"
                  value={companyData.companyaddress}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companyaddress}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Director
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companydirector"
                  value={companyData.companydirector}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companydirector}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companydirtitle"
                  value={companyData.companydirtitle}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companydirtitle}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Phone
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companyphone"
                  value={companyData.companyphone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companyphone}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company PIC
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companypic"
                  value={companyData.companypic}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companypic}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company PIC Title
            </label>
            {isEditing
              ? <input
                  type="text"
                  name="companypictitle"
                  value={companyData.companypictitle}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.companypictitle}
                </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Notes
            </label>
            {isEditing
              ? <textarea
                  name="invoicenotes"
                  value={companyData.invoicenotes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              : <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                  {companyData.invoicenotes}
                </p>}
          </div>
        </div>
        <div className="text-center">
          {isEditing
            ? <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  type="button"
                  className="w-20 inline-flex justify-center px-4 py-2 font-medium border border-transparent shadow-sm text-sm rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  type="submit"
                  className="w-20 inline-flex justify-center px-4 py-2 font-medium border border-transparent shadow-sm text-sm rounded-md text-white bg-blue-ribbon hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            : <button
                onClick={() => setIsEditing(true)}
                type="submit"
                className="inline-flex justify-center w-full px-4 py-2 font-medium border border-transparent shadow-sm text-sm rounded-md text-white bg-blue-ribbon hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </button>}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Settings;
