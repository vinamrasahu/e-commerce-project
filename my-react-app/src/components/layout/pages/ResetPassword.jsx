import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (
      !formData.email ||
      !formData.otp ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );
      alert(res.data.message);

      navigate("/Register");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 text-center text-xs tracking-widest text-gray-500">
        HOME / <span className="text-gray-800">RESET PASSWORD</span>
      </div>

      <div className="flex justify-center items-center py-20 px-4">

        <div className="w-full max-w-md border border-gray-200 rounded-xl p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-center mb-2">
            Reset Password
          </h1>

          <p className="text-center text-gray-500 text-sm mb-8">
            Enter OTP and your new password.
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-purple-500"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  otp: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-purple-500"
            />

            <input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  newPassword: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-purple-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-purple-500"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md transition disabled:opacity-50"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}