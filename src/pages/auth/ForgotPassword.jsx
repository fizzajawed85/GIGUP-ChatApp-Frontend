import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword({ email });

      // backend response
      alert(data.message);
      
      //  redirect to OTP verify page
      navigate("/verify-otp", {
      state: { email }
     });

      setEmail("");
    } catch (error) {
        console.error("Forgot Password Error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0b1220]">
      {/* LEFT SECTION - Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start bg-gradient-to-b from-black via-[#040914] to-[#0c1a30] text-[#fdf7f0] p-12 md:p-24 border-r border-white/5">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10 w-[350px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xl text-[#dcd8d8] max-w-md">
          Enter your registered email and we’ll send you instructions to reset
          your password.
        </p>
      </div>

      {/* RIGHT SECTION - Form (Direct on mobile) */}
      <div className="flex-1 md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="w-full max-w-md bg-[#161d2f]/60 backdrop-blur-3xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.4)] border border-white/10 p-6 md:p-10 space-y-5">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-2 md:hidden">
            <img src="/images/logo9.png" alt="Gigup" className="w-36 h-auto" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Forgot Password
          </h2>

          <p className="text-[#dcd8d8] text-center text-sm opacity-80">
            No worries, we’ll help you recover it.
          </p>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
