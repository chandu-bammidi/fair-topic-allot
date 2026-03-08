import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, role } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "student") navigate("/student");
      if (role === "faculty") navigate("/faculty");
      if (role === "admin") navigate("/admin");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-background">

    <div className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">

      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Fair Topic Allotment
      </h2>

      <p className="text-center text-gray-400 mb-8">
        Sign in to continue
      </p>

      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-textMain"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none text-textMain"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-accent p-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Login
        </button>

      </form>

    </div>
  </div>
);
}

export default Login;