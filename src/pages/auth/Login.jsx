import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaSkype, FaPhoneAlt } from "react-icons/fa";
import { loginUser, socialLogin } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });

      // SAVE AUTH
      const authData = {
        user: data.user,
        token: data.token,
      };
      localStorage.setItem("auth", JSON.stringify(authData));

      // SAVE TO ACCOUNTS LIST (for switching)
      const accounts = JSON.parse(localStorage.getItem("gigup_accounts") || "[]");
      const exists = accounts.find(acc => acc.user.email === data.user.email);
      if (!exists) {
        accounts.push(authData);
        localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
      } else {
        // Update token if already exists
        const index = accounts.findIndex(acc => acc.user.email === data.user.email);
        accounts[index] = authData;
        localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
      }

      alert("Login Successful");
      navigate("/chat");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const data = await socialLogin(provider);

      // SAVE AUTH
      const authData = {
        user: data.user,
        token: data.token,
      };
      localStorage.setItem("auth", JSON.stringify(authData));

      // SAVE TO ACCOUNTS LIST (for switching)
      const accounts = JSON.parse(localStorage.getItem("gigup_accounts") || "[]");
      const exists = accounts.find(acc => acc.user.email === data.user.email);
      if (!exists) {
        accounts.push(authData);
        localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
      } else {
        const index = accounts.findIndex(acc => acc.user.email === data.user.email);
        accounts[index] = authData;
        localStorage.setItem("gigup_accounts", JSON.stringify(accounts));
      }

      alert(`${provider} login successful`);
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert(`${provider} login failed`);
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SECTION - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-start items-start bg-gradient-to-b from-black via-[#040914] to-[#0c1a30] text-[#fdf7f0] p-12 md:p-24 border-r border-white/5">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10 w-[350px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Connect Seamlessly
        </h1>
        <p className="text-xl text-[#dcd8d8] max-w-md">
          Gigup brings you closer to your friends and colleagues. Share messages, files, and experiences instantly.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 md:w-1/2 flex justify-center items-center bg-[#0b1220] p-4 md:p-12 min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/20 p-6 md:p-10 space-y-5 relative overflow-hidden">
          {/* Subtle whitish shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          {/* Mobile Logo - shown only on mobile */}
          <div className="flex justify-center mb-2 md:hidden relative z-10">
            <img src="/images/logo9.png" alt="Gigup" className="w-36 h-auto" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white text-center relative z-10">
            Welcome Back
          </h2>
          <p className="text-[#dcd8d8] text-center text-sm opacity-80 relative z-10">
            Login to access your Gigup account.
          </p>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#46a4de]" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#46a4de] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full btn-primary">
              Login
            </button>
          </form>

          <div className="my-4 text-center text-sm text-white/60 md:text-[#aaaaaa]">Or sign in using</div>

          {/* SOCIAL BUTTONS */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialLogin("google")}
            >
              <FaGoogle className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialLogin("skype")}
            >
              <FaSkype className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialLogin("facebook")}
            >
              <FaFacebookF className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialLogin("phone")}
            >
              <FaPhoneAlt className="text-[#fdf7f0]" />
            </button>
          </div>

          <p className="text-center text-sm text-white/80 md:text-gray-700 dark:text-white">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#49a2d8] font-medium">
              Register
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

export default Login;
