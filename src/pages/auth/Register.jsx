import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaSkype, FaPhoneAlt } from "react-icons/fa";
import { registerUser, socialLogin } from "../../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ FIXED REGISTER HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      // name ➝ username (backend match)
      const data = await registerUser({
        username,
        email,
        password,
      });

      alert(data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  const handleSocialRegister = async (provider) => {
    try {
      const data = await socialLogin(provider);

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
      }

      alert(`${provider} login successful`);
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert(`${provider} login failed`);
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
          Connect Seamlessly
        </h1>
        <p className="text-base md:text-xl text-[#dcd8d8] max-w-md mx-auto md:mx-0">
          Gigup brings you closer to your friends and colleagues. Share messages,
          files, and experiences instantly.
        </p>
        
        {/* Stylish Swipe Indicator - Mobile Only */}
        <div className="mt-12 md:hidden flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-pulse">
            <span className="text-sm font-semibold tracking-wider uppercase text-white/90">Swipe to Register</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 animate-[bounce-x_1.5s_infinite]"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Form (Page 2 on mobile) */}
      <div className="w-full md:w-1/2 shrink-0 flex flex-col items-center justify-center p-4 md:p-8 snap-start min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-[#161d2f]/60 backdrop-blur-3xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.4)] border border-white/10 p-6 md:p-10 space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Register Account
          </h2>
          <p className="text-[#dcd8d8] text-center text-sm opacity-80">
            Get your free Gigup account now.
          </p>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-base"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400">
              By registering you agree to the Gigup{" "}
              <span className="text-[#46a4de] font-medium">
                Terms of Use
              </span>
            </p>

            <button type="submit" className="w-full btn-primary">
              Register
            </button>
          </form>

          <div className="my-4 text-center text-sm text-white/60 md:text-[#aaaaaa]">
            Sign up using
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialRegister("google")}
            >
              <FaGoogle className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialRegister("skype")}
            >
              <FaSkype className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialRegister("facebook")}
            >
              <FaFacebookF className="text-[#fdf7f0]" />
            </button>
            <button
              className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-500 dark:hover:bg-[#1982c4] transition"
              onClick={() => handleSocialRegister("phone")}
            >
              <FaPhoneAlt className="text-[#fdf7f0]" />
            </button>
          </div>

          <p className="text-center text-sm text-white/80 md:text-gray-700 dark:text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-[#49a2d8] font-medium">
              Login
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

export default Register;
