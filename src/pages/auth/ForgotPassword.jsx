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
          Reset Your Password
        </h1>
        <p className="text-lg md:text-xl text-[#dcd8d8] max-w-md">
          Enter your registered email and we’ll send you instructions to reset
          your password.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="md:w-1/2 flex justify-center items-center bg-cream dark:bg-[#111827] p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#fdf7f0] text-center">
            Forgot Password
          </h2>

          <p className="text-gray-500 dark:text-[#dcd8d8] text-center">
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

export default ForgotPassword;
