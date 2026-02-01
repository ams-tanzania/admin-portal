import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Settings,
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  email: string;
  role: "Admin" | "Manager" | "User" | "Customer" | "Guest";
  createdAt: string;
  avatar?: string;
  bio?: string;
  company?: string;
  website?: string;
}

const SettingsPage: React.FC = () => {
  // Get theme from outlet context
  const context = useOutletContext<{ isDarkTheme: boolean }>();
  const isDarkTheme = context?.isDarkTheme ?? false;

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences"
  >("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User profile state
  // TODO: Replace this with actual user data from your auth context/API
  // Example: const { user } = useAuth(); // Get from your auth context
  // Then use: const [profile, setProfile] = useState<User>(user);
  const [profile, setProfile] = useState<User>({
    id: "1",
    fullName: "Admin User",
    email: "admin@amstz.com",
    phone: "0675752254",
    location: "Bagamoyo",
    role: "Admin",
    createdAt: "2024-01-01",
    bio: "System administrator with full access to shipping management system",
    company: "East African Shipping Co.",
    website: "/",
  });

  const [profileForm, setProfileForm] = useState(profile);

  // Security settings
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newRequestAlerts: true,
    statusUpdateAlerts: true,
    paymentAlerts: true,
    systemUpdates: false,
  });

  // Preference settings
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "Africa/Dar_es_Salaam",
    dateFormat: "MM/DD/YYYY",
    currency: "TZS",
    itemsPerPage: 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate profile form
  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profileForm.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!profileForm.phone.trim()) newErrors.phone = "Phone is required";
    if (!profileForm.location.trim())
      newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate security form
  const validateSecurity = () => {
    const newErrors: Record<string, string> = {};

    if (!securityForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!securityForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (securityForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const handleSaveProfile = () => {
    if (validateProfile()) {
      setProfile(profileForm);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully",
        confirmButtonColor: "#f97316",
        timer: 2000,
      });
    }
  };

  // Change password
  const handleChangePassword = () => {
    if (validateSecurity()) {
      // In production, you would call your API here
      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "Your password has been changed successfully",
        confirmButtonColor: "#f97316",
        timer: 2000,
      });
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // Save notifications
  const handleSaveNotifications = () => {
    Swal.fire({
      icon: "success",
      title: "Notifications Updated!",
      text: "Your notification preferences have been saved",
      confirmButtonColor: "#f97316",
      timer: 2000,
    });
  };

  // Save preferences
  const handleSavePreferences = () => {
    Swal.fire({
      icon: "success",
      title: "Preferences Updated!",
      text: "Your preferences have been saved",
      confirmButtonColor: "#f97316",
      timer: 2000,
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1
              className={`text-3xl font-bold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
            >
              Settings
            </h1>
            <p
              className={`${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
            >
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div
          className={`lg:col-span-1 rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg p-4 h-fit`}
        >
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg"
                      : isDarkTheme
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div
              className={`rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg p-6`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                Profile Information
              </h2>

              {/* Avatar Upload */}
              <div className="mb-8 flex items-center gap-6">
                <div className="relative">
                  {profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white text-3xl font-bold">
                      {profileForm.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3
                    className={`text-xl font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    {profile.fullName}
                  </h3>
                  <p
                    className={`${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                  >
                    {profile.role}
                  </p>
                  <p
                    className={`text-sm ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                  >
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        fullName: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } ${errors.fullName ? "border-red-500" : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } ${errors.email ? "border-red-500" : ""}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="+255 XXX XXX XXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        location: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } ${errors.location ? "border-red-500" : ""}`}
                    placeholder="City, Country"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Company */}
                {/* <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileForm.company || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Your company name"
                  />
                </div> */}

                {/* Website */}
                {/* <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://yourwebsite.com"
                  />
                </div> */}

                {/* Bio */}
                {/* <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                </div> */}

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div
              className={`rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg p-6`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                Security Settings
              </h2>

              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDarkTheme
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } ${errors.currentPassword ? "border-red-500" : ""}`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkTheme ? "text-slate-400" : "text-gray-400"
                      }`}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={securityForm.newPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          newPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDarkTheme
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } ${errors.newPassword ? "border-red-500" : ""}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkTheme ? "text-slate-400" : "text-gray-400"
                      }`}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                  <p
                    className={`mt-1 text-xs ${isDarkTheme ? "text-slate-500" : "text-gray-500"}`}
                  >
                    Password must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDarkTheme
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } ${errors.confirmPassword ? "border-red-500" : ""}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkTheme ? "text-slate-400" : "text-gray-400"
                      }`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Change Password
                </button>

                {/* Two-Factor Authentication */}
                <div
                  className={`mt-8 p-6 rounded-xl border ${isDarkTheme ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Shield
                        className={`w-6 h-6 mt-1 ${isDarkTheme ? "text-green-400" : "text-green-500"}`}
                      />
                      <div>
                        <h3
                          className={`text-lg font-semibold ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                        >
                          Two-Factor Authentication
                        </h3>
                        <p
                          className={`text-sm mt-1 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                        >
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        isDarkTheme
                          ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div
              className={`rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg p-6`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                Notification Preferences
              </h2>

              <div className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    Notification Channels
                  </h3>

                  <div className="space-y-4">
                    <div
                      className={`flex items-center justify-between p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail
                          className={`w-5 h-5 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                        />
                        <div>
                          <p
                            className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                          >
                            Email Notifications
                          </p>
                          <p
                            className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                          >
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            emailNotifications:
                              !notifications.emailNotifications,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.emailNotifications
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.emailNotifications
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Bell
                          className={`w-5 h-5 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                        />
                        <div>
                          <p
                            className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                          >
                            Push Notifications
                          </p>
                          <p
                            className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                          >
                            Receive push notifications in browser
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: !notifications.pushNotifications,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.pushNotifications
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.pushNotifications
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 rounded-xl ${isDarkTheme ? "bg-slate-900" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Phone
                          className={`w-5 h-5 ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                        />
                        <div>
                          <p
                            className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                          >
                            SMS Notifications
                          </p>
                          <p
                            className={`text-sm ${isDarkTheme ? "text-slate-400" : "text-gray-600"}`}
                          >
                            Receive notifications via SMS
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            smsNotifications: !notifications.smsNotifications,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.smsNotifications
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.smsNotifications
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alert Types */}
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
                  >
                    Alert Types
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isDarkTheme ? "text-slate-300" : "text-gray-700"
                        }
                      >
                        New shipping requests
                      </span>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            newRequestAlerts: !notifications.newRequestAlerts,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.newRequestAlerts
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.newRequestAlerts
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isDarkTheme ? "text-slate-300" : "text-gray-700"
                        }
                      >
                        Status updates
                      </span>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            statusUpdateAlerts:
                              !notifications.statusUpdateAlerts,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.statusUpdateAlerts
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.statusUpdateAlerts
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isDarkTheme ? "text-slate-300" : "text-gray-700"
                        }
                      >
                        Payment alerts
                      </span>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            paymentAlerts: !notifications.paymentAlerts,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.paymentAlerts
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.paymentAlerts
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isDarkTheme ? "text-slate-300" : "text-gray-700"
                        }
                      >
                        System updates
                      </span>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            systemUpdates: !notifications.systemUpdates,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.systemUpdates
                            ? "bg-orange-500"
                            : isDarkTheme
                              ? "bg-slate-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications.systemUpdates
                              ? "translate-x-7"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div
              className={`rounded-xl ${isDarkTheme ? "bg-slate-800" : "bg-white"} shadow-lg p-6`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${isDarkTheme ? "text-white" : "text-gray-900"}`}
              >
                System Preferences
              </h2>

              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    <Globe className="w-4 h-4 inline mr-2" />
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        language: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        timezone: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="Africa/Dar_es_Salaam">
                      East Africa Time (GMT+3)
                    </option>
                    <option value="Africa/Nairobi">
                      East Africa Time (GMT+3)
                    </option>
                    <option value="Africa/Cairo">Egypt Time (GMT+2)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-slate-300" : "text-gray-700"}`}
                  >
                    Date Format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        dateFormat: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (01/31/2024)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/01/2024)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-01-31)</option>
                  </select>
                </div>

                {/* Currency */}
                {/* <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    Currency
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="TZS">Tanzanian Shilling (TZS)</option>
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div> */}

                {/* Items Per Page */}
                {/* <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    Items Per Page
                  </label>
                  <select
                    value={preferences.itemsPerPage}
                    onChange={(e) => setPreferences({ ...preferences, itemsPerPage: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div> */}

                <button
                  onClick={handleSavePreferences}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
