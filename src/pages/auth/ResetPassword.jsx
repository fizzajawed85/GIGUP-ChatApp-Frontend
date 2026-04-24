import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Password is required");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword(token, { password });
      alert(data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SECTION - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-start items-start bg-gradient-to-b from-[#000000] to-[#080e1b] text-[#fdf7f0] p-12 md:p-24 border-r border-white/5">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10 w-[350px] h-auto"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Create New Password
        </h1>
        <p className="text-xl text-[#dcd8d8] max-w-md">
          Please enter a strong new password for your Gigup account.
        </p>
      </div>


      {/* RIGHT SECTION */}
      <div className="flex-1 md:w-1/2 flex justify-center items-center bg-[#0b1220] p-4 md:p-12 min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 space-y-5">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-2 md:hidden">
            <img src="/images/logo9.png" alt="Gigup" className="w-36 h-auto" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Reset Password
          </h2>

          <p className="text-gray-500 dark:text-[#dcd8d8] text-center text-sm opacity-80">
            Enter your new password below to secure your account.
          </p>

          {/* FORM */}
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
            />

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-sm text-white/80 md:text-gray-700 dark:text-white">
            Remember your password?{" "}
            <Link to="/login" className="text-[#49a2d8] font-medium">
              Back to Login
            </Link>
          </p>

          <p className="text-xs text-center text-gray-400 mt-6">
            © 2026 Gigup. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
