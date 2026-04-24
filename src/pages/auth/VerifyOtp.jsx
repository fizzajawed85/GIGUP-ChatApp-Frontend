import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

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
        `${API_BASE_URL}/auth/verify-otp`,
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
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* LEFT SECTION - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start bg-black text-[#fdf7f0] p-24 border-r border-white/5">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10 w-[350px] h-auto mix-blend-screen contrast-125"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Verify OTP
        </h1>
        <p className="text-xl text-[#dcd8d8] max-w-md">
          Enter the 6-digit OTP sent to your registered email address to
          continue resetting your password.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 md:w-1/2 flex justify-center items-center bg-black p-4 md:p-12 min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-10 space-y-5">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-2 md:hidden">
            <img src="/images/logo9.png" alt="Gigup" className="w-36 h-auto mix-blend-screen contrast-125" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            OTP Verification
          </h2>

          <p className="text-[#dcd8d8] text-center text-sm opacity-80">
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

          <p className="text-center text-sm text-white/80 md:text-gray-700 dark:text-white">
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
