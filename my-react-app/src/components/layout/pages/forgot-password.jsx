import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
  
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        { email }
      );
      alert(res.data.message);
  
      navigate("/reset-password", {
        state: { email }
      });
  
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 text-center text-xs tracking-widest text-gray-500">
        HOME / <span className="text-gray-800">FORGOT PASSWORD</span>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md border border-gray-200 rounded-xl p-8 bg-white shadow-sm">

          <h1 className="text-3xl font-bold text-center mb-2">
            Forgot Password
          </h1>

          <p className="text-gray-500 text-sm text-center mb-8">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-purple-500"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </div>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-purple-500 hover:underline"
            >
              Back to Login
            </a>
          </div>

        </div>
      </div>
    </div>
  );
} 