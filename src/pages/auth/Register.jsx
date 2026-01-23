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
      localStorage.setItem("auth", JSON.stringify(data));
      alert(`${provider} login successful`);
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert(`${provider} login failed`);
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
          Connect Seamlessly
        </h1>
        <p className="text-lg md:text-xl text-[#dcd8d8] max-w-md">
          Gigup brings you closer to your friends and colleagues. Share messages,
          files, and experiences instantly.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="md:w-1/2 flex justify-center items-center bg-cream dark:bg-[#111827] p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#fdf7f0] text-center">
            Register Account
          </h2>
          <p className="text-gray-500 dark:text-[#dcd8d8] text-center">
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

          <div className="my-6 text-center text-sm text-[#fdf7f0]">
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

          <p className="text-center text-sm">
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
