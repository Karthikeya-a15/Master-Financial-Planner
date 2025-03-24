import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/layout/Navbar";
import { motion } from "framer-motion";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const {updateUser} = useAuth();
  const [currentUser, setCurrentUser] = useState({ name: "", age: 0, email: "", imageURL: "" });
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Profile | Darw-Invest";
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/v1/user/me`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put("/api/v1/user/profile", currentUser);
      setCurrentUser(response.data.user);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  const handleImageChange = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      await axios.post("/api/v1/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUserData();
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };


  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Profile Settings</h1>
              <p className="mt-1 text-secondary-600">Manage your account information</p>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center space-x-6 relative">
              <div className="relative inline-block">
                {/* Profile Picture */}
                <div className="h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-medium overflow-hidden">
                  <img src={currentUser.imageURL} alt="Profile Pic" className="h-full w-full object-cover" />
                </div>

                {/* Edit Icon Outside Image */}
                <label className="absolute -top-2 -right-3 bg-white p-2 rounded-full cursor-pointer shadow-md border border-gray-300">
                  <FiEdit className="text-blue-500 text-lg" /> {/* Increased size */}
                  <input type="file" accept=".png,.jpeg,.jpg" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">{currentUser?.name}</h2>
                  <p className="text-secondary-600">{currentUser?.email}</p>
                </div>
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-secondary-200">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      value={currentUser.name}
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className="input"
                      value={currentUser.age}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Security Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-secondary-200">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">Password</h3>
                  <p className="text-secondary-600">Update your password to keep your account secure</p>
                </div>
                <button onClick={handleChangePassword} className="btn btn-secondary">
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}