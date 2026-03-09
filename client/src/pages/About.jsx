import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Edit3,
  Eye,
  Code,
  Image,
  List,
  Heading,
  Quote,
  Lock,
  UserPlus,
  Zap,
  Heart,
  ArrowRight,
  Check,
} from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { getCurrentUser, logout, isAuthenticated } from "../utils/Auth";

const About = () => {
  // Calculate initial user state from localStorage
  const getInitialUser = () => {
    return getCurrentUser();
  };

  const [user, setUser] = useState(getInitialUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const token = isAuthenticated();

  const features = [
    {
      icon: Edit3,
      title: "Notion-Like Editor",
      description:
        "Rich text editor with markdown support, headings, lists, and formatting options.",
    },
    {
      icon: Code,
      title: "Code Blocks",
      description:
        "Inline code and dedicated code block sections with syntax highlighting support.",
    },
    {
      icon: Image,
      title: "Cover Images",
      description:
        "Add beautiful cover images to make your blogs visually appealing.",
    },
    {
      icon: Eye,
      title: "Live Preview",
      description:
        "Preview your blog in real-time before publishing with a modal preview.",
    },
    {
      icon: FileText,
      title: "Draft Support",
      description:
        "Save your work as drafts and continue writing whenever you want.",
    },
    {
      icon: Lock,
      title: "Authentication",
      description:
        "Secure login and signup system to protect your content and profile.",
    },
  ];

  const editorFeatures = [
    "Bold, Italic, Underline, Strikethrough",
    "Headings (H1, H2, H3)",
    "Bullet & Numbered Lists",
    "Blockquotes",
    "Inline Code & Code Blocks",
    "Cover Images",
    "Excerpts & Descriptions",
    "Undo/Redo",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Our Platform
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              A modern blogging platform inspired by Notion, designed for
              writers who love simplicity and powerful editing tools.
            </p>
          </div>
        </div>
      </div>

      {/* What is This Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4 mr-2" />
              What We Offer
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Notion-Like Blogging Experience
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our platform combines the best of both worlds: the simplicity of
              Notion's interface with powerful blogging capabilities. Write,
              format, and publish beautiful blog posts with ease.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Whether you're a developer sharing tutorials, a writer crafting
              stories, or a creator building your brand, our platform gives you
              the tools you need without the complexity.
            </p>
            <Link
              to={token ? "/" : "/signup"}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Key Highlights
            </h3>
            <div className="space-y-4">
              {[
                "Intuitive Notion-style editor",
                "Markdown shortcuts support",
                "Real-time preview mode",
                "Secure authentication system",
                "Draft auto-save feature",
                "Professional blog layouts",
              ].map((highlight, index) => (
                <div key={index} className="flex items-start">
                  <div className="shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create and share amazing blog posts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-auto text-sm text-gray-500 font-medium">
                  Editor
                </span>
              </div>

              <div className="space-y-3">
                {editorFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              <Edit3 className="w-4 h-4 mr-2" />
              Rich Text Editor
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Write with Style & Flexibility
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our editor supports all the formatting options you need to create
              professional blog posts. From simple text formatting to code
              blocks and images.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <Heading className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Headings
                </span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <List className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Lists</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <Code className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Code</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <Quote className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Quotes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="bg-linear-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Secure & Simple Authentication
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create your account and start blogging immediately. Your content
              is protected and only accessible to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
              >
                <Lock className="w-5 h-5 mr-2" />
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to Start Writing?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our platform today and experience the joy of writing with a
            beautiful, distraction-free editor.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-bold rounded-lg transition-colors text-lg"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Built with ❤️ for writers, developers, and creators everywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
