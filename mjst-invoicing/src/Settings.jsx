import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyAddress: "",
    companyProvince: "",
    companyZipCode: "",
    companyPhone: "",
    companyPIC: "",
    companyPICTitle: "",
    invoiceNotes: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/company-master", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setCompanyData(response.data);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting company data:", companyData);
      if (isEditing) {
        await axios.put("http://localhost:5000/company-master", companyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage("Company data updated successfully!");
      } else {
        await axios.post("http://localhost:5000/company-master", companyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage("Company data created successfully!");
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error saving company data:", error);
      setMessage("Error saving company data");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Company Master</h1>
        {/* Company Master Container With Data and Editable */}
        <div className="space-y-2">
          <div>
            <span className="font-medium">Company Name:</span> {companyData.companyName}
          </div>
          <div>
            <span className="font-medium">Company Address:</span> {companyData.companyAddress}
          </div>
          <div>
            <span className="font-medium">Company Province:</span> {companyData.companyProvince}
          </div>
          <div>
            <span className="font-medium">Company Zip Code:</span> {companyData.companyZipCode}
          </div>
          <div>
            <span className="font-medium">Company Phone:</span> {companyData.companyPhone}
          </div>
          <div>
            <span className="font-medium">Company PIC:</span> {companyData.companyPIC}
          </div>
          <div>
            <span className="font-medium">Company PIC Title:</span> {companyData.companyPICTitle}
          </div>
          <div>
            <span className="font-medium">Invoice Notes:</span> {companyData.invoiceNotes}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
              Company Address
            </label>
            <input
              type="text"
              id="companyAddress"
              name="companyAddress"
              value={companyData.companyAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyProvince" className="block text-sm font-medium text-gray-700">
              Company Province
            </label>
            <input
              type="text"
              id="companyProvince"
              name="companyProvince"
              value={companyData.companyProvince}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyZipCode" className="block text-sm font-medium text-gray-700">
              Company Zip Code
            </label>
            <input
              type="text"
              id="companyZipCode"
              name="companyZipCode"
              value={companyData.companyZipCode}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
              Company Phone
            </label>
            <input
              type="text"
              id="companyPhone"
              name="companyPhone"
              value={companyData.companyPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyPIC" className="block text-sm font-medium text-gray-700">
              Company PIC
            </label>
            <input
              type="text"
              id="companyPIC"
              name="companyPIC"
              value={companyData.companyPIC}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="companyPICTitle" className="block text-sm font-medium text-gray-700">
              Company PIC Title
            </label>
            <input
              type="text"
              id="companyPICTitle"
              name="companyPICTitle"
              value={companyData.companyPICTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="invoiceNotes" className="block text-sm font-medium text-gray-700">
              Invoice Notes
            </label>
            <textarea
              id="invoiceNotes"
              name="invoiceNotes"
              value={companyData.invoiceNotes}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {message && <p className="text-green-500">{message}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;