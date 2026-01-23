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
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT SECTION */}
      <div className="md:w-1/2 flex flex-col justify-start items-start bg-gradient-to-b from-[#000000] to-[#080e1b] text-[#fdf7f0] p-12 md:p-24">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10"
          style={{ width: "350px", height: "auto" }}
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
         Create New Password
        </h1>
        <p className="text-lg md:text-xl text-[#dcd8d8] max-w-md">
          Please enter a strong new password for your Gigup account.
        </p>
      </div>


      {/* RIGHT SECTION */}
      <div className="md:w-1/2 flex justify-center items-center bg-cream dark:bg-[#111827] p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#fdf7f0] text-center">
            Reset Password
          </h2>

          <p className="text-gray-500 dark:text-[#dcd8d8] text-center">
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

          <p className="text-center text-sm">
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
