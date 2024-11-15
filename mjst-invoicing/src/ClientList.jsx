import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(
    () => {
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
    },
    [isAuthenticated]
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full p-8 bg-white rounded-lg shadow-lg h-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
          Client List
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Client Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  PIC
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  PIC Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Business Sector
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0
                ? clients.map(client =>
                    <tr
                      key={client.clientid}
                      className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {client.clientname}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {client.clientaddress &&
                          <React.Fragment>
                            <span className="block">
                              {client.clientaddress.split(",")[0]}
                            </span>
                            <span className="block">
                              {client.clientaddress.split(",")[1]}
                            </span>
                            <span className="block">
                              {`${client.clientaddress.split(
                                ","
                              )[2]}, ${client.clientprovince}`}
                            </span>
                            <span className="block">
                              {client.clientzipcode}
                            </span>
                          </React.Fragment>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {client.clientphone}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {client.clientpic}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {client.clientpictitle}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {client.businesssector}
                      </td>
                    </tr>
                  )
                : <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No clients found
                    </td>
                  </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
