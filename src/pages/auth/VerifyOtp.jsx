import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length < 6) {
      alert("Please enter full 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/auth/verify-otp`,
        { email, otp: otpString }
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
    <div className="min-h-screen w-full flex flex-row md:flex-row bg-[#0b1220] overflow-x-auto md:overflow-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* LEFT SECTION - Branding (Page 1 on mobile) */}
      <div className="w-full md:w-1/2 shrink-0 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-gradient-to-b from-black via-[#040914] to-[#0c1a30] text-[#fdf7f0] p-8 md:p-24 border-r border-white/5 snap-start min-h-screen md:min-h-0">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-8 md:mb-10 w-[250px] md:w-[350px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          Verify OTP
        </h1>
        <p className="text-base md:text-xl text-[#dcd8d8] max-w-md mx-auto md:mx-0">
          Enter the 6-digit OTP sent to your registered email address to
          continue resetting your password.
        </p>
        <div className="mt-10 md:hidden flex flex-col items-center gap-2 animate-bounce opacity-60">
           <span className="text-sm">Swipe to Verify</span>
           <div className="w-6 h-6 border-r-2 border-b-2 border-white rotate-[-45deg]"></div>
        </div>
      </div>

      {/* RIGHT SECTION - Form (Page 2 on mobile) */}
      <div className="w-full md:w-1/2 shrink-0 flex flex-col items-center justify-center p-4 md:p-8 snap-start min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-[#161d2f]/60 backdrop-blur-3xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.4)] border border-white/10 p-6 md:p-10 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              OTP Verification
            </h2>
            <p className="text-[#dcd8d8] text-sm opacity-60">
              Enter 6-digit code sent to <span className="text-sky-400">{email}</span>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleVerifyOtp}>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
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
