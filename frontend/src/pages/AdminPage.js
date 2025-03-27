import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import api from "../services/api";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [musicTracks, setMusicTracks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [musicForm, setMusicForm] = useState({ title: "", artist: "", s3_url: "", id: null });
  const [userForm, setUserForm] = useState({ username: "", password: "", is_admin: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchMusicTracks();
      fetchUsers();
    }
  }, []);

  const fetchMusicTracks = async () => {
    try {
      const response = await api.get("/admin/music");
      setMusicTracks(response.data);
    } catch (error) {
      console.error("Error fetching music:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/admin");
  };

  const handleDeleteMusic = async (musicId) => {
    try {
      await api.delete(`/admin/music/${musicId}`);
      fetchMusicTracks();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };

  const handleSubmitMusic = async (e) => {
    e.preventDefault();
    try {
      if (musicForm.id) {
        await api.put(`/admin/music/${musicForm.id}`, musicForm);
      } else {
        await api.post("/admin/music", musicForm);
      }
      setMusicForm({ title: "", artist: "", s3_url: "", id: null });
      fetchMusicTracks();
    } catch (error) {
      console.error("Music form error:", error);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (userForm.id) {
        await api.put(`/admin/users/${userForm.id}`, userForm);
      } else {
        await api.post("/admin/users", userForm);
      }
      setUserForm({ username: "", password: "", is_admin: false, id: null });
      fetchUsers();
    } catch (error) {
      console.error("User form error:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-logo">🎧 Admin Dashboard</div>
        <nav>
          <Link to="/">🏠 Home</Link>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </header>

      {!isAuthenticated ? (
        <AdminLogin onLogin={() => {
          setIsAuthenticated(true);
          fetchMusicTracks();
          fetchUsers();
        }} />
      ) : (
        <div className="admin-content">
          {/* MUSIC MANAGEMENT */}
          <section className="music-management">
            <h2>🎼 Music Management</h2>

            <form className="admin-form" onSubmit={handleSubmitMusic}>
              <input
                type="text"
                placeholder="Title"
                value={musicForm.title}
                onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Artist"
                value={musicForm.artist}
                onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="S3 URL"
                value={musicForm.s3_url}
                onChange={(e) => setMusicForm({ ...musicForm, s3_url: e.target.value })}
                required
              />
              <button type="submit">{musicForm.id ? "Update" : "Add"} Track</button>
            </form>

            <div className="music-grid">
              {musicTracks.map((track) => (
                <div key={track.id} className="music-card">
                  <div className="music-info">
                    <h3>{track.title}</h3>
                    <p>{track.artist}</p>
                  </div>
                  <div className="music-actions">
                    <button onClick={() => setMusicForm({ ...track })}>✏️ Edit</button>
                    <button onClick={() => {
                      setSelectedTrackId(track.id);
                      setShowDeleteModal(true);
                    }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* USER MANAGEMENT */}
          <section className="user-management">
            <h2>👤 User Management</h2>

            <form className="admin-form" onSubmit={handleSubmitUser}>
              <input
                type="text"
                placeholder="Username"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!userForm.id}
              />
              <label>
                <input
                  type="checkbox"
                  checked={userForm.is_admin}
                  onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
                />
                Admin
              </label>
              <button type="submit">{userForm.id ? "Update" : "Add"} User</button>
            </form>

            <div className="user-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <p>{user.is_admin ? "Admin" : "Regular User"}</p>
                  </div>
                  <div className="user-actions">
                    <button onClick={() => setUserForm({ ...user, password: "" })}>✏️ Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this track?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={() => handleDeleteMusic(selectedTrackId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
