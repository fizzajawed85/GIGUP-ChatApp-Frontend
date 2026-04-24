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
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* LEFT SECTION - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-start bg-black text-[#fdf7f0] p-24 border-r border-white/5">
        <img
          src="/images/logo9.png"
          alt="Gigup Logo"
          className="mb-10 w-[350px] h-auto mix-blend-screen contrast-125"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Connect Seamlessly
        </h1>
        <p className="text-xl text-[#dcd8d8] max-w-md">
          Gigup brings you closer to your friends and colleagues. Share messages,
          files, and experiences instantly.
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
