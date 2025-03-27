import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import MusicList from "../components/MusicList";
import "../styles/LibraryPage.css";
import Navbar from "../components/Navbar";

const LibraryPage = () => {
  const [libraryTracks, setLibraryTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await api.get("/library");
        setLibraryTracks(response.data);
      } catch (error) {
        console.error("Error fetching library:", error);
        // ⛔ If token is expired or invalid, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchLibrary();
  }, [navigate]);

  const filteredTracks = libraryTracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="library-page">
      <Navbar />
      <h1>My Library</h1>
      <input
        type="text"
        placeholder="Search tracks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <MusicList musicTracks={filteredTracks} onSelectTrack={() => {}} />
    </div>
  );
};

export default LibraryPage;
