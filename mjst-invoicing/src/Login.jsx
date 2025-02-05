import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import Logo from "./assets/mjst png.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      const { token, username: user, fullname, department } = response.data;
      // Set token expiry to 60 minutes
      const expiryTimeInMinutes = 60;
      login(token, user, fullname, department, expiryTimeInMinutes);
      console.log("Token:", response.data.token);
      console.log("Username:", response.data.username);
      localStorage.setItem("token", response.data.token); // Save the token in local storage
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("fullname", response.data.fullname);
      localStorage.setItem("department", response.data.department);
      window.location.href = "/dashboard"; // Redirect to the dashboard
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error &&
            <p className="text-red-500">
              {error}
            </p>}
          <button
            type="submit"
                className="inline-flex justify-center w-full px-4 py-2 font-medium border border-transparent shadow-sm text-sm rounded-md text-white bg-blue-ribbon hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;