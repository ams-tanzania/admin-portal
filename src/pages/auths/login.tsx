import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/api_services/login";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToast = (message: string, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transform transition-all duration-300 ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("Please enter your email and password", "error");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(formData.email, formData.password);

      if (data.token) {
        // Store token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            staff_id: data.staff_id,
            first_name: data.first_name,
            last_name: data.last_name,
            position: data.position,
            branch: data.branch,
          })
        );

        showToast(`Welcome back, ${data.first_name}!`, "success");

        setTimeout(() => {
          window.location.href = "/admin-portal/#/dashboard";
        }, 1000);
      } else {
        showToast(data.message || "Login failed. Please try again.", "error");
        setIsLoading(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      showToast(message, "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://container-news.com/wp-content/uploads/2023/03/photo.png)",
        }}
      ></div>

      {/* Orange Gradient Overlay - Bottom Half Only */}
      <div className="absolute inset-0 bg-linear-to-t from-orange-600/90 via-orange-600/10 to-transparent"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-lg z-10">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-40"></div>

        <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-white to-white rounded-2xl mb-4 shadow-lg shadow-white/50">
              <img
                src="/admin-portal/logo.png"
                className="rounded-2xl"
                alt="Logo"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-300">Sign in to your admin account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Hidden platform field */}
            <input type="hidden" name="platform" value="web" />

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/70 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/70 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <button className="text-orange-400 hover:text-orange-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-600/90 text-white font-semibold rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;