import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/apiCalls";
import Navbar from "../../components/navbar/Navbar";
import "./profile.scss";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      // Here you would typically make an API call to update user profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      // Here you would make an API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Password changed successfully!");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      setErrors({ submit: "Failed to change password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout(dispatch);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion logic here
      alert("Account deletion would be implemented here");
    }
  };

  return (
    <div className="profile">
      <Navbar />
      
      <div className="profile__container">
        <div className="profile__header">
          <h1 className="profile__title">Account Settings</h1>
          <p className="profile__subtitle">Manage your account preferences and settings</p>
        </div>

        <div className="profile__content">
          {/* Tab Navigation */}
          <div className="profile__tabs">
            <button
              className={`profile__tab ${activeTab === "profile" ? "profile__tab--active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`profile__tab ${activeTab === "security" ? "profile__tab--active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
            <button
              className={`profile__tab ${activeTab === "preferences" ? "profile__tab--active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile__tab-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <h2>Profile Information</h2>
                  <button
                    className="profile__edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {success && (
                  <div className="profile__success">{success}</div>
                )}

                <form onSubmit={handleProfileUpdate} className="profile__form">
                  <div className="profile__field">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`profile__input ${errors.username ? 'profile__input--error' : ''}`}
                    />
                    {errors.username && (
                      <div className="profile__error">{errors.username}</div>
                    )}
                  </div>

                  <div className="profile__field">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`profile__input ${errors.email ? 'profile__input--error' : ''}`}
                    />
                    {errors.email && (
                      <div className="profile__error">{errors.email}</div>
                    )}
                  </div>

                  <div className="profile__field">
                    <label>Member Since</label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      disabled
                      className="profile__input profile__input--readonly"
                    />
                  </div>

                  {isEditing && (
                    <div className="profile__actions">
                      {errors.submit && (
                        <div className="profile__error">{errors.submit}</div>
                      )}
                      <button
                        type="submit"
                        className="profile__save-btn"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="profile__section">
                <h2>Security Settings</h2>

                {success && (
                  <div className="profile__success">{success}</div>
                )}

                <form onSubmit={handlePasswordChange} className="profile__form">
                  <div className="profile__field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`profile__input ${errors.currentPassword ? 'profile__input--error' : ''}`}
                    />
                    {errors.currentPassword && (
                      <div className="profile__error">{errors.currentPassword}</div>
                    )}
                  </div>

                  <div className="profile__field">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`profile__input ${errors.newPassword ? 'profile__input--error' : ''}`}
                    />
                    {errors.newPassword && (
                      <div className="profile__error">{errors.newPassword}</div>
                    )}
                  </div>

                  <div className="profile__field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`profile__input ${errors.confirmPassword ? 'profile__input--error' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <div className="profile__error">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="profile__error">{errors.submit}</div>
                  )}

                  <button
                    type="submit"
                    className="profile__save-btn"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </form>

                <div className="profile__danger-zone">
                  <h3>Danger Zone</h3>
                  <p>These actions cannot be undone.</p>
                  <div className="profile__danger-actions">
                    <button
                      onClick={handleLogout}
                      className="profile__logout-btn"
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="profile__delete-btn"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="profile__section">
                <h2>Preferences</h2>
                
                <div className="profile__preference-group">
                  <h3>Playback Settings</h3>
                  <div className="profile__field">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Autoplay next episode
                    </label>
                  </div>
                  <div className="profile__field">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Autoplay previews while browsing
                    </label>
                  </div>
                </div>

                <div className="profile__preference-group">
                  <h3>Language & Region</h3>
                  <div className="profile__field">
                    <label>Language</label>
                    <select className="profile__input">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>

                <div className="profile__preference-group">
                  <h3>Notifications</h3>
                  <div className="profile__field">
                    <label>
                      <input type="checkbox" defaultChecked />
                      New releases and recommendations
                    </label>
                  </div>
                  <div className="profile__field">
                    <label>
                      <input type="checkbox" />
                      Account updates and security alerts
                    </label>
                  </div>
                </div>

                <button className="profile__save-btn">
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
