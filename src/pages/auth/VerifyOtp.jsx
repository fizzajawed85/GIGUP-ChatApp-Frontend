import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("OTP is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      alert(res.data.message);

      navigate(`/reset-password/${res.data.resetToken}`);
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT SECTION (same as Forgot Password) */}
      <div className="md:w-1/2 flex flex-col justify-start items-start bg-gradient-to-b from-[#000000] to-[#080e1b] text-[#fdf7f0] p-12 md:p-24">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10"
          style={{ width: "350px", height: "auto" }}
        />

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Verify OTP
        </h1>

        <p className="text-lg md:text-xl text-[#dcd8d8] max-w-md">
          Enter the 6-digit OTP sent to your registered email address to
          continue resetting your password.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="md:w-1/2 flex justify-center items-center bg-cream dark:bg-[#111827] p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10 space-y-6">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#fdf7f0] text-center">
            OTP Verification
          </h2>

          <p className="text-gray-500 dark:text-[#dcd8d8] text-center">
            Please enter the OTP we sent to your email.
          </p>

          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-base"
            />

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <p className="text-center text-sm">
            Didn’t receive OTP?{" "}
            <Link to="/forgot-password" className="text-[#49a2d8] font-medium">
              Resend
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

export default VerifyOtp;
