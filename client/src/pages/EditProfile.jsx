import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import { getLoggedInUser, updateUser } from "../api/userApi";
import { login } from "../utils/Auth";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getLoggedInUser();
        setUser(data);
        setForm((prev) => ({ ...prev, name: data.name, email: data.email }));
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSave = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const response = await updateUser(payload);
      login(response.data.token, response.data.user);
      setSuccess(true);
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/10">
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="text-purple-300 text-sm font-medium tracking-wide uppercase mb-1">
                Edit Profile
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {user?.name || "Unknown"}
              </h1>
              <p className="text-blue-100 text-sm">
                Update your account details below
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                  <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                  <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                  <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium mb-1.5">
                  <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            Profile updated successfully!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 hover:opacity-90 disabled:opacity-60 text-white rounded-lg transition-opacity font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
