import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Calendar, BookOpen, Edit, ArrowLeft } from "lucide-react";
import { getLoggedInUser } from "../api/userApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await getLoggedInUser();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/10">
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>

            <div>
              <p className="text-purple-300 text-sm font-medium tracking-wide uppercase mb-1">
                My Profile
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {user?.name || "Unknown"}
              </h1>
              <p className="text-blue-100 text-sm">
                Member since {new Date(user?.createdAt).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Account Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                    Name
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Link
                to="/my-blogs"
                className="flex items-center gap-3 w-full px-4 py-3 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 hover:opacity-90 text-white rounded-lg transition-opacity font-medium text-sm"
              >
                <BookOpen className="w-4 h-4" />
                My Blogs
              </Link>

              <Link
                to="/edit-profile"
                className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
