import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import FloneNavbar from "./Navbar";
import FloneFooter from "./Footer/Footer";

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "", email: "" });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  // Counts the resend timer down to 0 once an OTP has been sent.
  // Without this effect, `timer` was set to 60 on send and never moved,
  // so "Resend OTP" could never appear.
  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      alert("Please enter both username/email and password");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: loginData.username,
          password: loginData.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      alert("Login Successful");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!registerData.username || !registerData.email || !registerData.password) {
      return alert("Fill all fields");
    }

    try {
      setOtpLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-register-otp`,
        {
          name: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }
      );

      alert("OTP Sent Successfully");
      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to Send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!otp) {
      return alert("Enter OTP");
    }

    try {
      setRegisterLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-register-otp`,
        {
          email: registerData.email,
          otp,
        }
      );

      alert("Registration Successful");
      console.log(res.data);

      setOtp("");
      setOtpSent(false);
      setRegisterData({ username: "", email: "", password: "" });
      setActiveTab("login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Allow pressing Enter inside an input to submit the active form
  const handleKeyDown = (e, submitFn) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFn();
    }
  };

  return (
    <>
      <FloneNavbar />
      <div className="min-h-screen w-full font-sans bg-white">

        {/* Breadcrumb */}
        <div className="w-full bg-gray-100 py-3 text-center text-xs tracking-widest text-gray-400 mt-8">
          HOME &nbsp;/&nbsp; <span className="text-gray-700 font-medium">LOGIN-REGISTER</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center px-4 py-14">

          {/* Tab Header — only switches tabs, does NOT submit */}
          <div className="flex items-center gap-0 mb-8">

            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`text-xl px-5 py-1 font-sans transition-colors duration-150 bg-transparent border-none cursor-pointer
              ${activeTab === "login" ? "font-bold text-gray-900" : "font-normal text-gray-400"}`}
            >
              LOGIN
            </button>
            <span className="text-gray-300 text-xl select-none">|</span>

            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`text-xl px-5 py-1 font-sans transition-colors duration-150 bg-transparent border-none cursor-pointer
              ${activeTab === "register" ? "font-bold text-purple-500" : "font-normal text-gray-400"}`}
            >
              REGISTER
            </button>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-md border border-gray-200 rounded-xl bg-white p-8 sm:p-10">

            {/* Login Form */}
            {activeTab === "login" && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username or Email"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showLoginPass ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showLoginPass ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loginLoading}
                    className="border border-gray-300 text-gray-800 text-xs font-bold tracking-widest px-6 py-2.5 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loginLoading ? "LOGGING IN..." : "LOGIN"}
                  </button>
                  <Link to="/forgot-password" className="text-xs text-purple-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-purple-500 hover:underline bg-transparent border-none cursor-pointer p-0 text-xs"
                  >
                    Register here
                  </button>
                </p>
              </div>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder=" Create Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, handleRegister)}
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 transition-colors"
                />
                <div className="relative">
                  <input
                    type={showRegisterPass ? "text" : "password"}
                    placeholder=" Create Password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, handleRegister)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPass(!showRegisterPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showRegisterPass ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, handleRegister)}
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 transition-colors"
                />
                {otpSent && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                  />
                )}
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="self-start border border-gray-300 px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? "SENDING..." : "SEND OTP"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={registerLoading}
                    className="self-start border border-gray-300 px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerLoading ? "VERIFYING..." : "VERIFY & REGISTER"}
                  </button>
                )}
                {otpSent && (
                  <div className="text-sm">
                    {timer > 0 ? (
                      <span>Resend OTP in {timer}s</span>
                    ) : (
                      <button type="button" onClick={handleSendOtp} className="text-purple-600">
                        Resend OTP
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-purple-500 hover:underline bg-transparent border-none cursor-pointer p-0 text-xs"
                  >
                    Login here
                  </button>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
      <FloneFooter />
    </>
  );
}